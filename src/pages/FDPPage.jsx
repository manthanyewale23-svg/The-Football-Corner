import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FDP_QUESTIONS, calculateFDP, FDP_TYPES } from '../utils/fdpLogic.js';

export default function FDPPage() {
  const { userData, updateUserData } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(userData?.fdpResult || null);
  const [selected, setSelected] = useState(null);

  const question = FDP_QUESTIONS[currentQ];
  const progress = ((currentQ) / FDP_QUESTIONS.length) * 100;

  function selectOption(index) {
    setSelected(index);
  }

  function next() {
    if (selected === null) return;
    const newAnswers = [...answers, { questionId: question.id, optionIndex: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ + 1 < FDP_QUESTIONS.length) {
      setCurrentQ(q => q + 1);
    } else {
      // All answered — calculate result
      const fdpResult = calculateFDP(newAnswers);
      setResult(fdpResult);
      updateUserData({ fdpResult: { type: fdpResult.id, name: fdpResult.name, emoji: fdpResult.emoji, description: fdpResult.description, color: fdpResult.color, traits: fdpResult.traits } });
    }
  }

  function restart() {
    setAnswers([]);
    setCurrentQ(0);
    setSelected(null);
    setResult(null);
  }

  // Show existing result if available and not re-taking
  if (result) {
    return (
      <div className="fade-in">
        <div className="header">
          <div>
            <h1 className="page-title" style={{ fontSize: 20 }}>Football DNA</h1>
            <p className="text-muted text-xs">Your football personality</p>
          </div>
        </div>

        <div className="p-page pt-16">
          <div className="fdp-result-card slide-up">
            <span className="fdp-icon">{result.emoji || result.fdpResult?.emoji || '🧬'}</span>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, color: result.color || result.fdpResult?.color || 'var(--green)' }}>
              {result.name || result.fdpResult?.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              {result.description || result.fdpResult?.description}
            </p>
            <div className="flex flex-col gap-8" style={{ textAlign: 'left' }}>
              {(result.traits || result.fdpResult?.traits || []).map((trait, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All FDP types preview */}
          <h2 className="section-title" style={{ marginTop: 28, marginBottom: 14 }}>All Football DNA Types</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.values(FDP_TYPES).map(type => (
              <div key={type.id} className="card" style={{ padding: '14px 12px', textAlign: 'center', border: (result.id === type.id || result.type === type.id) ? `2px solid ${type.color}` : '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{type.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: type.color, lineHeight: 1.3 }}>{type.name}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-secondary btn-full" style={{ marginTop: 24 }} onClick={restart} id="fdp-retake-btn">
            🔄 Retake Quiz
          </button>
          <div style={{ height: 24 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Football DNA</h1>
          <p className="text-muted text-xs">Discover your football personality</p>
        </div>
        <span className="text-xs text-muted">{currentQ + 1}/{FDP_QUESTIONS.length}</span>
      </div>

      <div className="p-page pt-16">
        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 24 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="card" style={{ padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧬</div>
          <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.5 }}>{question.question}</h2>
        </div>

        {/* Options */}
        <div id={`fdp-question-${currentQ}`}>
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`quiz-option${selected === i ? ' selected' : ''}`}
              onClick={() => selectOption(i)}
              id={`fdp-option-${currentQ}-${i}`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 8 }}
          onClick={next}
          disabled={selected === null}
          id="fdp-next-btn"
        >
          {currentQ + 1 === FDP_QUESTIONS.length ? '🧬 Reveal My DNA' : 'Next Question →'}
        </button>

        <p className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 12 }}>
          {FDP_QUESTIONS.length - currentQ - 1} questions remain
        </p>
      </div>
    </div>
  );
}
