import { useState, useEffect } from 'react';

export default function Step4({ answer, onNext }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!answer) return;

    class ApiwizNode {
      constructor(id) {
        this.id = id;
        this.active = true;
        this.timestamp = Date.now();
      }
      ping() { return `pong::${this.id}`; }
    }
    // Key lives on the prototype — not the instance itself
    ApiwizNode.prototype._vault = { sealed: false, key: answer };
    window.__awNode = new ApiwizNode('runtime-4');

    return () => { delete window.__awNode; };
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
        <span className="card-title">Console · Prototype Chain</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 04 / 06</div>
        <div className="step-title">Inherited</div>
        <div className="step-desc">
          A runtime node is active. Its surface tells you almost nothing —
          but what it <em>inherits</em> tells you everything.
          <br /><br />
          JavaScript objects carry more than their own properties.
          The vault is not on the instance. Look deeper.
        </div>

        <div id="apiwiz-node" data-runtime="__awNode" className="runtime-node">
          <div className="runtime-id">NODE · runtime-4 · PROTOTYPE CHAIN ACTIVE</div>
          <div className="runtime-status">scope: window · inspect the inheritance tree</div>
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Start here: <span style={{ color: 'var(--cyan)' }}>window.__awNode</span></span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Its own properties won't have it — check what it inherits</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Remember <span style={{ color: 'var(--orange)' }}>_vault</span> is your best friend that you are looking for</span>
          </span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="proto-input">Vault Key</label>
          <input
            className="field-input code-input"
            id="proto-input"
            type="text"
            placeholder="XX-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>UNLOCK</button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Not found on the surface. The key lives in the prototype chain.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Prototype traversed. Vault open. Moving to Challenge 05…</div>
        )}
      </div>
    </div>
  );
}
