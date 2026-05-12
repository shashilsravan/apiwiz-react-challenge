import { useState } from 'react';

const pause = ms => new Promise(r => setTimeout(r, ms));

export default function Step1({ onNext }) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function submit() {
    if (!name || !email) {
      setError('Error 400 — All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Error 422 — Invalid email format.');
      return;
    }

    setLoading(true);
    setError('');

    const reqId = 'REQ-' + Math.random().toString(36).slice(2, 10).toUpperCase();

    const { deriveAnswers } = await import('../utils/session.js');
    const ans = deriveAnswers(email);

    const payload = {
      ts:  Date.now(),
      rid: reqId,
      s:   401,
      e:   'E_AUTH_CTX_MISSING',
      msg: 'rejected',
      result: {
        granted: false,
        layers: {
          depth: 3,
          nodes: [
            { lvl: 0, v: null,    sealed: true  },
            { lvl: 1, v: null,    sealed: true  },
            { lvl: 2, v: ans.net, sealed: false },
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

    await pause(1800);
    setLoading(false);
    setError('Error 401 — Gateway authentication failed. Connection refused.');
    setTimeout(() => onNext({ name, email }), 1200);
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">POST https://gateway.apiwiz.io/v3/candidates/apply</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 01 / 06</div>
        <div className="step-title">Identity Protocol</div>
        <div className="step-desc">
          Before we can route your application, the gateway needs to know who you are.
          Fill in your details and submit — the API will handle the rest.
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f-name">Full Name</label>
          <input className="field-input" id="f-name" type="text"
            placeholder="Akash" value={name}
            onChange={e => setName(e.target.value)} autoComplete="off" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="f-email">Email Address</label>
          <input className="field-input" id="f-email" type="email"
            placeholder="akash@apiwiz.com" value={email}
            onChange={e => setEmail(e.target.value)} autoComplete="off" />
        </div>

        <br />
        <button className="btn btn-green" onClick={submit} disabled={loading}>
          {loading
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spin" /> CONNECTING TO GATEWAY…
              </span>
            : 'SUBMIT APPLICATION'}
        </button>

        {error && <div className="alert alert-err"><strong>✗</strong> {error}</div>}
      </div>
    </div>
  );
}
