import { useEffect, useState } from 'react';
import { Chunk, Document } from '../../shared/types';

interface Props {
  document: Document;
  busy: boolean;
  onIndex: (documentId: string) => Promise<void>;
  onDelete: (document: Document) => Promise<void>;
}

export function DocumentDetail({ document, busy, onIndex, onDelete }: Props) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [showChunks, setShowChunks] = useState(false);

  useEffect(() => {
    void window.knowledgeBase.indexing.chunks(document.id).then(setChunks);
  }, [document.id, document.status]);

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        {document.title}
      </h2>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        <div>Filename: {document.filename}</div>
        <div>Imported: {new Date(document.importedAt).toLocaleString()}</div>
        <div>Size: {(document.size / 1024).toFixed(1)} KB</div>
        <div>Status: {document.status}</div>
        {document.chunks !== undefined && <div>Chunks: {document.chunks}</div>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setShowChunks(!showChunks)} style={secondaryButtonStyle}>
          {showChunks ? 'Hide' : 'Show'} Chunks ({chunks.length})
        </button>
        {document.status !== 'indexed' && (
          <button
            onClick={() => void onIndex(document.id)}
            disabled={busy}
            style={primaryButtonStyle}
          >
            Index Document
          </button>
        )}
        <button
          onClick={() => void onDelete(document)}
          disabled={busy}
          style={deleteButtonStyle}
        >
          Delete
        </button>
      </div>

      {showChunks && chunks.map(chunk => (
        <div key={chunk.id} style={{
          padding: '10px',
          marginBottom: '8px',
          background: '#1a1a3e',
          borderRadius: '4px',
          borderLeft: '3px solid #533483',
          fontSize: '13px',
          lineHeight: 1.5,
        }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
            Chunk {chunk.index} ({chunk.metadata.charCount} chars, {chunk.metadata.wordCount} words)
          </div>
          {chunk.content}
        </div>
      ))}
    </div>
  );
}

const primaryButtonStyle = {
  padding: '6px 12px',
  background: '#533483',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const secondaryButtonStyle = {
  padding: '6px 12px',
  background: '#0f3460',
  color: '#e0e0e0',
  border: '1px solid #1a1a4e',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  background: '#481f31',
  color: '#ffd0d8',
  border: '1px solid #70334d',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};
