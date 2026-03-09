import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FIXTURES } from '../services/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { evaluatePrediction, getIQLevel } from '../utils/iqLogic.js';

export default function PredictionsPage() {
  const { userData, updateUserData } = useAuth();
  const [predictions, setPredictions] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [results, setResults] = useState({});
  const iq = userData?.iqScore || 100;
  const iqLevel = getIQLevel(iq);

  const fixtures = MOCK_FIXTURES.filter(f => f.status === 'NS');

  function handleScore(matchId, team, value) {
    const val = Math.max(0, Math.min(20, parseInt(value) || 0));
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || { homeScore: 0, awayScore: 0 }), [team]: val },
    }));
  }

  async function submitPrediction(match) {
    const pred = predictions[match.id] || { homeScore: 0, awayScore: 0 };
    // Simulate result using mock (in production: check after match finishes)
    const mockResult = { homeScore: 2, awayScore: 1 }; // demo result
    const evaluation = evaluatePrediction(pred, mockResult);

    setSubmitted(prev => ({ ...prev, [match.id]: pred }));
    setResults(prev => ({ ...prev, [match.id]: evaluation }));

    // Update IQ score
    const newIQ = Math.max(0, iq + evaluation.points);
    await updateUserData({
      iqScore: newIQ,
      predictionCount: (userData?.predictionCount || 0) + 1,
    });
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Predictions</h1>
          <p className="text-muted text-xs">Football IQ Points System</p>
        </div>
        <Link to="/leaderboard" style={{ textDecoration: 'none' }} id="predictions-leaderboard-link">
          <span className="badge badge-yellow">🏆 Ranks</span>
        </Link>
      </div>

      <div className="p-page pt-16">
        {/* IQ Score */}
        <div className="iq-bar-wrap">
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <span className="text-muted text-sm font-semibold">Football IQ Score</span>
            <span style={{ fontSize: 20 }}>{iqLevel.emoji}</span>
          </div>
          <div className="iq-score-num">{iq}</div>
          <p style={{ color: iqLevel.color, fontWeight: 700, fontSize: 12, marginTop: 4 }}>{iqLevel.level}</p>
          <div className="flex items-center gap-8 mt-12" style={{ marginTop: 10 }}>
            <span className="badge badge-green" style={{ fontSize: 10 }}>+25 Exact Score</span>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>+10 Correct Result</span>
            <span className="badge badge-red" style={{ fontSize: 10 }}>-3 Wrong</span>
          </div>
        </div>

        <h2 className="section-title mb-12">📅 Predict Today's Matches</h2>

        {fixtures.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No fixtures available to predict right now</p>
          </div>
        )}

        {fixtures.map(match => {
          const isSubmitted = !!submitted[match.id];
          const result = results[match.id];
          const pred = predictions[match.id] || { homeScore: 0, awayScore: 0 };

          return (
            <div key={match.id} className="card prediction-match" id={`prediction-${match.id}`}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span className="badge badge-blue" style={{ fontSize: 10 }}>
                  {new Date(match.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-xs text-muted">{match.league}</span>
              </div>

              <div className="match-teams">
                <div className="match-team">
                  <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="team-logo" onError={e => { e.target.style.display='none'; }} />
                  <span className="team-name">{match.homeTeam.name}</span>
                </div>

                <div className="match-score-center" style={{ gap: 8 }}>
                  <div className="flex items-center gap-8">
                    <input
                      type="number"
                      className="score-input"
                      min="0" max="20"
                      value={pred.homeScore}
                      onChange={e => handleScore(match.id, 'homeScore', e.target.value)}
                      disabled={isSubmitted}
                      id={`score-home-${match.id}`}
                    />
                    <span style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: 20 }}>–</span>
                    <input
                      type="number"
                      className="score-input"
                      min="0" max="20"
                      value={pred.awayScore}
                      onChange={e => handleScore(match.id, 'awayScore', e.target.value)}
                      disabled={isSubmitted}
                      id={`score-away-${match.id}`}
                    />
                  </div>
                  <span className="text-xs text-muted">Your prediction</span>
                </div>

                <div className="match-team">
                  <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="team-logo" onError={e => { e.target.style.display='none'; }} />
                  <span className="team-name">{match.awayTeam.name}</span>
                </div>
              </div>

              {!isSubmitted ? (
                <button
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 14, fontSize: 13 }}
                  onClick={() => submitPrediction(match)}
                  id={`submit-prediction-${match.id}`}
                >
                  🎯 Lock In Prediction
                </button>
              ) : (
                <div style={{ marginTop: 14 }}>
                  {result && (
                    <div style={{ padding: '12px 16px', borderRadius: 12, textAlign: 'center', background: result.result === 'wrong' ? 'rgba(244,67,54,0.1)' : 'rgba(0,200,83,0.1)', border: `1px solid ${result.result === 'wrong' ? 'rgba(244,67,54,0.3)' : 'rgba(0,200,83,0.3)'}` }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: result.result === 'wrong' ? 'var(--red)' : 'var(--green)' }}>
                        {result.result === 'exact' ? '🎯 Perfect!' : result.result === 'correct' ? '✅ Correct!' : '❌ Wrong'} {result.points > 0 ? `+${result.points}` : result.points} IQ
                      </div>
                      <div className="text-xs text-muted" style={{ marginTop: 4 }}>Demo: Result was 2–1. {result.label}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
