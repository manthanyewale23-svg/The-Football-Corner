import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLiveMatches, fetchFixtures, fetchFootballNews } from '../services/footballApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getIQLevel } from '../utils/iqLogic.js';
import { useNotifications } from '../contexts/NotificationContext.jsx';

export default function HomePage() {
  const { userData } = useAuth();
  const { unreadCount } = useNotifications();
  const [liveMatches, setLiveMatches] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const [news, setNews] = useState([]);
  const [activeNewsIdx, setActiveNewsIdx] = useState(0);
  const iq = userData?.iqScore || 100;
  const iqLevel = getIQLevel(iq);

  useEffect(() => {
    fetchLiveMatches().then(setLiveMatches);
    fetchFixtures().then(fixtures => {
      const next = fixtures.find(f => f.status === 'NS');
      setNextFixture(next || null);
    });
    fetchFootballNews().then(setNews);
  }, []);

  // Auto-rotate news
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setActiveNewsIdx(i => (i + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="header">
        <div className="header-logo">
          <div className="header-logo-icon">⚽</div>
          <span className="header-title">The Football Corner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none', fontSize: 22 }} id="home-bell">
            🔔
            {unreadCount > 0 && (
              <span className="nav-badge" style={{ top: -4, right: -4 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>
          <Link to="/profile" id="home-profile-link">
            <div className="avatar" style={{ width: 36, height: 36, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--green)', fontSize: 18 }}>
              {userData?.photoURL ? <img src={userData.photoURL} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : '👤'}
            </div>
          </Link>
        </div>
      </div>

      <div className="p-page pt-16">
        {/* IQ Score Card */}
        <div className="iq-bar-wrap slide-up" style={{ marginBottom: 20 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span className="text-muted text-sm font-semibold">Your Football IQ</span>
            <span style={{ fontSize: 20 }}>{iqLevel.emoji}</span>
          </div>
          <div className="iq-score-num">{iq}</div>
          <p style={{ color: iqLevel.color, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{iqLevel.level}</p>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, (iq / 3000) * 100)}%` }} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-8 mb-20">
          <Link to="/fdp" className="btn btn-outline btn-sm" style={{ flex: 1, textDecoration: 'none', fontSize: 11 }} id="home-btn-fdp">
            🧬 DNA
          </Link>
          <Link to="/career" className="btn btn-secondary btn-sm" style={{ flex: 1, textDecoration: 'none', fontSize: 11, border: '1px solid var(--border)' }} id="home-btn-career">
            🚀 Career
          </Link>
          <Link to="/predictions" className="btn btn-secondary btn-sm" style={{ flex: 1, textDecoration: 'none', fontSize: 11, border: '1px solid var(--border)' }} id="home-btn-predict">
            🎯 Predict
          </Link>
          <Link to="/community" className="btn btn-secondary btn-sm" style={{ flex: 1, textDecoration: 'none', fontSize: 11, border: '1px solid var(--border)' }} id="home-btn-community">
            🌍 Social
          </Link>
        </div>

        {/* Live Matches */}
        <div className="section-header">
          <h2 className="section-title">🔴 Live Now</h2>
          <Link to="/matches" style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }} id="home-see-all-matches">See all →</Link>
        </div>

        {liveMatches.map(match => (
          <Link key={match.id} to={`/matches/${match.id}`} style={{ textDecoration: 'none' }} id={`live-match-${match.id}`}>
            <div className="card match-card mb-12">
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span className="badge badge-live" style={{ fontSize: 10 }}>● LIVE {match.minute}'</span>
                <span className="text-muted text-xs">{match.league}</span>
              </div>
              <div className="match-teams">
                <div className="match-team">
                  <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
                  <span className="team-name">{match.homeTeam.name}</span>
                </div>
                <div className="match-score-center">
                  <span className="score-display">{match.homeTeam.score} – {match.awayTeam.score}</span>
                  <span className="match-time">{match.minute}'</span>
                </div>
                <div className="match-team">
                  <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
                  <span className="team-name">{match.awayTeam.name}</span>
                </div>
              </div>
              {/* Win probability */}
              {match.winProb && (
                <div className="flex gap-8" style={{ marginTop: 14 }}>
                  {[
                    { label: match.homeTeam?.name?.split(' ')[0] || 'Home', val: match.winProb.home, color: 'var(--green)' },
                    { label: 'Draw', val: match.winProb.draw, color: 'var(--yellow)' },
                    { label: match.awayTeam?.name?.split(' ')[0] || 'Away', val: match.winProb.away, color: 'var(--blue)' },
                  ].map(w => (
                    <div key={w.label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ height: 3, background: w.color, borderRadius: 99, opacity: 0.7, width: `${w.val}%`, marginLeft: 'auto', marginRight: 'auto', marginBottom: 4 }} />
                      <span className="text-xs text-muted">{w.val}%</span>
                      <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{w.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* Next Fixture */}
        {nextFixture && (
          <>
            <div className="section-header" style={{ marginTop: 8 }}>
              <h2 className="section-title">📅 Coming Up</h2>
            </div>
            <div className="card match-card mb-20">
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span className="badge badge-blue">KO {new Date(nextFixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-muted text-xs">{nextFixture.league}</span>
              </div>
              <div className="match-teams">
                <div className="match-team">
                  <img src={nextFixture.homeTeam.logoUrl} alt={nextFixture.homeTeam.name} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
                  <span className="team-name">{nextFixture.homeTeam.name}</span>
                </div>
                <div className="match-score-center">
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)' }}>vs</span>
                  <span className="match-time">{new Date(nextFixture.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="match-team">
                  <img src={nextFixture.awayTeam.logoUrl} alt={nextFixture.awayTeam.name} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
                  <span className="team-name">{nextFixture.awayTeam.name}</span>
                </div>
              </div>
              <Link to="/predictions" className="btn btn-outline btn-sm btn-full" style={{ textDecoration: 'none', marginTop: 14 }} id="fixture-predict-btn">
                🎯 Predict this match
              </Link>
            </div>
          </>
        )}

        {/* News Feed */}
        <div className="section-header">
          <h2 className="section-title">📰 Football News</h2>
        </div>

        {news.length === 0 && (
          <div className="text-center p-4">
            <div className="loader-spinner" style={{ margin: '0 auto', marginBottom: 10 }} />
            <p className="text-muted text-sm">Loading headlines...</p>
          </div>
        )}

        {news.map((article, i) => (
          <div key={article.id} className="card news-card mb-12" style={{ animationDelay: `${i * 0.08}s` }}>
            <img src={article.image} alt={article.title} className="news-card-img" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80'; }} />
            <div className="news-card-body">
              <div className="flex items-center gap-8" style={{ marginBottom: 8 }}>
                <span className="badge badge-green" style={{ fontSize: 10 }}>{article.category}</span>
                <span className="text-xs text-muted">{article.source}</span>
                <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>
                  {timeAgo(article.publishedAt)}
                </span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 8, color: 'var(--text-primary)' }}>{article.title}</h3>
              <p className="text-muted text-sm" style={{ lineHeight: 1.6, marginBottom: 10 }}>{article.description.slice(0, 120)}...</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ width: 'auto', fontSize: 12 }} id={`news-read-${article.id}`}>
                Read Full Article →
              </a>
            </div>
          </div>
        ))}

        {/* Pitch-style pitch pattern bottom */}
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
