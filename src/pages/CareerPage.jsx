import { useState } from 'react';
import { calculateCareer } from '../utils/careerLogic.js';

const POSITIONS = ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'DM', 'LB', 'RB', 'CB', 'GK', 'any'];
const STRENGTHS_LIST = ['speed', 'dribbling', 'passing', 'shooting', 'defending', 'heading', 'stamina', 'positioning'];
const WEAKNESSES_LIST = ['speed', 'dribbling', 'passing', 'shooting', 'defending', 'heading', 'stamina', 'positioning'];

export default function CareerPage() {
  const [formData, setFormData] = useState({ age: 18, gender: 'male', strengths: [], weaknesses: [], position: 'any' });
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0); // 0=form, 1=result

  function toggleItem(arr, item) {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  function toggleStrength(s) {
    setFormData(prev => ({ ...prev, strengths: toggleItem(prev.strengths, s) }));
  }
  function toggleWeakness(w) {
    setFormData(prev => ({ ...prev, weaknesses: toggleItem(prev.weaknesses, w) }));
  }

  function handleSubmit() {
    if (formData.strengths.length === 0) return;
    const res = calculateCareer(formData);
    setResult(res);
    setStep(1);
  }

  if (step === 1 && result) {
    return (
      <div className="fade-in">
        <div className="header">
          <div>
            <h1 className="page-title" style={{ fontSize: 20 }}>Career Result</h1>
            <p className="text-muted text-xs">Your football destiny revealed!</p>
          </div>
        </div>

        <div className="p-page pt-16">
          {/* Club Card */}
          <div className="career-result-card" style={{ marginBottom: 16, textAlign: 'center' }}>
            <div className="text-xs text-muted font-semibold" style={{ marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🏟️ Best Club Fit</div>
            <img src={result.club.logo} alt={result.club.name} style={{ width: 72, height: 72, objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} onError={e => { e.target.style.display='none'; }} />
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--blue)' }}>{result.club.name}</h2>
            <span className="badge badge-blue">{result.club.league} · {result.playingStyle.toUpperCase()} STYLE</span>
          </div>

          {/* Similar Player */}
          <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <div className="text-xs text-muted font-semibold" style={{ marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🌟 Most Similar Player</div>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{result.similarPlayer.nationality}</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>{result.similarPlayer.name}</h3>
            <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>{result.similarPlayer.description}</p>
          </div>

          {/* Position & Potential */}
          <div className="flex gap-8 mb-20">
            <div className="hero-stat" style={{ flex: 1 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📍</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--green)', marginBottom: 4 }}>Ideal Position</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{result.idealPosition}</div>
            </div>
            <div className="hero-stat" style={{ flex: 1 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>⭐</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--yellow)', marginBottom: 4 }}>Potential Rating</div>
              <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--yellow)' }}>{result.potentialRating}</div>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: 18, marginBottom: 24, background: 'rgba(255,255,255,0.03)' }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{result.description}</p>
          </div>

          <button className="btn btn-outline btn-full" onClick={() => setStep(0)} id="career-retake-btn">
            🔄 Try Again with Different Attributes
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
          <h1 className="page-title" style={{ fontSize: 20 }}>Career Predictor</h1>
          <p className="text-muted text-xs">Discover your football destiny</p>
        </div>
        <span style={{ fontSize: 28 }}>🚀</span>
      </div>

      <div className="p-page pt-16">
        <div className="card" style={{ padding: 16, background: 'linear-gradient(135deg, rgba(61,142,248,0.08), rgba(29,233,182,0.04))', border: '1px solid rgba(61,142,248,0.2)', marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            🎮 Fill in your details and we'll predict which club you'd play for, which real player you're most like, and your ideal position!
          </p>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="career-age">Your Age</label>
          <input id="career-age" className="input" type="number" min="15" max="40" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: parseInt(e.target.value) || 18 }))} />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="career-gender">Gender</label>
          <select id="career-gender" className="input" value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="career-position">Preferred Position</label>
          <select id="career-position" className="input" value={formData.position} onChange={e => setFormData(p => ({ ...p, position: e.target.value }))}>
            {POSITIONS.map(pos => <option key={pos} value={pos}>{pos === 'any' ? '🤷 Let the app decide' : pos}</option>)}
          </select>
        </div>

        {/* Strengths */}
        <div style={{ marginBottom: 20 }}>
          <label className="input-label" style={{ marginBottom: 12 }}>⚡ Strengths (choose up to 3)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STRENGTHS_LIST.map(s => (
              <button
                key={s}
                className={`badge${formData.strengths.includes(s) ? ' badge-green' : ''}`}
                style={{ padding: '8px 14px', cursor: 'pointer', border: formData.strengths.includes(s) ? '1px solid rgba(0,200,83,0.4)' : '1px solid var(--border)', background: formData.strengths.includes(s) ? 'rgba(0,200,83,0.15)' : 'var(--bg-card)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: formData.strengths.includes(s) ? 'var(--green)' : 'var(--text-secondary)', transition: 'all 0.2s', textTransform: 'capitalize' }}
                onClick={() => { if (formData.strengths.length < 3 || formData.strengths.includes(s)) toggleStrength(s); }}
                id={`strength-${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div style={{ marginBottom: 28 }}>
          <label className="input-label" style={{ marginBottom: 12 }}>⚠️ Weaknesses (choose up to 2)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {WEAKNESSES_LIST.filter(w => !formData.strengths.includes(w)).map(w => (
              <button
                key={w}
                className={`badge${formData.weaknesses.includes(w) ? ' badge-red' : ''}`}
                style={{ padding: '8px 14px', cursor: 'pointer', border: formData.weaknesses.includes(w) ? '1px solid rgba(244,67,54,0.4)' : '1px solid var(--border)', background: formData.weaknesses.includes(w) ? 'rgba(244,67,54,0.1)' : 'var(--bg-card)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: formData.weaknesses.includes(w) ? 'var(--red)' : 'var(--text-secondary)', transition: 'all 0.2s', textTransform: 'capitalize' }}
                onClick={() => { if (formData.weaknesses.length < 2 || formData.weaknesses.includes(w)) toggleWeakness(w); }}
                id={`weakness-${w}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          disabled={formData.strengths.length === 0}
          id="career-submit-btn"
        >
          🚀 Predict My Career
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
