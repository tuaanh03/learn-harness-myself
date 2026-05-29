import { QAHistory } from '../../shared/types';

interface Props {
  history: QAHistory[];
}

export function LatestCitationCount({ history }: Props) {
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
      Citations in latest answer:{' '}
      <strong style={{ color: '#e0e0e0' }}>{latestResponse.citations.length}</strong>
    </div>
  );
}
