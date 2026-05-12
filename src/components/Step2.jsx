import { useState, useEffect } from 'react';

export default function Step2({ answer, candidate, onNext }) {
  const [value,     setValue]     = useState('');
  const [status,    setStatus]    = useState(null);
  const [firing,    setFiring]    = useState(false);
  const [fired,     setFired]     = useState(false);
  const [blink,     setBlink]     = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  async function fireRequest() {
    if (firing || !answer) return;
    setFiring(true);

    const reqId = 'REQ-' + Math.random().toString(36).slice(2, 10).toUpperCase();

    const payload = {
      ts:  Date.now(),
      rid: reqId,
      s:   401,
      e:   'E_AUTH_CTX_MISSING',
      msg: 'rejected',
      candidate: candidate?.name,
      result: {
        granted: false,
        layers: {
          depth: 3,
          nodes: [
            { lvl: 0, v: null,   sealed: true  },
            { lvl: 1, v: null,   sealed: true  },
            { lvl: 2, v: answer, sealed: false },
          ],
        },
      },
    };

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const blob    = new Blob([encoded], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    try {
      await fetch(blobUrl);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }

    setFiring(false);
    setFired(true);
  }

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
          The gateway has more to say than what the UI shows.
          <br /><br />
          <strong style={{ color: 'var(--cyan)' }}>Step 1 —</strong> Open DevTools and switch to the <strong style={{ color: 'var(--cyan)' }}>Network tab</strong> first.
          <br />
          <strong style={{ color: 'var(--cyan)' }}>Step 2 —</strong> Click the button below to fire the request.
          <br />
          <strong style={{ color: 'var(--cyan)' }}>Step 3 —</strong> Inspect the response. The fragment is in there — but it isn't in a format you can read at a glance.
        </div>

        <button
          className="btn btn-green"
          onClick={fireRequest}
          disabled={firing}
          style={{ marginBottom: 8 }}
        >
          {firing
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spin" /> SENDING…
              </span>
            : fired ? '↺ FIRE AGAIN' : '⚡ FIRE REQUEST'}
        </button>

        {fired && (
          <div className="term" style={{ marginTop: 16 }}>
            <span className="t-block">
              <span className="t-prompt">$</span>{' '}
              <span className="t-ok">✓ request fired — check Network tab now</span>
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
        )}

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
