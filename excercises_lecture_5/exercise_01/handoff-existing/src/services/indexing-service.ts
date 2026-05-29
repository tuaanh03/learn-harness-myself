import { v4 as uuidv4 } from 'uuid';
import { AppStatus, Chunk, Document } from '../shared/types';
import { PersistenceService } from './persistence-service';

const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
const CHUNKS_DIR = 'chunks';
const DOCUMENTS_META = 'documents-meta.json';
const CHUNK_SIZE = 500;

interface IndexStatus extends AppStatus {
  status: 'idle' | 'indexing' | 'ready' | 'error';
  currentIndexed: number;
  totalDocuments: number;
  lastIndexed: string | null;
}

export class IndexingService {
  private persistence: PersistenceService;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** Start indexing documents. If documentId is provided, index only that document. */
  async startIndexing(documentId?: string): Promise<IndexStatus> {
    const chunksMeta = this.readIndexMeta();

    if (documentId) {
      const content = this.persistence.readText(`content/${documentId}.txt`);
      if (!content) {
        this.updateDocumentIndexState(documentId, 'error');
        return { ...this.getStatus(), status: 'error', indexStatus: 'error' };
      }

      const chunks = this.chunkDocument(documentId, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${documentId}.json`, chunks);
      chunksMeta[documentId] = chunks.map(chunk => chunk.id);
      this.writeIndexMeta(chunksMeta);
      this.updateDocumentIndexState(documentId, 'indexed', chunks.length);
      return this.getStatus();
    }

    // Index all documents that haven't been indexed yet
    const docsMeta = this.readDocuments();

    for (const doc of docsMeta) {
      if (chunksMeta[doc.id]) continue;

      const content = this.persistence.readText(`content/${doc.id}.txt`);
      if (!content) {
        this.updateDocumentIndexState(doc.id, 'error');
        continue;
      }

      const chunks = this.chunkDocument(doc.id, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
      chunksMeta[doc.id] = chunks.map(c => c.id);
      this.updateDocumentIndexState(doc.id, 'indexed', chunks.length);
    }

    this.writeIndexMeta(chunksMeta);
    return this.getStatus();
  }

  /** Get current indexing status. */
  getStatus(): IndexStatus {
    const docs = this.readDocuments();
    const chunksMeta = this.readIndexMeta();
    const documentIds = new Set(docs.map(doc => doc.id));

    const currentIndexed = Object.keys(chunksMeta).filter(id => documentIds.has(id)).length;
    const totalDocuments = docs.length;
    const isReady = currentIndexed === totalDocuments && totalDocuments > 0;
    const hasError = docs.some(doc => doc.status === 'error');
    const status = hasError ? 'error' : isReady ? 'ready' : currentIndexed > 0 ? 'indexing' : 'idle';
    const lastIndexed = new Date().toISOString();

    return {
      status,
      currentIndexed,
      totalDocuments,
      lastIndexed,
      documentsLoaded: totalDocuments,
      indexStatus: status,
      lastActivity: lastIndexed,
    };
  }

  /** Get all chunks for a document. */
  getChunksForDocument(documentId: string): Chunk[] {
    return this.persistence.readJson<Chunk[]>(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
  }

  /** Get all chunks across all documents. */
  getAllChunks(): Chunk[] {
    const chunksMeta = this.readIndexMeta();
    const allChunks: Chunk[] = [];

    for (const docId of Object.keys(chunksMeta)) {
      const chunks = this.getChunksForDocument(docId);
      allChunks.push(...chunks);
    }

    return allChunks;
  }

  /** Split a document into chunks of ~500 characters at paragraph boundaries. */
  private chunkDocument(documentId: string, content: string): Chunk[] {
    const chunks: Chunk[] = [];

    const paragraphs = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);

    let buffer = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      if (paragraph.length > CHUNK_SIZE) {
        if (buffer.trim()) {
          chunks.push(this.createChunk(documentId, chunkIndex++, buffer.trim()));
          buffer = '';
        }

        for (const part of this.splitOversizedParagraph(paragraph)) {
          chunks.push(this.createChunk(documentId, chunkIndex++, part));
        }
        continue;
      }

      const nextBuffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
      if (nextBuffer.length > CHUNK_SIZE && buffer.length > 0) {
        chunks.push(this.createChunk(documentId, chunkIndex++, buffer.trim()));
        buffer = paragraph;
      } else {
        buffer = nextBuffer;
      }
    }

    if (buffer.trim()) {
      chunks.push(this.createChunk(documentId, chunkIndex, buffer.trim()));
    }

    return chunks;
  }

  private splitOversizedParagraph(paragraph: string): string[] {
    const parts: string[] = [];
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    let buffer = '';

    for (const word of words) {
      if (word.length > CHUNK_SIZE) {
        if (buffer.trim()) {
          parts.push(buffer.trim());
          buffer = '';
        }

        for (let index = 0; index < word.length; index += CHUNK_SIZE) {
          parts.push(word.slice(index, index + CHUNK_SIZE));
        }
        continue;
      }

      const nextBuffer = buffer ? `${buffer} ${word}` : word;
      if (nextBuffer.length > CHUNK_SIZE && buffer.length > 0) {
        parts.push(buffer.trim());
        buffer = word;
      } else {
        buffer = nextBuffer;
      }
    }

    if (buffer.trim()) {
      parts.push(buffer.trim());
    }

    return parts;
  }

  private createChunk(documentId: string, index: number, content: string): Chunk {
    return {
      id: uuidv4(),
      documentId,
      content,
      index,
      metadata: {
        charCount: String(content.length),
        wordCount: String(content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length),
      },
    };
  }

  private readDocuments(): Document[] {
    return this.persistence.readJson<Document[]>(DOCUMENTS_META) ?? [];
  }

  private writeDocuments(documents: Document[]): void {
    this.persistence.writeJson(DOCUMENTS_META, documents);
  }

  private readIndexMeta(): Record<string, string[]> {
    return (
      this.persistence.readJson<Record<string, string[]>>(INDEX_META) ??
      this.persistence.readJson<Record<string, string[]>>(LEGACY_INDEX_META) ??
      {}
    );
  }

  private writeIndexMeta(chunksMeta: Record<string, string[]>): void {
    this.persistence.writeJson(INDEX_META, chunksMeta);
  }

  private updateDocumentIndexState(
    documentId: string,
    status: Document['status'],
    chunks?: number
  ): void {
    const documents = this.readDocuments();
    const index = documents.findIndex(document => document.id === documentId);
    if (index === -1) return;

    documents[index] = {
      ...documents[index],
      status,
      chunks: chunks ?? documents[index].chunks,
    };
    this.writeDocuments(documents);
  }
}
