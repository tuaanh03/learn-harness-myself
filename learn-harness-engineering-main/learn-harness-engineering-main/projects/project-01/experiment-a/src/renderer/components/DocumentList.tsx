import { Document } from '../../../shared/types';

interface Props {
  documents: Document[];
  onSelect: (doc: Document) => void;
  selectedId: string | null;
}

export function DocumentList({ documents, onSelect, selectedId }: Props) {
  if (documents.length === 0) {
    return (
      <div style={{ padding: '22px 16px', color: '#77839b', fontSize: '13px', textAlign: 'center' }}>
        No documents imported.
        <br />
        <span style={{ fontSize: '12px' }}>Import a text or Markdown file.</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {documents.map(doc => (
        <button
          type="button"
          key={doc.id}
          onClick={() => onSelect(doc)}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            color: '#dde5f4',
            textAlign: 'left',
            cursor: 'pointer',
            border: 0,
            borderBottom: '1px solid #263858',
            background: selectedId === doc.id ? '#1b3053' : 'transparent',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{doc.title}</div>
          <div style={{ fontSize: '11px', color: '#8f9bb3' }}>
            {doc.status === 'indexed' ? 'Indexed / ' : ''}
            {(doc.size / 1024).toFixed(1)} KB
          </div>
        </button>
      ))}
    </div>
  );
}
