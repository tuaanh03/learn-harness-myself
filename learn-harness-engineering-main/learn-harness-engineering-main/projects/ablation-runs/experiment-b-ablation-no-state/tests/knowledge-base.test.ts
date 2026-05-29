import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { LatestAnswerConfidence } from '../src/renderer/components/LatestAnswerConfidence';
import { LatestCitationCount } from '../src/renderer/components/LatestCitationCount';
import { DocumentService } from '../src/services/document-service';
import { IndexingService } from '../src/services/indexing-service';
import { PersistenceService } from '../src/services/persistence-service';
import { QaService } from '../src/services/qa-service';
import { QAHistory } from '../src/shared/types';

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

describe('latest answer citation count', () => {
  function createHistory(citationCount: number, timestamp: string): QAHistory {
    return {
      question: 'Question',
      response: {
        answer: 'Answer',
        confidence: citationCount > 0 ? 0.85 : 0.3,
        timestamp,
        citations: Array.from({ length: citationCount }, (_, index) => ({
          documentId: `document-${index}`,
          documentTitle: `Document ${index}`,
          chunkIndex: index,
          excerpt: 'Excerpt',
        })),
      },
    };
  }

  it('renders the citation count from the newest response only', () => {
    const history = [
      createHistory(2, '2026-05-24T00:00:00.000Z'),
      createHistory(1, '2026-05-25T00:00:00.000Z'),
    ];

    const markup = renderToStaticMarkup(createElement(LatestCitationCount, { history }));

    expect(markup).toContain('Citations in latest answer:');
    expect(markup).toContain('>1</strong>');
    expect(markup).not.toContain('>2</strong>');
  });

  it('renders zero when the latest response has no citations', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestCitationCount, {
        history: [createHistory(0, '2026-05-25T00:00:00.000Z')],
      }),
    );

    expect(markup).toContain('>0</strong>');
  });
});

describe('latest answer confidence', () => {
  function createHistory(confidence: number): QAHistory {
    return {
      question: 'Question',
      response: {
        answer: 'Answer',
        confidence,
        timestamp: '2026-05-25T00:00:00.000Z',
        citations: [],
      },
    };
  }

  it('renders nothing before an answer exists', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerConfidence, { history: [] }),
    );

    expect(markup).toBe('');
  });

  it.each([
    [0.8, 'High'],
    [0.79, 'Medium'],
    [0.5, 'Medium'],
    [0.49, 'Low'],
  ])('renders %s as %s', (confidence, label) => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerConfidence, {
        history: [createHistory(confidence)],
      }),
    );

    expect(markup).toContain(`>${label}</strong>`);
  });

  it('renders confidence from the newest answer only', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerConfidence, {
        history: [createHistory(0.9), createHistory(0.3)],
      }),
    );

    expect(markup).toContain('>Low</strong>');
    expect(markup).not.toContain('>High</strong>');
  });
});
