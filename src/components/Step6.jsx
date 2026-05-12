import { useState, useEffect, useRef } from 'react';

export default function Step6({ onNext }) {
  const previewRef              = useRef();
  const [text,     setText]     = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    window.__aw_unlock = () => {
      setUnlocked(true);
      setTimeout(onNext, 1800);
    };
    return () => { delete window.__aw_unlock; };
  }, [onNext]);

  function handleInput(val) {
    setText(val);
    if (previewRef.current) previewRef.current.innerHTML = val;
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">Security · XSS · innerHTML</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 06 / 06</div>
        <div className="step-title">The Unlocked Door</div>
        <div className="step-desc">
          The final gate is a vulnerability. This preview field renders exactly what
          you type — no sanitization, no escaping, raw <code>innerHTML</code>.
          <br /><br />
          Your goal: make the browser execute <code>window.__aw_unlock()</code> through the preview field.
          No typing it in the console — it has to come from your input.
        </div>

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># The function is already on the window: <span style={{color:'var(--cyan)'}}>window.__aw_unlock()</span></span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Calling it from the console doesn't count</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Use the preview field — craft an HTML payload that fires it</span>
          </span>
        </div>

        <div className="preview-engine">
          <div className="preview-label">
            ✦ MESSAGE PREVIEW
            <span className="preview-badge">innerHTML · unsanitized</span>
          </div>

          <input
            className="field-input"
            style={{ marginBottom: 12 }}
            placeholder='Try <b>bold</b> first to see how it renders...'
            value={text}
            onChange={e => handleInput(e.target.value)}
            autoComplete="off"
          />

          <div ref={previewRef} className="preview-box">
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>preview appears here</span>
          </div>
        </div>

        {unlocked && (
          <div className="alert alert-ok" style={{ marginTop: 16 }}>
            ⚡ XSS payload executed. <code>__aw_unlock()</code> triggered. Generating your token…
          </div>
        )}
      </div>
    </div>
  );
}
