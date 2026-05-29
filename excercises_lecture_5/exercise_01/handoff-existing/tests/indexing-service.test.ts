import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IndexingService } from '../src/services/indexing-service';
import { PersistenceService } from '../src/services/persistence-service';
import { Document } from '../src/shared/types';

function createTempPersistence(prefix: string): { tempDir: string; persistence: PersistenceService } {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return {
    tempDir,
    persistence: new PersistenceService(path.join(tempDir, 'data')),
  };
}

function storeDocument(
  persistence: PersistenceService,
  id: string,
  filename: string,
  content: string
): Document {
  const document: Document = {
    id,
    title: filename.replace(/\.[^.]+$/, ''),
    filename,
    importedAt: '2026-05-29T00:00:00.000Z',
    size: Buffer.byteLength(content, 'utf-8'),
    metadata: {
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      lineCount: content.length === 0 ? 0 : content.split(/\r\n|\r|\n/).length,
      fileType: filename.endsWith('.md') ? 'markdown' : 'text',
    },
    status: 'imported',
  };

  persistence.writeJson('documents-meta.json', [document]);
  persistence.writeText(`content/${id}.txt`, content);
  return document;
}

describe('IndexingService', () => {
  it('indexes a document into paragraph-aware chunks and records metadata', async () => {
    const { tempDir, persistence } = createTempPersistence('kb-indexing-');

    try {
      const paragraphOne = 'Alpha '.repeat(40).trim();
      const paragraphTwo = 'Beta '.repeat(48).trim();
      const paragraphThree = 'Gamma '.repeat(40).trim();
      const content = [paragraphOne, paragraphTwo, paragraphThree].join('\n\n');
      const document = storeDocument(persistence, 'doc-1', 'notes.txt', content);
      const service = new IndexingService(persistence);

      const status = await service.startIndexing(document.id);
      const chunks = service.getChunksForDocument(document.id);

      expect(status.status).toBe('ready');
      expect(status.indexStatus).toBe('ready');
      expect(status.currentIndexed).toBe(1);
      expect(status.documentsLoaded).toBe(1);
      expect(chunks).toHaveLength(2);
      expect(chunks[0]?.content).toBe(`${paragraphOne}\n\n${paragraphTwo}`);
      expect(chunks[1]?.content).toBe(paragraphThree);
      expect(chunks.every(chunk => Number(chunk.metadata.charCount) <= 500)).toBe(true);
      expect(chunks[0]?.metadata.wordCount).toBe('88');

      const indexMeta = persistence.readJson<Record<string, string[]>>('index/index-meta.json');
      expect(indexMeta?.[document.id]).toEqual(chunks.map(chunk => chunk.id));
      expect(service.getAllChunks()).toEqual(chunks);

      const documents = persistence.readJson<Document[]>('documents-meta.json') ?? [];
      expect(documents[0]?.status).toBe('indexed');
      expect(documents[0]?.chunks).toBe(2);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('splits oversized paragraphs on word boundaries', async () => {
    const { tempDir, persistence } = createTempPersistence('kb-indexing-long-');

    try {
      const content = 'retrieval '.repeat(80).trim();
      const document = storeDocument(persistence, 'doc-2', 'long.md', content);
      const service = new IndexingService(persistence);

      await service.startIndexing(document.id);
      const chunks = service.getChunksForDocument(document.id);

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.content.length <= 500)).toBe(true);
      expect(chunks.every(chunk => chunk.content.trim().length > 0)).toBe(true);
      expect(chunks.map(chunk => chunk.content).join(' ')).toBe(content);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
