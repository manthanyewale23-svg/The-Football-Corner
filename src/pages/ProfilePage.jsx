import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { getIQLevel } from '../utils/iqLogic.js';

export default function ProfilePage() {
  const { user, userData, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const iq = userData?.iqScore || 100;
  const iqLevel = getIQLevel(iq);
  const username = userData?.username || user?.displayName || 'Football Fan';
  const email = userData?.email || user?.email || '';
  const fdp = userData?.fdpResult;
  const predCount = userData?.predictionCount || 0;
  const correctPred = userData?.correctPredictions || 0;
  const initials = username.slice(0, 2).toUpperCase();

  const menuItems = [
    { icon: '👥', label: 'Friends', sublabel: 'Find & chat with friends', to: '/friends', color: 'var(--teal)' },
    { icon: '🧬', label: 'Football DNA Profile', sublabel: fdp ? fdp.name || fdp.type : 'Not taken yet', to: '/fdp', color: 'var(--green)' },
    { icon: '🎯', label: 'My Predictions', sublabel: `${predCount} predictions`, to: '/predictions', color: 'var(--blue)' },
    { icon: '🏆', label: 'Leaderboard', sublabel: 'View global rankings', to: '/leaderboard', color: 'var(--yellow)' },
    { icon: '🚀', label: 'Career Predictor', sublabel: 'Discover your destiny', to: '/career', color: 'var(--orange)' },
    { icon: '📊', label: 'Stats Hub', sublabel: 'Top players & league table', to: '/stats', color: '#a855f7' },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/auth', { replace: true });
  }

  const isDark = theme === 'dark';

  return (
    <div className="fade-in">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontWeight: 800 }}>{initials}</span>
          )}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{username}</h1>
        <p className="text-muted text-sm" style={{ marginBottom: 12 }}>{email}</p>
        {fdp && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: `${fdp.color || 'var(--green)'}22`, border: `1px solid ${fdp.color || 'var(--green)'}44`, borderRadius: 99, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{fdp.emoji || '🧬'}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: fdp.color || 'var(--green)' }}>{fdp.name || fdp.type}</span>
          </div>
        )}
      </div>

      <div className="p-page pt-16">
        {/* IQ Stats */}
        <div className="flex gap-8 mb-20">
          <div className="hero-stat" style={{ flex: 1 }}>
            <div className="iq-score-num" style={{ fontSize: 32 }}>{iq}</div>
            <div style={{ color: iqLevel.color, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{iqLevel.emoji} {iqLevel.level}</div>
            <div className="text-xs text-muted" style={{ marginTop: 2 }}>Football IQ</div>
          </div>
          <div className="hero-stat" style={{ flex: 1 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--blue)' }}>{predCount}</div>
            <div className="text-xs text-muted" style={{ marginTop: 4 }}>Predictions</div>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--teal)', marginTop: 2 }}>
              {predCount > 0 ? `${Math.round((correctPred / predCount) * 100)}%` : '—'} correct
            </div>
          </div>
        </div>

        {/* IQ Progress */}
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div className="flex justify-between" style={{ marginBottom: 8 }}>
            <span className="text-xs text-muted font-semibold">IQ LEVEL PROGRESS</span>
            <span className="text-xs" style={{ color: iqLevel.color, fontWeight: 700 }}>{iq} / 3000</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, (iq / 3000) * 100)}%` }} />
          </div>
          <div className="flex justify-between" style={{ marginTop: 8 }}>
            <span className="text-xs text-muted">Rookie</span>
            <span className="text-xs" style={{ color: 'var(--yellow)' }}>Elite Analyst</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="card" style={{ padding: '4px 16px', marginBottom: 20 }}>
          <div className="theme-toggle-wrap">
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </div>
              <div className="text-xs text-muted">Tap to switch theme</div>
            </div>
            <div
              className={`toggle-track${isDark ? '' : ' on'}`}
              onClick={toggleTheme}
              id="theme-toggle"
              role="switch"
              aria-checked={!isDark}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="section-title mb-12">Quick Access</h2>
        <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }} id={`profile-menu-${i}`}>
              <div className="flex items-center gap-12" style={{ padding: '14px 16px', borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}>
                <div style={{ width: 40, height: 40, background: `${item.color}22`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div className="text-xs text-muted">{item.sublabel}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* App Info */}
        <div className="card" style={{ padding: 16, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚽</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>The Football Corner</div>
          <div className="text-xs text-muted" style={{ marginBottom: 12 }}>Version 2.0.0 · Your Football Universe</div>
          <div className="flex justify-center gap-8">
            <span className="badge badge-green" style={{ fontSize: 10 }}>Social</span>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>Live Scores</span>
            <span className="badge badge-teal" style={{ fontSize: 10 }}>PWA Ready</span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-full"
          id="profile-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ background: 'rgba(244,67,54,0.1)', color: 'var(--red)', border: '1px solid rgba(244,67,54,0.3)', fontWeight: 700, marginBottom: 8 }}
        >
          {loggingOut ? 'Signing out...' : '🚪 Sign Out'}
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
