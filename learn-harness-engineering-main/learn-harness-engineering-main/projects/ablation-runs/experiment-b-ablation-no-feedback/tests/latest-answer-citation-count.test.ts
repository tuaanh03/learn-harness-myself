import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LatestAnswerCitationCount } from '../src/renderer/components/LatestAnswerCitationCount';
import { QAHistory } from '../src/shared/types';

function historyEntry(citationCount: number, timestamp: string): QAHistory {
  return {
    question: 'How is this verified?',
    response: {
      answer: 'An answer.',
      citations: Array.from({ length: citationCount }, (_, index) => ({
        documentId: `document-${index}`,
        documentTitle: `Document ${index}`,
        chunkIndex: index,
        excerpt: 'Relevant excerpt.',
      })),
      confidence: citationCount > 0 ? 0.85 : 0.3,
      timestamp,
    },
  };
}

describe('latest answer citation count', () => {
  it('renders no indicator before an answer exists', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerCitationCount, { history: [] }),
    );

    expect(markup).toBe('');
  });

  it('renders the citation count from the most recent answer, including zero', () => {
    const history = [
      historyEntry(2, '2026-05-25T01:00:00.000Z'),
      historyEntry(0, '2026-05-25T02:00:00.000Z'),
    ];
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerCitationCount, { history }),
    );

    expect(markup).toContain('Citations in latest answer:');
    expect(markup).toContain('<strong');
    expect(markup).toContain('>0</strong>');
    expect(markup).not.toContain('>2</strong>');
  });
});
