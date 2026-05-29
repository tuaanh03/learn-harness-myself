interface Props {
  confidence: number | undefined;
}

function confidenceLevel(confidence: number): 'High' | 'Medium' | 'Low' {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.5) return 'Medium';
  return 'Low';
}

export function LatestAnswerConfidence({ confidence }: Props) {
  if (confidence === undefined) return null;

  return (
    <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaaacd' }}>
      Confidence: {confidenceLevel(confidence)}
    </div>
  );
}
