import { useState } from 'react';
import { generateToken } from '../utils/token.js';

export default function Final({ candidate }) {
  const [token]    = useState(() => generateToken(candidate));
  const [copyText, setCopyText] = useState('Copy Token');

  function copyToken() {
    navigator.clipboard.writeText(token).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Token'), 2000);
    }).catch(() => {
      const r = document.createRange();
      r.selectNode(document.getElementById('token-val'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(r);
    });
  }

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">🎉 challenge-complete.log — all checks passed</span>
      </div>
      <div className="card-body">

        <div className="final-hero">
          <div className="final-icon">⚡</div>
          <div className="final-title">ACCESS GRANTED</div>
          <div className="final-sub">
            You've cleared all 7 challenges.<br />
            This is exactly the kind of engineer we're hiring for.
          </div>
        </div>

        <div className="div" />

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">›</span>{' '}
            <span className="t-dim"># Challenge summary</span>
          </span>
          {[
            ['01', 'Identity Protocol  ···'],
            ['02', 'Signal Intercept   ···'],
            ['03', 'Dead Reckoning     ···'],
            ['04', 'Inherited          ···'],
            ['05', 'Dead Pixels        ···'],
            ['06', 'The Unlocked Door  ···'],
            ['07', 'The Matrix         ···'],
          ].map(([n, label]) => (
            <span key={n} className="t-block">
              <span className="t-key">{n}</span>{' '}
              <span className="t-dim">{label}</span>{' '}
              <span className="t-ok">PASS ✓</span>
            </span>
          ))}
        </div>

        <div className="div" />

        <div className="token-box">
          <div className="token-lbl">YOUR UNIQUE ACCESS TOKEN</div>
          <div className="token-val" id="token-val">{token}</div>
          <button className="copy-btn" onClick={copyToken}>
            <span>📋</span><span>{copyText}</span>
          </button>
        </div>

        <div className="next-box">
          <h3>📬 NEXT STEPS</h3>
          <p>
            Submit your unique access token when filling out the application form on our careers portal.
            This token is tied to your name and session — it is yours alone.
          </p>
          <p style={{ color: 'var(--muted2)', fontSize: 12 }}>
            We look forward to working with you. Welcome to the team. — <em>APIwiz Engineering</em>
          </p>
        </div>

      </div>
    </div>
  );
}
