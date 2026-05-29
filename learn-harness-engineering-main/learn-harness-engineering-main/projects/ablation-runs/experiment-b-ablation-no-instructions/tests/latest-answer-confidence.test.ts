import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LatestAnswerConfidence } from '../src/renderer/components/LatestAnswerConfidence';
import { QAHistory } from '../src/shared/types';

function historyEntry(confidence: number): QAHistory {
  return {
    question: 'How confident is this answer?',
    response: {
      answer: 'Answer',
      confidence,
      timestamp: new Date().toISOString(),
      citations: [],
    },
  };
}

describe('latest answer confidence', () => {
  it.each([
    [0.8, 'High'],
    [0.5, 'Medium'],
    [0.49, 'Low'],
  ])('renders %s as %s', (confidence, expectedLabel) => {
    const markup = renderToStaticMarkup(createElement(LatestAnswerConfidence, {
      history: [historyEntry(confidence)],
    }));

    expect(markup).toContain(`Confidence: ${expectedLabel}`);
  });

  it('uses only the latest answer confidence', () => {
    const markup = renderToStaticMarkup(createElement(LatestAnswerConfidence, {
      history: [historyEntry(0.8), historyEntry(0.5)],
    }));

    expect(markup).toContain('Confidence: Medium');
    expect(markup).not.toContain('Confidence: High');
  });

  it('does not render before any answer exists', () => {
    const markup = renderToStaticMarkup(createElement(LatestAnswerConfidence, { history: [] }));

    expect(markup).toBe('');
  });
});
