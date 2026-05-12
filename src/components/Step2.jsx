import { useState, useEffect } from 'react';

export default function Step2({ answer, onNext }) {
  const [value,  setValue]  = useState('');
  const [status, setStatus] = useState(null);
  const [blink,  setBlink]  = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  function verify() {
    if (value.trim().toUpperCase().replace(/\s/g, '') === answer) {
      setStatus('ok');
      setTimeout(onNext, 1100);
    } else {
      setStatus('err');
    }
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">DevTools · Network</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 02 / 06</div>
        <div className="step-title">Signal Intercept</div>
        <div className="step-desc">
          The gateway responded. All of it. The interface made a deliberate choice
          about what to surface — and what to bury.
          <br /><br />
          Check the API response from the previous step. The fragment is in there —
          but it isn't in a format you can read at a glance.
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim">gateway status — E_AUTH_CTX_MISSING</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim">response received · raw payload · requires decoding</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span style={{ color: 'var(--muted2)' }}>intercepting</span>{' '}
            <span style={{ color: 'var(--green)', opacity: blink ? 1 : 0 }}>_</span>
          </span>
        </div>

        <div className="field" style={{ marginTop: 24 }}>
          <label className="field-label" htmlFor="net-input">Gateway Fragment</label>
          <input
            className="field-input code-input"
            id="net-input"
            type="text"
            placeholder="XX-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>SUBMIT</button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Wrong fragment. The response payload has more layers than the UI revealed.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Fragment verified. Gateway unlocked. Moving to Challenge 03…</div>
        )}
      </div>
    </div>
  );
}
