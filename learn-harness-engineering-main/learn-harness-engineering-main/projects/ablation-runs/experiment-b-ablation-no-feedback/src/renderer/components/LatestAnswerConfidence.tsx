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
        marginTop: '16px',
        padding: '10px 14px',
        background: '#121d39',
        border: '1px solid #0f3460',
        borderRadius: '6px',
        color: '#b7b7dc',
        fontSize: '13px',
      }}
    >
      Confidence:{' '}
      <strong style={{ color: '#f0eaff' }}>{confidenceLabel(latestResponse.confidence)}</strong>
    </div>
  );
}
