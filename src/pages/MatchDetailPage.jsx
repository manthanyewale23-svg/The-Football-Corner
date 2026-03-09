import { useParams, Link } from 'react-router-dom';
import { MOCK_LIVE_MATCHES, MOCK_FIXTURES } from '../services/mockData.js';

export default function MatchDetailPage() {
  const { id } = useParams();
  const allMatches = [...MOCK_LIVE_MATCHES, ...MOCK_FIXTURES];
  const match = allMatches.find(m => String(m.id) === String(id));

  if (!match) return (
    <div className="fade-in">
      <div className="header">
        <Link to="/matches" className="btn btn-secondary btn-sm" id="match-detail-back" style={{ textDecoration: 'none' }}>← Back</Link>
      </div>
      <div className="empty-state"><div className="empty-state-icon">🔍</div><p>Match not found</p></div>
    </div>
  );

  const isLive = match.status === 'LIVE';
  const isFT = match.status === 'FT';

  return (
    <div className="fade-in">
      <div className="header">
        <Link to="/matches" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }} id="match-detail-back-link">← Matches</Link>
        <span className="text-muted text-xs">{match.league}</span>
      </div>

      {/* Score hero */}
      <div style={{ background: 'linear-gradient(160deg, rgba(0,200,83,0.08) 0%, transparent 60%)', padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        {isLive && <span className="badge badge-live" style={{ fontSize: 10, marginBottom: 16, display: 'inline-block' }}>● LIVE {match.minute}'</span>}
        {isFT && <span className="badge badge-teal" style={{ marginBottom: 16, display: 'inline-block' }}>Full Time</span>}

        <div className="match-teams" style={{ marginBottom: 8 }}>
          <div className="match-team">
            <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} style={{ width: 60, height: 60 }} className="team-logo" onError={e => { e.target.style.display='none'; }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{match.homeTeam.name}</span>
          </div>
          <div className="match-score-center">
            {(isLive || isFT) ? (
              <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2 }}>{match.homeTeam.score} – {match.awayTeam.score}</span>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)' }}>vs</span>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                  {new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
          <div className="match-team">
            <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} style={{ width: 60, height: 60 }} className="team-logo" onError={e => { e.target.style.display='none'; }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{match.awayTeam.name}</span>
          </div>
        </div>
        <p className="text-muted text-xs">{match.venue}</p>
      </div>

      <div className="p-page pt-16">
        {/* Win Probability */}
        {match.winProb && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 14 }}>Win Probability</h3>
            <div className="flex" style={{ height: 10, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 10 }}>
              <div style={{ flex: match.winProb.home, background: 'var(--green)', borderRadius: '99px 0 0 99px' }} />
              <div style={{ flex: match.winProb.draw, background: 'var(--yellow)' }} />
              <div style={{ flex: match.winProb.away, background: 'var(--blue)', borderRadius: '0 99px 99px 0' }} />
            </div>
            <div className="flex justify-between" style={{ marginTop: 8 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 18 }}>{match.winProb.home}%</div>
                <div className="text-xs text-muted">{match.homeTeam.name.split(' ')[0]}</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--yellow)', fontSize: 18 }}>{match.winProb.draw}%</div>
                <div className="text-xs text-muted">Draw</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--blue)', fontSize: 18 }}>{match.winProb.away}%</div>
                <div className="text-xs text-muted">{match.awayTeam.name.split(' ')[0]}</div>
              </div>
            </div>
          </div>
        )}

        {/* Match Stats */}
        {match.stats && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 14 }}>Match Statistics</h3>
            {[
              { label: 'Possession', home: `${match.stats.possession.home}%`, away: `${match.stats.possession.away}%`, homeVal: match.stats.possession.home },
              { label: 'Shots', home: match.stats.shots.home, away: match.stats.shots.away, homeVal: match.stats.shots.home / (match.stats.shots.home + match.stats.shots.away) * 100 },
              { label: 'Shots On Target', home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away, homeVal: match.stats.shotsOnTarget.home / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away + 0.01) * 100 },
              { label: 'Corners', home: match.stats.corners.home, away: match.stats.corners.away, homeVal: match.stats.corners.home / (match.stats.corners.home + match.stats.corners.away + 0.01) * 100 },
              { label: 'Fouls', home: match.stats.fouls.home, away: match.stats.fouls.away, homeVal: match.stats.fouls.home / (match.stats.fouls.home + match.stats.fouls.away + 0.01) * 100 },
              { label: 'Yellow Cards', home: match.stats.yellowCards.home, away: match.stats.yellowCards.away, homeVal: match.stats.yellowCards.home / (match.stats.yellowCards.home + match.stats.yellowCards.away + 0.01) * 100 },
              { label: 'Saves', home: match.stats.saves.home, away: match.stats.saves.away, homeVal: match.stats.saves.home / (match.stats.saves.home + match.stats.saves.away + 0.01) * 100 },
            ].map(stat => (
              <div key={stat.label} style={{ marginBottom: 14 }}>
                <div className="flex justify-between" style={{ marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{stat.home}</span>
                  <span className="text-xs text-muted" style={{ fontWeight: 600 }}>{stat.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{stat.away}</span>
                </div>
                <div className="flex" style={{ gap: 2 }}>
                  <div style={{ flex: stat.homeVal, height: 4, background: 'var(--green)', borderRadius: '99px 0 0 99px', minWidth: 4 }} />
                  <div style={{ flex: 100 - stat.homeVal, height: 4, background: 'var(--blue)', borderRadius: '0 99px 99px 0', minWidth: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lineups */}
        {match.homeLineup && (
          <div className="card" style={{ padding: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 14 }}>Lineups</h3>
            <div className="flex gap-12">
              <div style={{ flex: 1 }}>
                <div className="text-xs text-muted font-semibold" style={{ marginBottom: 8 }}>{match.homeTeam.name}</div>
                {match.homeLineup.map((p, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 16 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ flex: 1 }}>
                <div className="text-xs text-muted font-semibold" style={{ marginBottom: 8 }}>{match.awayTeam.name}</div>
                {match.awayLineup.map((p, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 16 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
