import { Document } from '../../shared/types';

interface Props {
  documents: Document[];
  onSelect: (document: Document) => void;
  selectedId: string | null;
}

export function DocumentList({ documents, onSelect, selectedId }: Props) {
  if (documents.length === 0) {
    return (
      <div style={{ padding: '20px 16px', color: '#666', fontSize: '13px', textAlign: 'center' }}>
        No documents imported yet.
        <br />
        <span style={{ fontSize: '11px', color: '#555' }}>
          Import documents to get started.
        </span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {documents.map(document => (
        <div
          key={document.id}
          onClick={() => onSelect(document)}
          style={{
            padding: '10px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid #0f3460',
            background: selectedId === document.id ? '#0f3460' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 500 }}>{document.title}</div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {document.status === 'indexed' ? 'Indexed | ' : ''}
            {(document.size / 1024).toFixed(1)} KB
          </div>
        </div>
      ))}
    </div>
  );
}
