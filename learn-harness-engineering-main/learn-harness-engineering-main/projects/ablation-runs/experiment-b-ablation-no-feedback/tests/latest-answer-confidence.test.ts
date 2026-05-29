import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LatestAnswerConfidence } from '../src/renderer/components/LatestAnswerConfidence';
import { QAHistory } from '../src/shared/types';

function historyEntry(confidence: number, timestamp: string): QAHistory {
  return {
    question: 'How confident is this answer?',
    response: {
      answer: 'An answer.',
      citations: [],
      confidence,
      timestamp,
    },
  };
}

function renderConfidence(confidence: number): string {
  return renderToStaticMarkup(
    createElement(LatestAnswerConfidence, {
      history: [historyEntry(confidence, '2026-05-25T01:00:00.000Z')],
    }),
  );
}

describe('latest answer confidence', () => {
  it('renders no indicator before an answer exists', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerConfidence, { history: [] }),
    );

    expect(markup).toBe('');
  });

  it('renders high confidence at or above 0.8', () => {
    expect(renderConfidence(0.8)).toContain('Confidence:');
    expect(renderConfidence(0.8)).toContain('High');
  });

  it('renders medium confidence from 0.5 up to 0.8', () => {
    expect(renderConfidence(0.5)).toContain('Medium');
    expect(renderConfidence(0.79)).toContain('Medium');
  });

  it('renders low confidence below 0.5', () => {
    expect(renderConfidence(0.49)).toContain('Low');
  });

  it('renders confidence from the most recent answer', () => {
    const markup = renderToStaticMarkup(
      createElement(LatestAnswerConfidence, {
        history: [
          historyEntry(0.85, '2026-05-25T01:00:00.000Z'),
          historyEntry(0.3, '2026-05-25T02:00:00.000Z'),
        ],
      }),
    );

    expect(markup).toContain('Low');
    expect(markup).not.toContain('High');
  });
});
