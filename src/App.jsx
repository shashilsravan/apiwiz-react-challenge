import { useState } from 'react';
import Boot      from './components/Boot.jsx';
import Progress  from './components/Progress.jsx';
import Step1     from './components/Step1.jsx';
import Step2     from './components/Step2.jsx';
import Step3     from './components/Step3.jsx';
import Step4     from './components/Step4.jsx';
import Step5     from './components/Step5.jsx';
import Step6     from './components/Step6.jsx';
import Final     from './components/Final.jsx';
import { deriveAnswers } from './utils/session.js';

export default function App() {
  const [step,      setStep]      = useState('boot');
  const [candidate, setCandidate] = useState({ name: '', email: '', github: '' });
  const [answers,   setAnswers]   = useState(null);

  function advance(next) {
    setStep(next);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60);
  }

  function handleIdentity(data) {
    setCandidate(data);
    setAnswers(deriveAnswers(data.email));
    advance(2);
  }

  return (
    <>
      <div className="wrap">
        <header className="site-header">
          <div className="site-eyebrow">APIWIZ CAREERS</div>
          <div className="site-logo">APIwiz</div>
          <div className="site-sub">FRONTEND ENGINEER · CHALLENGE PROTOCOL · v3.0</div>
        </header>

        {step !== 'boot' && <Progress step={step} />}

        {step === 'boot'  && <Boot onStart={() => advance(1)} />}
        {step === 1       && <Step1 onNext={handleIdentity} />}
        {step === 2       && <Step2 answer={answers?.net} candidate={candidate} onNext={() => advance(3)} />}
        {step === 3       && <Step3 answer={answers?.dom}    onNext={() => advance(4)} />}
        {step === 4       && <Step4 answer={answers?.proto}  onNext={() => advance(5)} />}
        {step === 5       && <Step5 answer={answers?.console} onNext={() => advance(6)} />}
        {step === 6       && <Step6 onNext={() => advance('final')} />}
        {step === 'final' && <Final candidate={candidate} />}
      </div>
    </>
  );
}
