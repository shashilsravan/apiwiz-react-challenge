import { useState, useEffect } from 'react';

export default function Step5({ answer, onNext }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!answer) return;

    // A dev left a config snapshot in before the Friday deploy.
    // The real token is buried inside gateway.auth — but there are decoys.
    // console.groupCollapsed so they must expand it manually.
    console.groupCollapsed(
      '%c[apiwiz-debug] 🚨 sprint-23 config snapshot — REMOVE BEFORE DEPLOY',
      'color:#ff9500;font-weight:bold;font-size:12px',
    );
    console.log(
      '%ccommit: a7f3e1b  ·  branch: fix/auth-bypass-temp  ·  author: someone@apiwiz.io',
      'color:#666;font-size:10px;font-style:italic',
    );
    console.log('config:', {
      env: 'production',
      region: 'ap-south-1',
      gateway: {
        url: 'https://gateway.apiwiz.io/v3',
        timeout_ms: 5000,
        retry: 3,
        auth: {
          mode: 'bearer',
          token: answer,        // ← this is the one
          expires: 'never',
        },
      },
      debug: {
        trace_id: 'TRC-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        session_key: 'SK-' + Math.random().toString(36).slice(2, 8).toUpperCase(),  // decoy
        legacy_token: 'LT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),  // decoy
      },
      cache: { ttl: 300, strategy: 'lru', hits: Math.floor(Math.random() * 999) },
      feature_flags: { beta_ui: false, new_auth: true, analytics: false },
    });
    console.groupEnd();
  }, [answer]);

  function verify() {
    if (value.trim().toUpperCase().replace(/\s/g, '') === answer) {
      setStatus('ok');
      setTimeout(onNext, 1200);
    } else {
      setStatus('err');
    }
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">Console · Friday Deploy · Sprint 23</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 05 / 06</div>
        <div className="step-title">Shipped It 🚀</div>
        <div className="step-desc">
          Someone committed a config snapshot in the middle of a debug session and
          deployed it straight to production. We've all been there. The diff was huge,
          nobody reviewed it properly, and now it's everyone's problem.
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Hint 1: DevTools</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Hint 2: Navigate the config object — not everything you see is the answer</span>
          </span>
        </div>

        <div className="field" style={{ marginTop: 8 }}>
          <label className="field-label" htmlFor="debug-input">Token from the config dump</label>
          <input
            className="field-input code-input"
            id="debug-input"
            type="text"
            placeholder="XX-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>
          SUBMIT (and please remove this from prod)
        </button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Not quite — there are decoys in the config. Find the one under <code>gateway.auth.token</code>.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Found it. Note to self: never deploy on a Friday. Moving to final challenge…</div>
        )}
      </div>
    </div>
  );
}
