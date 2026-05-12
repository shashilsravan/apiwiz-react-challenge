import { useEffect, useRef, useState } from 'react';

const ORIGIN_X = 20;
const ORIGIN_Y = 25;
const STRIDE   = 20;

export default function Step5({ answer, onNext }) {
  const canvasRef        = useRef();
  const [value, setValue]   = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!answer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0,   '#070b12');
    grad.addColorStop(0.5, '#0d1424');
    grad.addColorStop(1,   '#111927');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decoy noise — looks like signal interference
    for (let i = 0; i < 1200; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.height);
      ctx.fillStyle = `rgba(0,255,136,${(Math.random() * 0.18).toFixed(2)})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Encode each answer char as its ASCII value in the R channel.
    // 2×2 blocks so getImageData is reliable; visually indistinguishable from noise.
    answer.split('').forEach((char, i) => {
      ctx.fillStyle = `rgb(${char.charCodeAt(0)},0,0)`;
      ctx.fillRect(ORIGIN_X + i * STRIDE, ORIGIN_Y, 2, 2);
    });
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
        <span className="card-title">Canvas · getImageData · Steganography</span>
      </div>
      <div className="card-body">
        <div className="badge">⬡ CHALLENGE 05 / 07</div>
        <div className="step-title">Dead Pixels</div>
        <div className="step-desc">
          Not all pixels are decoration. This canvas carries information hidden inside
          its pixel data — invisible to the eye, readable to anyone who knows the API.
          <br /><br />
          Every frontend dev knows canvas exists. Not every frontend dev knows what lives inside it.
        </div>

        {/* data-origin, data-stride, data-len are the breadcrumbs */}
        <canvas
          id="apiwiz-render"
          ref={canvasRef}
          width={200}
          height={50}
          data-origin={`${ORIGIN_X},${ORIGIN_Y}`}
          data-stride={STRIDE}
          data-len={answer?.length ?? 7}
          data-channel="R"
          style={{ display: 'block', margin: '22px 0', borderRadius: 4, width: '100%', maxWidth: 200 }}
        />

        <div className="term">
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Inspect <span style={{color:'var(--cyan)'}}>canvas#apiwiz-render</span> — check its data attributes</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># Use <span style={{color:'var(--cyan)'}}>getImageData(x, y, 1, 1).data[0]</span> at each encoded position</span>
          </span>
          <span className="t-block">
            <span className="t-prompt">$</span>{' '}
            <span className="t-dim"># R channel value = char code → <span style={{color:'var(--cyan)'}}>String.fromCharCode()</span> to decode</span>
          </span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="canvas-input">Decoded Key</label>
          <input
            className="field-input code-input"
            id="canvas-input"
            type="text"
            placeholder="XX-XXXX"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-green" onClick={verify}>DECODE & SUBMIT</button>

        {status === 'err' && (
          <div className="alert alert-err">
            <strong>✗</strong> Incorrect. Read the R channel values at the coordinates from the canvas data attributes.
          </div>
        )}
        {status === 'ok' && (
          <div className="alert alert-ok">✓ Pixel data decoded. Moving to Challenge 06…</div>
        )}
      </div>
    </div>
  );
}
