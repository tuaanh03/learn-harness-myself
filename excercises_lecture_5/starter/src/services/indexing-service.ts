import { v4 as uuidv4 } from 'uuid';
import { AppStatus, Chunk, Document } from '../shared/types';
import { PersistenceService } from './persistence-service';

const INDEX_META = 'index/index-meta.json';
const LEGACY_INDEX_META = 'index-meta.json';
const CHUNKS_DIR = 'chunks';
const TARGET_CHUNK_SIZE = 500;

export class IndexingService {
  private persistence: PersistenceService;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** Start indexing documents. If documentId is provided, index only that document. */
  async startIndexing(documentId?: string): Promise<AppStatus> {
    const docs = this.readDocuments();
    const chunksMeta = this.readIndexMeta();
    const targetDocs = documentId ? docs.filter(doc => doc.id === documentId) : docs;

    if (documentId && targetDocs.length === 0) {
      return { ...this.getStatus(), indexStatus: 'error' };
    }

    for (const doc of targetDocs) {
      if (!documentId && chunksMeta[doc.id]) continue;

      doc.status = 'indexing';
      const content = this.persistence.readText(`content/${doc.id}.txt`);
      if (content === null) {
        doc.status = 'error';
        continue;
      }

      const chunks = this.chunkDocument(doc.id, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
      chunksMeta[doc.id] = chunks.map(chunk => chunk.id);
      doc.status = 'indexed';
      doc.chunks = chunks.length;
    }

    this.writeDocuments(docs);
    this.persistence.writeJson(INDEX_META, chunksMeta);
    return this.getStatus();
  }

  /** Get current indexing status. */
  getStatus(): AppStatus {
    const docs = this.readDocuments();
    const chunksMeta = this.readIndexMeta();

    const currentIndexed = docs.filter(doc =>
      Object.prototype.hasOwnProperty.call(chunksMeta, doc.id)
    ).length;
    const totalDocuments = docs.length;
    const erroredDocuments = docs.filter(doc => doc.status === 'error').length;
    const pendingDocuments = Math.max(totalDocuments - currentIndexed - erroredDocuments, 0);
    const indexedChunks = docs.reduce((sum, doc) => sum + (chunksMeta[doc.id]?.length ?? 0), 0);
    const indexStatus = erroredDocuments > 0
      ? 'error'
      : totalDocuments > 0 && currentIndexed === totalDocuments
        ? 'ready'
        : currentIndexed > 0
          ? 'indexing'
          : 'idle';

    return {
      documentsLoaded: totalDocuments,
      indexStatus,
      lastActivity: new Date().toISOString(),
      currentIndexed,
      totalDocuments,
      pendingDocuments,
      erroredDocuments,
      indexedChunks,
    };
  }

  /** Get all chunks for a document. */
  getChunksForDocument(documentId: string): Chunk[] {
    return this.persistence.readJson<Chunk[]>(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
  }

  /** Get all chunks across all documents. */
  getAllChunks(): Chunk[] {
    const chunksMeta = this.readIndexMeta();
    const docIds = new Set(this.readDocuments().map(doc => doc.id));
    const allChunks: Chunk[] = [];

    for (const docId of Object.keys(chunksMeta)) {
      if (!docIds.has(docId)) continue;
      const chunks = this.getChunksForDocument(docId);
      allChunks.push(...chunks);
    }

    return allChunks;
  }

  /** Split a document into chunks of ~500 characters at paragraph boundaries. */
  private chunkDocument(documentId: string, content: string): Chunk[] {
    const chunks: Chunk[] = [];
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    if (!normalized) return chunks;

    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
    let buffer: string[] = [];
    let bufferLength = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      for (const part of this.splitOversizedParagraph(paragraph)) {
        const separatorLength = buffer.length > 0 ? 2 : 0;
        if (bufferLength > 0 && bufferLength + separatorLength + part.length > TARGET_CHUNK_SIZE) {
          chunks.push(this.createChunk(documentId, chunkIndex++, buffer.join('\n\n')));
          buffer = [];
          bufferLength = 0;
        }

        buffer.push(part);
        bufferLength += (buffer.length > 1 ? 2 : 0) + part.length;
      }
    }

    if (buffer.length > 0) {
      chunks.push(this.createChunk(documentId, chunkIndex, buffer.join('\n\n')));
    }

    return chunks;
  }

  private splitOversizedParagraph(paragraph: string): string[] {
    if (paragraph.length <= TARGET_CHUNK_SIZE) {
      return [paragraph];
    }

    const parts: string[] = [];
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    let buffer = '';

    for (const word of words) {
      if (word.length > TARGET_CHUNK_SIZE) {
        if (buffer) {
          parts.push(buffer);
          buffer = '';
        }
        for (let start = 0; start < word.length; start += TARGET_CHUNK_SIZE) {
          parts.push(word.slice(start, start + TARGET_CHUNK_SIZE));
        }
        continue;
      }

      const next = buffer ? `${buffer} ${word}` : word;
      if (next.length > TARGET_CHUNK_SIZE && buffer) {
        parts.push(buffer);
        buffer = word;
      } else {
        buffer = next;
      }
    }

    if (buffer) {
      parts.push(buffer);
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
        wordCount: String(this.countWords(content)),
      },
    };
  }

  private countWords(content: string): number {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  private readDocuments(): Document[] {
    return this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
  }

  private writeDocuments(docs: Document[]): void {
    this.persistence.writeJson('documents-meta.json', docs);
  }

  private readIndexMeta(): Record<string, string[]> {
    return (
      this.persistence.readJson<Record<string, string[]>>(INDEX_META) ??
      this.persistence.readJson<Record<string, string[]>>(LEGACY_INDEX_META) ??
      {}
    );
  }
}
