const STEPS = [1, 2, 3, 4, 5, 6, 'final'];

export default function Progress({ step }) {
  const idx = STEPS.indexOf(step);

  return (
    <div className="progress-track">
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const nodeClass = i < idx ? 'done' : i === idx ? 'active' : '';
        const connLit   = i < idx;
        return (
          <span key={i} style={{ display: 'contents' }}>
            <div className={`prog-node ${nodeClass}`}>
              {i === 6 ? '✓' : `0${i + 1}`}
            </div>
            {i < 6 && (
              <div className={`prog-connector ${connLit ? 'lit' : ''}`} />
            )}
          </span>
        );
      })}
    </div>
  );
}
