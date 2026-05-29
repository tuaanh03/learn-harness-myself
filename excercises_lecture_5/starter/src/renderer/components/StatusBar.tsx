import { AppStatus } from '@shared/types';

interface Props {
  status: AppStatus;
}

export function StatusBar({ status }: Props) {
  const statusColor = {
    idle: '#888',
    indexing: '#f0ad4e',
    ready: '#5cb85c',
    error: '#d9534f',
  }[status.indexStatus] ?? '#888';
  const progressPercent = status.totalDocuments > 0
    ? Math.round((status.currentIndexed / status.totalDocuments) * 100)
    : 0;

  return (
    <div style={{
      padding: '6px 20px',
      background: '#0f1729',
      borderTop: '1px solid #0f3460',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '11px',
      color: '#888',
      flexWrap: 'wrap',
    }}>
      <span>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusColor,
          marginRight: '6px',
        }} />
        Index: {status.indexStatus}
      </span>
      <span>Documents: {status.documentsLoaded}</span>
      <span>Indexed: {status.currentIndexed}/{status.totalDocuments}</span>
      <span>Pending: {status.pendingDocuments}</span>
      <span>Chunks: {status.indexedChunks}</span>
      {status.erroredDocuments > 0 && <span>Errors: {status.erroredDocuments}</span>}
      <div
        aria-label={`Indexing progress ${progressPercent}%`}
        style={{
          width: '120px',
          height: '6px',
          background: '#1a1a2e',
          border: '1px solid #0f3460',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: statusColor,
        }} />
      </div>
      {status.lastActivity && (
        <span>Last activity: {new Date(status.lastActivity).toLocaleTimeString()}</span>
      )}
    </div>
  );
}
