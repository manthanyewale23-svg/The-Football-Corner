import { useState } from 'react';
import { MOCK_LEADERBOARD, MOCK_WEEKLY_LEADERBOARD } from '../services/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getIQLevel } from '../utils/iqLogic.js';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext.jsx';

const STREAKS = { u1: 7, u3: 12, u2: 5, u4: 3, u5: 9, u6: 4, u7: 2, u8: 6, u9: 1, u10: 8 };

export default function LeaderboardPage() {
  const { userData } = useAuth();
  const { unreadCount } = useNotifications();
  const [tab, setTab] = useState('alltime');
  const myIQ = userData?.iqScore || 100;
  const myLevel = getIQLevel(myIQ);

  const board = (tab === 'alltime' ? MOCK_LEADERBOARD : MOCK_WEEKLY_LEADERBOARD)
    .map(row => ({ ...row, isMe: false }));
  const medals = ['🥇', '🥈', '🥉'];

  const myEntry = {
    uid: userData?.uid || 'me',
    rank: '?',
    username: userData?.username || 'You',
    iqScore: myIQ,
    predictions: userData?.predictionCount || 0,
    streak: 1,
    isMe: true,
  };

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Leaderboard</h1>
          <p className="text-muted text-xs">Global Football IQ Rankings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none', fontSize: 22 }} id="lb-bell">
            🔔
            {unreadCount > 0 && <span className="nav-badge" style={{ top: -4, right: -4 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </Link>
          <span className="badge badge-yellow">🏆 Live</span>
        </div>
      </div>

      <div className="p-page pt-16">
        {/* Tab toggle */}
        <div className="tab-bar">
          <button className={`tab-btn${tab === 'alltime' ? ' active' : ''}`} onClick={() => setTab('alltime')} id="lb-tab-alltime">
            🌍 All Time
          </button>
          <button className={`tab-btn${tab === 'weekly' ? ' active' : ''}`} onClick={() => setTab('weekly')} id="lb-tab-weekly">
            📅 This Week
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-8" style={{ marginBottom: 24 }}>
          {[board[1], board[0], board[2]].map((entry, i) => {
            const heights = [80, 100, 70];
            const positions = [2, 1, 3];
            const streak = STREAKS[entry.uid] || 1;
            return (
              <div key={entry.uid} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 2, color: i === 1 ? 'var(--green)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.username}
                </div>
                {streak >= 5 && <div style={{ fontSize: 12, marginBottom: 2 }}>🔥{streak}</div>}
                <div style={{ fontSize: 20, marginBottom: 4 }}>{medals[positions[i] - 1]}</div>
                <div style={{ background: i === 1 ? 'linear-gradient(180deg, rgba(0,200,83,0.2), rgba(0,200,83,0.05))' : 'var(--surface)', borderRadius: '12px 12px 0 0', height: heights[i], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '12px 8px', border: i === 1 ? '1px solid rgba(0,200,83,0.3)' : '1px solid var(--border)', borderBottom: 'none' }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: i === 1 ? 'var(--green)' : 'var(--text-primary)' }}>{entry.iqScore.toLocaleString()}</div>
                  <div className="text-xs text-muted">IQ</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your position */}
        <div className="card" style={{ padding: 0, marginBottom: 16, border: '1.5px solid rgba(0,200,83,0.3)' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(0,200,83,0.06)', borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs text-green font-bold">YOUR POSITION</span>
          </div>
          <LBRow entry={myEntry} isHighlighted />
        </div>

        {/* Full board */}
        <h2 className="section-title mb-12">Top {board.length} Players</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {board.map(entry => <LBRow key={entry.uid} entry={entry} streak={STREAKS[entry.uid] || 1} />)}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function LBRow({ entry, isHighlighted, streak = 1 }) {
  const level = getIQLevel(entry.iqScore);
  const rankClass = entry.rank === 1 ? 'top-1' : entry.rank === 2 ? 'top-2' : entry.rank === 3 ? 'top-3' : '';
  const initials = (entry.username || 'U').slice(0, 2).toUpperCase();
  return (
    <div className="lb-row" id={`lb-row-${entry.uid}`} style={isHighlighted ? { background: 'rgba(0,200,83,0.04)' } : {}}>
      <span className={`lb-rank ${rankClass}`}>{entry.rank === '?' ? '?' : `#${entry.rank}`}</span>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: 'var(--green)', border: '1.5px solid var(--border)', flexShrink: 0 }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          {entry.username}
          {isHighlighted && <span style={{ color: 'var(--green)', fontSize: 11 }}>(You)</span>}
          {streak >= 3 && <span style={{ fontSize: 11 }}>🔥{streak}</span>}
        </div>
        <div className="text-xs" style={{ color: level.color, marginTop: 2 }}>{level.level}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>{entry.iqScore.toLocaleString()}</div>
        <div className="text-xs text-muted">IQ pts</div>
      </div>
    </div>
  );
}
