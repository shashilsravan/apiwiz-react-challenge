import { useState, useEffect, useRef } from 'react';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function Step7({ onNext }) {
  const [matrix] = useState(() =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
  );
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(null);
  const matrixRef = useRef();

  const answer = (() => {
    const result = matrix.reduce((acc, n, i) => i % 2 === 0 ? acc + n : acc - n, 0);
    return 'APWZ-' + String(Math.abs(result)).padStart(4, '0');
  })();

  useEffect(() => {
    const el = matrixRef.current;
    if (!el) return;
    // CSS custom property holds the reduction formula — discoverable via getComputedStyle or DevTools
    el.style.setProperty('--reduce-op', '(acc,n,i)=>i%2===0?acc+n:acc-n');
    el.dataset.values = matrix.join(',');
    el.dataset.len = matrix.length;
  }, [matrix]);

  function verify() {
    if (value.trim().toUpperCase().replace(/\s/g, '') === answer) {
      setStatus('ok');
      setTimeout(onNext, 1000);
    } else {
      setStatus('err');
    }
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">DevTools · Computed Styles · DOM Dataset</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 07 / 07</div>
        <div className="step-title">The Matrix</div>
        <div className="step-desc">
          These numbers are unique to your session. They won't be the same tomorrow,
          or for anyone else. The DOM knows what to do with them — if you know where to look.
          <br /><br />
          The element below carries everything: the values and the operation.
          Inspect it. The answer lives in applying one to the other.
        </div>

        <div
          id="apiwiz-matrix"
          ref={matrixRef}
          className="matrix-grid"
          data-hint="check --reduce-op and data-values"
        >
          {matrix.map((n, i) => (
            <div key={i} className="matrix-cell">
              <span className="matrix-label">{LABELS[i]}</span>
              <span className="matrix-val">{n}</span>
            </div>
          ))}
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Inspect <span style={{ color: 'var(--cyan)' }}>#apiwiz-matrix</span> in the Elements panel</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Apply the operation to the values → prefix result with <span style={{ color: 'var(--cyan)' }}>APWZ-</span> (4 digits, zero-padded)</span>
          </span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="matrix-input">Computed Key</label>
          <input
            className="field-input code-input"
            id="matrix-input"
            type="text"
            placeholder="APWZ-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>COMPUTE & SUBMIT</button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Wrong. The formula is in the element — read it carefully and apply it to all 8 values in order.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Matrix resolved. Final access granted…</div>
        )}
      </div>
    </div>
  );
}
