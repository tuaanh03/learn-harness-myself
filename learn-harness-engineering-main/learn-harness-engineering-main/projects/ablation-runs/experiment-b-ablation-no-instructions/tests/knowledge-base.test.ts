import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { DocumentService } from '../src/services/document-service';
import { IndexingService } from '../src/services/indexing-service';
import { PersistenceService } from '../src/services/persistence-service';
import { QaService } from '../src/services/qa-service';

const temporaryDirectories: string[] = [];

function createServices() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-base-test-'));
  temporaryDirectories.push(root);
  const sourcePath = path.join(root, 'retrieval-plan.md');
  fs.writeFileSync(
    sourcePath,
    '# Retrieval Plan\n\nRetrieval uses keyword search over indexed chunks and supplies citations.',
    'utf-8',
  );
  const persistence = new PersistenceService(path.join(root, 'data'));
  const indexing = new IndexingService(persistence);
  return {
    sourcePath,
    persistence,
    documents: new DocumentService(persistence),
    indexing,
    qa: new QaService(persistence, indexing),
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('knowledge base document lifecycle', () => {
  it('imports, indexes, answers with citations, persists history, and deletes artifacts', async () => {
    const services = createServices();
    const document = services.documents.importDocument(services.sourcePath);

    expect(document.status).toBe('imported');
    expect(services.persistence.exists(`content/${document.id}.txt`)).toBe(true);

    const indexStatus = await services.indexing.startIndexing(document.id);
    expect(indexStatus.status).toBe('ready');
    expect(services.documents.getDocument(document.id)?.status).toBe('indexed');
    expect(services.indexing.getChunksForDocument(document.id).length).toBeGreaterThan(0);
    expect(services.persistence.exists('index/index-meta.json')).toBe(true);
    expect(services.indexing.getAppStatus()).toMatchObject({
      documentsLoaded: 1,
      indexStatus: 'ready',
    });

    const answer = await services.qa.ask('How does retrieval search use indexed chunks?');
    expect(answer.confidence).toBe(0.85);
    expect(answer.citations[0]?.documentTitle).toBe('retrieval-plan');
    expect(services.qa.getHistory()).toHaveLength(1);

    expect(services.documents.deleteDocument(document.id)).toBe(true);
    expect(services.documents.listDocuments()).toEqual([]);
    expect(services.persistence.exists(`content/${document.id}.txt`)).toBe(false);
    expect(services.persistence.exists(`chunks/${document.id}.json`)).toBe(false);
    expect(services.indexing.getAllChunks()).toEqual([]);
  });

  it('rejects unsupported document formats', () => {
    const services = createServices();
    const unsupportedPath = path.join(path.dirname(services.sourcePath), 'notes.pdf');
    fs.writeFileSync(unsupportedPath, 'not supported', 'utf-8');

    expect(() => services.documents.importDocument(unsupportedPath)).toThrow(
      'Only .txt and .md documents can be imported.',
    );
  });
});
