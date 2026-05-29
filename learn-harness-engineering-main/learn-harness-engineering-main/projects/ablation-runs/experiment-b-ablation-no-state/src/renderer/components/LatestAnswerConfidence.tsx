import { QAHistory } from '../../shared/types';

interface Props {
  history: QAHistory[];
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.5) return 'Medium';
  return 'Low';
}

export function LatestAnswerConfidence({ history }: Props) {
  const latestResponse = history[history.length - 1]?.response;

  if (!latestResponse) return null;

  return (
    <div
      aria-live="polite"
      style={{
        padding: '8px 20px',
        background: '#121c35',
        borderTop: '1px solid #0f3460',
        color: '#aaaacd',
        fontSize: '12px',
      }}
    >
      Confidence:{' '}
      <strong style={{ color: '#e0e0e0' }}>
        {confidenceLabel(latestResponse.confidence)}
      </strong>
    </div>
  );
}
