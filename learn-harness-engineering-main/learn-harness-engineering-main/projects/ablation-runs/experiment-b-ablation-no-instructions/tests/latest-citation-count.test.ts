import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LatestCitationCount } from '../src/renderer/components/LatestCitationCount';
import { QAHistory } from '../src/shared/types';

function historyEntry(citationCount: number): QAHistory {
  return {
    question: 'How is this supported?',
    response: {
      answer: 'Answer',
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      citations: Array.from({ length: citationCount }, (_, chunkIndex) => ({
        documentId: 'document',
        documentTitle: 'Reference',
        chunkIndex,
        excerpt: 'Evidence',
      })),
    },
  };
}

describe('latest citation count', () => {
  it('renders the number of citations from only the latest answer', () => {
    const markup = renderToStaticMarkup(createElement(LatestCitationCount, {
      history: [historyEntry(2), historyEntry(1)],
    }));

    expect(markup).toContain('Citations in latest answer: 1');
    expect(markup).not.toContain('Citations in latest answer: 2');
  });

  it('does not render a count before any answer exists', () => {
    const markup = renderToStaticMarkup(createElement(LatestCitationCount, { history: [] }));

    expect(markup).toBe('');
  });
});
