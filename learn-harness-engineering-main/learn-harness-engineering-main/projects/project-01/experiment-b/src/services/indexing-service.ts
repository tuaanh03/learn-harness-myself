import { v4 as uuidv4 } from 'uuid';
import { AppStatus, Chunk, Document, IndexManifest, IndexStatus } from '../shared/types';
import { PersistenceService } from './persistence-service';

const DOCUMENTS_META = 'documents-meta.json';
const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
const CHUNKS_DIR = 'chunks';

function isIndexManifest(value: IndexManifest | Record<string, string[]>): value is IndexManifest {
  return 'documents' in value && 'lastIndexed' in value && !Array.isArray(value.documents);
}

export class IndexingService {
  private readonly persistence: PersistenceService;
  private isIndexing = false;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** Start indexing one document or rebuild the complete library index. */
  async startIndexing(documentId?: string): Promise<IndexStatus> {
    const docs = this.readDocuments();
    const targets = documentId ? docs.filter(doc => doc.id === documentId) : docs;
    if (documentId && targets.length === 0) {
      throw new Error('Document was not found.');
    }

    const manifest = this.readIndexManifest();
    this.isIndexing = true;

    try {
      for (const doc of targets) {
        this.updateDocument(doc.id, { status: 'indexing' });
        const content = this.persistence.readText(`content/${doc.id}.txt`);
        if (content === null) {
          this.updateDocument(doc.id, { status: 'error' });
          throw new Error(`Stored content is missing for "${doc.title}".`);
        }

        const chunks = this.chunkDocument(doc.id, content);
        this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
        manifest.documents[doc.id] = chunks.map(chunk => chunk.id);
        this.updateDocument(doc.id, { status: 'indexed', chunks: chunks.length });
        manifest.lastIndexed = new Date().toISOString();
        this.persistence.writeJson(INDEX_META, manifest);
      }

      manifest.lastIndexed = new Date().toISOString();
      this.persistence.writeJson(INDEX_META, manifest);
    } finally {
      this.isIndexing = false;
    }

    return this.getStatus();
  }

  /** Get persisted library indexing status. */
  getStatus(): IndexStatus {
    const docs = this.readDocuments();
    const manifest = this.readIndexManifest();
    const currentIndexed = docs.filter(doc => manifest.documents[doc.id] !== undefined).length;
    let status: IndexStatus['status'] = 'idle';

    if (this.isIndexing) {
      status = 'indexing';
    } else if (docs.some(doc => doc.status === 'error')) {
      status = 'error';
    } else if (docs.length > 0 && currentIndexed === docs.length) {
      status = 'ready';
    }

    return {
      status,
      currentIndexed,
      totalDocuments: docs.length,
      lastIndexed: manifest.lastIndexed,
    };
  }

  getAppStatus(): AppStatus {
    const indexStatus = this.getStatus();
    const docs = this.readDocuments();
    return {
      documentsLoaded: docs.length,
      indexStatus: indexStatus.status,
      lastActivity: indexStatus.lastIndexed ?? docs[docs.length - 1]?.importedAt ?? '',
    };
  }

  /** Get all chunks for a document. */
  getChunksForDocument(documentId: string): Chunk[] {
    return this.persistence.readJson<Chunk[]>(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
  }

  /** Get all indexed chunks across all documents. */
  getAllChunks(): Chunk[] {
    const manifest = this.readIndexManifest();
    return Object.keys(manifest.documents).flatMap(documentId => this.getChunksForDocument(documentId));
  }

  /** Split a document into chunks of roughly 500 characters at paragraph boundaries. */
  private chunkDocument(documentId: string, content: string): Chunk[] {
    const chunkSize = 500;
    const chunks: Chunk[] = [];
    const paragraphs = content.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    let buffer = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      if (buffer.length + paragraph.length > chunkSize && buffer.length > 0) {
        chunks.push(this.createChunk(documentId, chunkIndex++, buffer.trim()));
        buffer = paragraph;
      } else {
        buffer += (buffer ? '\n\n' : '') + paragraph;
      }
    }

    if (buffer.trim()) {
      chunks.push(this.createChunk(documentId, chunkIndex, buffer.trim()));
    }

    return chunks;
  }

  private createChunk(documentId: string, index: number, content: string): Chunk {
    return {
      id: uuidv4(),
      documentId,
      content,
      index,
      metadata: {
        charCount: String(content.length),
        wordCount: String(content.split(/\s+/).length),
      },
    };
  }

  private readDocuments(): Document[] {
    return this.persistence.readJson<Document[]>(DOCUMENTS_META) ?? [];
  }

  private updateDocument(id: string, updates: Partial<Document>): void {
    const documents = this.readDocuments();
    const index = documents.findIndex(document => document.id === id);
    if (index === -1) return;
    documents[index] = { ...documents[index], ...updates };
    this.persistence.writeJson(DOCUMENTS_META, documents);
  }

  private readIndexManifest(): IndexManifest {
    const stored = this.persistence.readJson<IndexManifest | Record<string, string[]>>(INDEX_META)
      ?? this.persistence.readJson<IndexManifest | Record<string, string[]>>(LEGACY_INDEX_META);
    if (stored && isIndexManifest(stored)) {
      return stored;
    }
    return { documents: stored ?? {}, lastIndexed: null };
  }
}
