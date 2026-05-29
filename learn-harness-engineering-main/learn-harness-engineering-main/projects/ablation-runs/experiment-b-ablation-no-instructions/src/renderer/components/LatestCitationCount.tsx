import { QAHistory } from '../../shared/types';

interface Props {
  history: QAHistory[];
}

export function LatestCitationCount({ history }: Props) {
  const latestAnswer = history[history.length - 1];

  if (!latestAnswer) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        marginTop: '16px',
        padding: '10px 12px',
        background: '#16213e',
        border: '1px solid #0f3460',
        borderRadius: '6px',
        color: '#c8c8e5',
        fontSize: '13px',
        fontWeight: 500,
      }}
    >
      Citations in latest answer: {latestAnswer.response.citations.length}
    </div>
  );
}
