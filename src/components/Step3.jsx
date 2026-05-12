import { useState, useEffect } from 'react';

export default function Step3({ answer, onNext }) {
  const [value,  setValue]  = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const el = document.getElementById('apiwiz-relay');
    if (!el || !answer) return;

    // Gate code is embedded as a string literal inside the listener source.
    // eslint-disable-next-line no-new-func
    const handler = new Function(
      `return function apiwizGateListener(){var _gate='${answer}';void _gate;}`
    )();

    el.addEventListener('apiwiz.signal', handler);
    return () => el.removeEventListener('apiwiz.signal', handler);
  }, [answer]);

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
        <span className="card-title">DevTools · Elements · Event Listeners</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 03 / 07</div>
        <div className="step-title">Dead Reckoning</div>
        <div className="step-desc">
          Something on this page is listening. Registered, bound, silent — it will never
          fire on its own. But the binding itself is the message.
          <br /><br />
          DevTools has tools for reading what code is attached to elements.
          Use them. The gate is inside the listener, not on the element.
        </div>

        <div id="apiwiz-relay" className="relay-node">
          <div className="relay-dot" />
          <span>SIGNAL RELAY · BOUND · AWAITING</span>
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># The relay element <span style={{color:'var(--cyan)'}}>#apiwiz-relay</span> listens for: <span style={{color:'var(--orange)'}}>apiwiz.signal</span></span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Elements panel → select it → Event Listeners tab → find the handler</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Or: <span style={{color:'var(--cyan)'}}>getEventListeners</span>(document.getElementById(<span style={{color:'var(--orange)'}}>"apiwiz-relay"</span>))</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Call <span style={{color:'var(--cyan)'}}>.toString()</span> on the listener — the gate is in the source</span>
          </span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="dom-input">Gate Code</label>
          <input
            className="field-input code-input"
            id="dom-input"
            type="text"
            placeholder="XX-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>VERIFY</button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Incorrect. The gate is bound to an element — not visible, only listenable.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Signal decoded. Moving to Challenge 04…</div>
        )}
      </div>
    </div>
  );
}
