import { useState, useEffect } from 'react';
import { fetchStandings, fetchTopScorers, COMPS } from '../services/footballApi.js';

const LEAGUES = [
  { id: COMPS.PL, name: 'Premier League' },
  { id: COMPS.PD, name: 'La Liga' },
  { id: COMPS.SA, name: 'Serie A' },
  { id: COMPS.BL1, name: 'Bundesliga' },
  { id: COMPS.FL1, name: 'Ligue 1' }
];

export default function StatsPage() {
  const [tab, setTab] = useState('players');
  const [activeLeague, setActiveLeague] = useState(COMPS.PL);
  const [search, setSearch] = useState('');
  const [players, setPlayers] = useState([]);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [scorers, standings] = await Promise.all([
        fetchTopScorers(activeLeague),
        fetchStandings(activeLeague),
      ]);
      setPlayers(scorers);
      setTable(standings);
      setLoading(false);
    }
    load();
  }, [activeLeague]);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Stats Hub</h1>
          <p className="text-muted text-xs">Players & League Tables</p>
        </div>
        <span style={{ fontSize: 24 }}>📊</span>
      </div>

      <div className="p-page pt-16">
        <div className="tab-bar">
          <button className={`tab-btn${tab === 'players' ? ' active' : ''}`} onClick={() => setTab('players')} id="stats-tab-players">
            👟 Top Players
          </button>
          <button className={`tab-btn${tab === 'teams' ? ' active' : ''}`} onClick={() => setTab('teams')} id="stats-tab-teams">
            🏆 League Table
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'none' }}>
          {LEAGUES.map(l => (
            <button 
              key={l.id} 
              onClick={() => setActiveLeague(l.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                whiteSpace: 'nowrap',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                background: activeLeague === l.id ? 'var(--primary)' : 'var(--surface)',
                color: activeLeague === l.id ? 'black' : 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {l.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loader-wrap" style={{ minHeight: 180 }}>
            <div className="loader-spinner" />
            <p className="text-muted text-sm">Loading stats...</p>
          </div>
        )}

        {!loading && tab === 'players' && (
          <>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <input
                className="input"
                placeholder="🔍 Search player or team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="stats-search"
              />
            </div>

            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p>No players found</p>
              </div>
            )}

            {filtered.map((player, i) => (
              <div key={player.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }} id={`player-card-${player.id}`}>
                <div style={{ fontWeight: 900, fontSize: 20, color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text-muted)', minWidth: 28, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <img src={player.logo} alt={player.team} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 2 }} onError={e => { e.target.style.display = 'none'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{player.nationality}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.name}</span>
                  </div>
                  <div className="text-xs text-muted">{player.team} · {player.position}</div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 17, color: 'var(--green)' }}>{player.goals}</div>
                    <div className="text-xs text-muted">⚽ Goals</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 17, color: 'var(--blue)' }}>{player.assists}</div>
                    <div className="text-xs text-muted">🎯 Assists</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 17, color: 'var(--yellow)' }}>{player.rating}</div>
                    <div className="text-xs text-muted">⭐ Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && tab === 'teams' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <span className="text-xs text-muted font-semibold" style={{ minWidth: 28 }}>#</span>
              <span className="text-xs text-muted font-semibold" style={{ flex: 1 }}>Club</span>
              <span className="text-xs text-muted font-semibold league-stat">P</span>
              <span className="text-xs text-muted font-semibold league-stat">W</span>
              <span className="text-xs text-muted font-semibold league-stat">D</span>
              <span className="text-xs text-muted font-semibold league-stat">L</span>
              <span className="text-xs text-muted font-semibold league-stat">GD</span>
              <span className="text-xs text-muted font-semibold" style={{ minWidth: 36, textAlign: 'center' }}>Form</span>
              <span className="text-xs text-muted font-semibold league-pts">Pts</span>
            </div>

            {table.map((row, i) => (
              <div key={row.pos} className="league-row" id={`table-row-${i}`}>
                <span className="league-pos" style={{ color: row.pos <= 4 ? 'var(--green)' : row.pos >= 18 ? 'var(--red)' : 'var(--text-secondary)' }}>
                  {row.pos <= 4 ? '●' : ''}{row.pos}
                </span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <img src={row.logo} alt={row.team} style={{ width: 22, height: 22, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                  <span className="league-team-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{row.team}</span>
                </div>
                <span className="league-stat">{row.played}</span>
                <span className="league-stat">{row.won}</span>
                <span className="league-stat">{row.drawn}</span>
                <span className="league-stat">{row.lost}</span>
                <span className="league-stat" style={{ color: row.gd.startsWith('+') ? 'var(--green)' : 'var(--red)' }}>{row.gd}</span>
                <div style={{ display: 'flex', gap: 2, minWidth: 36, justifyContent: 'center' }}>
                  {row.form.slice(-3).map((f, fi) => (
                    <div key={fi} className={`form-dot ${f}`} style={{ width: 14, height: 14, fontSize: 7 }}>{f}</div>
                  ))}
                </div>
                <span className="league-pts">{row.pts}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
