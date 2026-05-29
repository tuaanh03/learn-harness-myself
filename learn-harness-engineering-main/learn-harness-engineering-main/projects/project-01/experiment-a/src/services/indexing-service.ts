import { v4 as uuidv4 } from 'uuid';
import { AppStatus, Chunk, Document } from '../shared/types';
import { PersistenceService } from './persistence-service';

const INDEX_META = 'index-meta.json';
const INDEX_ACTIVITY = 'index-activity.json';
const DOCUMENTS_META = 'documents-meta.json';
const CHUNKS_DIR = 'chunks';

interface IndexActivity {
  lastActivity: string;
  error: boolean;
}

export class IndexingService {
  private persistence: PersistenceService;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** Start indexing documents. If documentId is provided, index only that document. */
  async startIndexing(documentId?: string): Promise<AppStatus> {
    const docsMeta = this.persistence.readJson<Document[]>(DOCUMENTS_META) ?? [];
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
    const requestedDocs = documentId
      ? docsMeta.filter(doc => doc.id === documentId)
      : docsMeta;

    if (documentId && requestedDocs.length === 0) {
      this.writeActivity(true);
      return this.getStatus();
    }

    for (const doc of requestedDocs) {
      const content = this.persistence.readText(`content/${doc.id}.txt`);
      if (content === null) {
        doc.status = 'error';
        continue;
      }

      doc.status = 'indexing';
      const chunks = this.chunkDocument(doc.id, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
      chunksMeta[doc.id] = chunks.map(c => c.id);
      doc.status = 'indexed';
      doc.chunks = chunks.length;
    }

    this.persistence.writeJson(INDEX_META, chunksMeta);
    this.persistence.writeJson(DOCUMENTS_META, docsMeta);
    this.writeActivity(requestedDocs.some(doc => doc.status === 'error'));
    return this.getStatus();
  }

  /** Get current indexing status. */
  getStatus(): AppStatus {
    const docs = this.persistence.readJson<Document[]>(DOCUMENTS_META) ?? [];
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
    const activity = this.persistence.readJson<IndexActivity>(INDEX_ACTIVITY);
    const indexedDocuments = docs.filter(doc => Boolean(chunksMeta[doc.id])).length;
    const hasErrors = docs.some(doc => doc.status === 'error') || Boolean(activity?.error);
    const isReady = indexedDocuments === docs.length && docs.length > 0;

    return {
      documentsLoaded: docs.length,
      indexedDocuments,
      indexStatus: hasErrors ? 'error' : isReady ? 'ready' : indexedDocuments > 0 ? 'indexing' : 'idle',
      lastActivity: activity?.lastActivity ?? '',
    };
  }

  /** Remove persisted chunks for a deleted document. */
  deleteIndex(documentId: string): void {
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
    delete chunksMeta[documentId];
    this.persistence.writeJson(INDEX_META, chunksMeta);
    this.persistence.delete(`${CHUNKS_DIR}/${documentId}.json`);
    this.writeActivity(false);
  }

  /** Get all chunks for a document. */
  getChunksForDocument(documentId: string): Chunk[] {
    const docs = this.persistence.readJson<Document[]>(DOCUMENTS_META) ?? [];
    if (!docs.some(doc => doc.id === documentId)) return [];
    return this.persistence.readJson<Chunk[]>(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
  }

  /** Get all chunks across all documents. */
  getAllChunks(): Chunk[] {
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
    const allChunks: Chunk[] = [];

    for (const docId of Object.keys(chunksMeta)) {
      const chunks = this.getChunksForDocument(docId);
      allChunks.push(...chunks);
    }

    return allChunks;
  }

  /** Split a document into chunks of ~500 characters at paragraph boundaries. */
  private chunkDocument(documentId: string, content: string): Chunk[] {
    const CHUNK_SIZE = 500;
    const chunks: Chunk[] = [];

    // Split on double newlines (paragraphs)
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    let buffer = '';
    let chunkIndex = 0;

    for (const para of paragraphs) {
      if (buffer.length + para.length > CHUNK_SIZE && buffer.length > 0) {
        chunks.push(this.createChunk(documentId, chunkIndex++, buffer.trim()));
        buffer = para;
      } else {
        buffer += (buffer ? '\n\n' : '') + para;
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

  private writeActivity(error: boolean): void {
    this.persistence.writeJson<IndexActivity>(INDEX_ACTIVITY, {
      lastActivity: new Date().toISOString(),
      error,
    });
  }
}
