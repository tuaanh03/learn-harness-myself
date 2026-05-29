import { type CSSProperties, useEffect, useState } from 'react';
import { Chunk, Document } from '../../../shared/types';

interface Props {
  document: Document;
  busy: boolean;
  onIndex: (documentId: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export function DocumentDetail({ document, busy, onIndex, onDelete }: Props) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [content, setContent] = useState('');
  const [showChunks, setShowChunks] = useState(false);

  useEffect(() => {
    Promise.all([
      window.knowledgeBase.documents.content(document.id),
      window.knowledgeBase.indexing.chunks(document.id),
    ]).then(([text, storedChunks]) => {
      setContent(text ?? '');
      setChunks(storedChunks);
    });
  }, [document.id, document.chunks, document.status]);

  return (
    <article>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '21px', fontWeight: 600, marginBottom: '8px' }}>{document.title}</h2>
          <div style={{ fontSize: '12px', color: '#8f9bb3', marginBottom: '18px', lineHeight: 1.65 }}>
            {document.filename} / {(document.size / 1024).toFixed(1)} KB / {document.status}
            <br />
            Imported {new Date(document.importedAt).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
          <button type="button" disabled={busy} onClick={() => void onIndex(document.id)} style={buttonPrimary}>
            {document.status === 'indexed' ? 'Re-index' : 'Index'}
          </button>
          <button type="button" disabled={busy} onClick={() => void onDelete(document.id)} style={buttonDanger}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={heading}>Document text</h3>
        <button type="button" onClick={() => setShowChunks(value => !value)} style={buttonSecondary}>
          {showChunks ? 'Show text' : `Show chunks (${chunks.length})`}
        </button>
      </div>

      {showChunks ? (
        chunks.length === 0 ? (
          <p style={muted}>Index this document to see retrieved chunks.</p>
        ) : (
          chunks.map(chunk => (
            <section key={chunk.id} style={chunkStyle}>
              <div style={{ color: '#8996ae', fontSize: '11px', marginBottom: '6px' }}>
                Chunk {chunk.index + 1} / {chunk.metadata.wordCount} words
              </div>
              {chunk.content}
            </section>
          ))
        )
      ) : (
        <pre style={textStyle}>{content || 'This document is empty.'}</pre>
      )}
    </article>
  );
}

const heading: CSSProperties = {
  color: '#96a3bb',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const buttonPrimary: CSSProperties = {
  padding: '7px 11px',
  color: '#fff',
  background: '#5074de',
  border: 0,
  borderRadius: '4px',
  cursor: 'pointer',
};

const buttonDanger: CSSProperties = {
  ...buttonPrimary,
  background: '#432538',
  color: '#f5c3d1',
  border: '1px solid #71384e',
};

const buttonSecondary: CSSProperties = {
  padding: '5px 10px',
  background: '#172642',
  color: '#ccd5e8',
  border: '1px solid #33486c',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const muted: CSSProperties = { color: '#77839b', fontSize: '13px', padding: '18px 0' };

const chunkStyle: CSSProperties = {
  background: '#111b31',
  border: '1px solid #263858',
  borderLeft: '3px solid #5074de',
  borderRadius: '5px',
  lineHeight: 1.55,
  fontSize: '13px',
  padding: '12px',
  marginBottom: '10px',
  whiteSpace: 'pre-wrap',
};

const textStyle: CSSProperties = {
  background: '#111b31',
  border: '1px solid #263858',
  borderRadius: '6px',
  color: '#dde5f4',
  fontFamily: 'inherit',
  fontSize: '13px',
  lineHeight: 1.65,
  padding: '16px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};
