import { FormEvent, useState } from 'react';

interface Props {
  onAsk: (question: string) => Promise<void>;
  disabled: boolean;
}

export function QuestionPanel({ onAsk, disabled }: Props) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onAsk(question.trim());
    setQuestion('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        padding: '12px 20px',
        borderTop: '1px solid #0f3460',
        background: '#16213e',
      }}
    >
      <input
        type="text"
        value={question}
        disabled={disabled}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask a question about your documents..."
        style={{
          flex: 1,
          padding: '10px 14px',
          background: '#1a1a2e',
          color: '#e0e0e0',
          border: '1px solid #0f3460',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !question.trim()}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          background: '#533483',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {disabled ? 'Working...' : 'Ask'}
      </button>
    </form>
  );
}
