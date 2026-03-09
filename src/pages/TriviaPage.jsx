import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { MOCK_TRIVIA_QUESTIONS } from '../services/mockData.js';

const DAILY_KEY = 'tfc-trivia-date';
const SCORE_KEY = 'tfc-trivia-score';
const QUESTIONS_PER_SESSION = 5;

export default function TriviaPage() {
  const { userData, updateUserData } = useAuth();
  const [phase, setPhase] = useState('start'); // start | quiz | result | done
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [iqGained, setIqGained] = useState(0);
  const [results, setResults] = useState([]);

  const today = new Date().toDateString();
  const alreadyPlayed = localStorage.getItem(DAILY_KEY) === today;

  function startQuiz() {
    const shuffled = [...MOCK_TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SESSION);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setIqGained(0);
    setResults([]);
    setPhase('quiz');
  }

  function handleAnswer(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[current];
    const correct = idx === q.correctIndex;
    const pts = correct ? 15 : -5;
    setScore(s => s + (correct ? 1 : 0));
    setIqGained(g => g + pts);
    setResults(r => [...r, { correct, pts }]);
  }

  async function next() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      // Save
      const newIQ = Math.max(0, (userData?.iqScore || 100) + iqGained);
      await updateUserData({ iqScore: newIQ });
      localStorage.setItem(DAILY_KEY, today);
      localStorage.setItem(SCORE_KEY, score + (selected === questions[current].correctIndex ? 1 : 0));
      setPhase('result');
    }
  }

  if (alreadyPlayed && phase === 'start') {
    return (
      <div className="fade-in">
        <div className="header">
          <div>
            <h1 className="page-title" style={{ fontSize: 20 }}>Daily Trivia</h1>
            <p className="text-muted text-xs">Come back tomorrow!</p>
          </div>
          <span style={{ fontSize: 28 }}>🧩</span>
        </div>
        <div className="p-page pt-16" style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Already played today!</h2>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
            You've completed today's trivia. Come back tomorrow for a new set of questions and more IQ points!
          </p>
          <div className="card" style={{ padding: 20, textAlign: 'center', display: 'inline-block', minWidth: 180 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Today's Score</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--yellow)' }}>
              {localStorage.getItem(SCORE_KEY) || 0}/{QUESTIONS_PER_SESSION}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const finalScore = results.filter(r => r.correct).length;
    const totalIQ = results.reduce((a, r) => a + r.pts, 0);
    return (
      <div className="fade-in">
        <div className="header">
          <h1 className="page-title" style={{ fontSize: 20 }}>Trivia Complete!</h1>
        </div>
        <div className="p-page pt-16" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>
            {finalScore >= 4 ? '🏆' : finalScore >= 2 ? '⭐' : '📚'}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
            {finalScore >= 4 ? 'Football Genius!' : finalScore >= 2 ? 'Good effort!' : 'Keep learning!'}
          </h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '24px 0' }}>
            <div className="card" style={{ padding: '16px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--green)' }}>{finalScore}/{QUESTIONS_PER_SESSION}</div>
              <div className="text-xs text-muted">Correct</div>
            </div>
            <div className="card" style={{ padding: '16px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: totalIQ >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {totalIQ > 0 ? '+' : ''}{totalIQ}
              </div>
              <div className="text-xs text-muted">IQ Points</div>
            </div>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Come back tomorrow for more questions!</p>
          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  if (phase === 'start') {
    return (
      <div className="fade-in">
        <div className="header">
          <div>
            <h1 className="page-title" style={{ fontSize: 20 }}>Daily Trivia</h1>
            <p className="text-muted text-xs">Test your football knowledge</p>
          </div>
          <span style={{ fontSize: 28 }}>🧩</span>
        </div>
        <div className="p-page pt-16">
          <div className="iq-bar-wrap slide-up" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🧩</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Daily Football Trivia</h2>
            <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
              Answer 5 questions to earn IQ points.<br />New questions every day!
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            {[
              { icon: '✅', label: 'Correct', val: '+15 IQ', color: 'var(--green)' },
              { icon: '❌', label: 'Wrong', val: '-5 IQ', color: 'var(--red)' },
              { icon: '📅', label: 'Daily', val: '1x/day', color: 'var(--blue)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: s.color }}>{s.val}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={startQuiz} id="trivia-start-btn">
            🧩 Start Today's Quiz
          </button>
          <div style={{ height: 24 }} />
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Daily Trivia</h1>
          <p className="text-muted text-xs">Question {current + 1} of {questions.length}</p>
        </div>
        <span className="badge badge-yellow">{questions.length - current - 1} left</span>
      </div>

      <div className="p-page pt-16">
        <div className="progress-bar" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.6 }}>{q.question}</h2>
        </div>

        <div>
          {q.options.map((opt, i) => {
            let cls = 'trivia-option';
            if (answered) {
              if (i === q.correctIndex) cls += ' correct';
              else if (i === selected) cls += ' wrong';
              else cls += ' disabled';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} id={`trivia-opt-${current}-${i}`}>
                <span style={{ marginRight: 10, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 12, textAlign: 'center',
            background: selected === q.correctIndex ? 'rgba(0,200,83,0.1)' : 'rgba(244,67,54,0.1)',
            border: `1px solid ${selected === q.correctIndex ? 'rgba(0,200,83,0.3)' : 'rgba(244,67,54,0.3)'}` }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: selected === q.correctIndex ? 'var(--green)' : 'var(--red)' }}>
              {selected === q.correctIndex ? '🎯 Correct! +15 IQ' : `❌ Wrong! -5 IQ`}
            </div>
            {selected !== q.correctIndex && (
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                Answer: {q.options[q.correctIndex]}
              </div>
            )}
            <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 13, padding: '10px 28px' }}
              onClick={next} id="trivia-next-btn">
              {current + 1 === questions.length ? '🏆 See Results' : 'Next →'}
            </button>
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
