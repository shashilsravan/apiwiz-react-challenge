import { useEffect, useState } from 'react';

const LINES = [
  { txt: '[ OK ] Loading challenge environment',              ms: 350 },
  { txt: '[ OK ] Mounting API gateway simulation',            ms: 680 },
  { txt: '[ OK ] Injecting phantom DOM elements',             ms: 1020 },
  { txt: '[ OK ] Seeding encrypted session vaults',           ms: 1350 },
  { txt: '[ OK ] Priming XOR cipher pipeline',               ms: 1680 },
  { txt: '[WARN] 7 challenges armed — no shortcuts exist',    ms: 2050, warn: true },
  { txt: '[ OK ] System ready. Open DevTools. Stay sharp.',   ms: 2400 },
];

export default function Boot({ onStart }) {
  const [lines, setLines] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers = LINES.map(({ txt, ms, warn }) =>
      setTimeout(() => setLines(prev => [...prev, { txt, warn }]), ms)
    );
    const readyTimer = setTimeout(() => setReady(true), 2700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(readyTimer);
    };
  }, []);

  return (
    <div className="card">
      <div className="card-titlebar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="card-title">apiwiz-challenge-init.sh — zsh</span>
      </div>
      <div className="card-body boot-body">
        <div className="boot-logo">APIwiz</div>
        <div className="boot-tagline">FRONTEND CHALLENGE PROTOCOL v3.0</div>

        <div className="boot-invite">
          <p>
            In the age of AI, everyone can write code — but not everyone can <em>think</em> like an engineer.
          </p>
          <p>
            We built this challenge to find the ones who still open DevTools out of curiosity,
            who read the network response even when the UI says it failed,
            and who know that <code>innerHTML</code> is a door left open.
          </p>
          <p>
            Six challenges. No hints beyond what's here. No Stack Overflow shortcut that'll save you.
          </p>
          <p style={{ color: 'var(--green)' }}>
            Crack all six — and your next conversation will be with our engineering team. Directly.
          </p>
        </div>

        <div className="boot-log">
          {lines.map((l, i) => {
            const tag  = l.txt.match(/^\[.*?\]/)?.[0] ?? '';
            const rest = l.txt.replace(/^\[.*?\]\s*/, '');
            const col  = l.warn ? 'var(--orange)' : 'var(--green)';
            return (
              <div key={i} className="boot-line">
                {tag
                  ? <><span style={{ color: col }}>{tag}</span>{' '}
                      <span style={{ color: 'var(--muted2)' }}>{rest}</span></>
                  : <span style={{ color: 'var(--muted2)' }}>{l.txt}</span>}
              </div>
            );
          })}
        </div>

        {ready && (
          <button className="btn btn-green" style={{ margin: '0 auto', display: 'block' }} onClick={onStart}>
            INITIALIZE CHALLENGE
          </button>
        )}
      </div>
    </div>
  );
}
