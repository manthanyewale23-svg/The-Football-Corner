import { useState, useEffect } from 'react';
import { fetchLiveMatches, fetchFixtures, fetchStandings, fetchTopScorers, COMPS } from '../services/footballApi.js';

const TABS = ['Live', 'Fixtures', 'Table', 'Players'];
const LEAGUES = [
  { id: COMPS.PL, name: 'Premier League' },
  { id: COMPS.PD, name: 'La Liga' },
  { id: COMPS.SA, name: 'Serie A' },
  { id: COMPS.BL1, name: 'Bundesliga' },
  { id: COMPS.FL1, name: 'Ligue 1' }
];

export default function MatchesPage() {
  const [tab, setTab] = useState('Live');
  const [activeLeague, setActiveLeague] = useState(COMPS.PL);
  const [liveMatches, setLiveMatches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear potentially stale live cache on mount so we always get fresh live data
    localStorage.removeItem('tfc_live_v2');
    load();
  }, []);

  // Re-fetch standings and scorers when the selected league changes
  useEffect(() => {
    async function loadLeagueData() {
      if (tab !== 'Table' && tab !== 'Players') return;
      setLoading(true);
      const [stand, score] = await Promise.all([
        fetchStandings(activeLeague),
        fetchTopScorers(activeLeague),
      ]);
      setStandings(stand);
      setScorers(score);
      setLoading(false);
    }
    loadLeagueData();
  }, [activeLeague, tab]);

  async function load() {
    setLoading(true);
    const [live, fix, stand, score] = await Promise.all([
      fetchLiveMatches(),
      fetchFixtures(),
      fetchStandings(activeLeague),
      fetchTopScorers(activeLeague),
    ]);
    setLiveMatches(live);
    setFixtures(fix);
    setStandings(stand);
    setScorers(score);
    setLoading(false);
  }

  async function refreshLive() {
    localStorage.removeItem('tfc_live_v2');
    const live = await fetchLiveMatches();
    setLiveMatches(live);
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Match Center</h1>
          <p className="text-muted text-xs">Live scores & fixtures</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-live" style={{ fontSize: 10 }}>● {liveMatches.length} LIVE</span>
          <button onClick={refreshLive} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} title="Refresh live scores" id="btn-refresh-live">🔄</button>
        </div>
      </div>

      <div className="p-page pt-16">
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => { setTab(t); if (loading && (t === 'Table' || t === 'Players')) setLoading(false); }} id={`matches-tab-${t.toLowerCase()}`}>{t}</button>
          ))}
        </div>

        {(tab === 'Table' || tab === 'Players') && (
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
        )}

        {loading && (
          <div className="loader-wrap" style={{ minHeight: 180 }}>
            <div className="loader-spinner" />
            <p className="text-muted text-sm">Loading...</p>
          </div>
        )}

        {!loading && tab === 'Live' && (
          <div>
            {liveMatches.length === 0 && (
              <div className="empty-state"><div className="empty-state-icon">📭</div><p>No live matches right now</p></div>
            )}
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {!loading && tab === 'Fixtures' && (
          <div>
            {fixtures.length === 0 && (
              <div className="empty-state"><div className="empty-state-icon">📅</div><p>No upcoming fixtures</p></div>
            )}
            {fixtures.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {!loading && tab === 'Table' && <LeagueTable standings={standings} />}
        {!loading && tab === 'Players' && <PlayerStats scorers={scorers} />}
      </div>
    </div>
  );
}

function MatchCard({ match }) {
  const isLive = match.status === 'LIVE' || match.status === '1H' || match.status === '2H' || match.status === 'HT' || match.status === 'ET' || match.status === 'P' || match.status === 'HALFTIME';
  const isFT = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const isNS = match.status === 'NS' || match.status === 'TBD';

  return (
    <div style={{ textDecoration: 'none' }} id={`match-card-${match.id}`}>
      <div className="card match-card">
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          {isLive && <span className="badge badge-live" style={{ fontSize: 10 }}>● LIVE {match.minute}'</span>}
          {isFT && <span className="badge badge-teal" style={{ fontSize: 10 }}>FT</span>}
          {isNS && (
            <span className="badge badge-blue" style={{ fontSize: 10 }}>
              {new Date(match.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className="text-muted text-xs">{match.league}</span>
        </div>
        <div className="match-teams">
          <div className="match-team">
            <img src={match?.homeTeam?.logoUrl || ''} alt={match?.homeTeam?.name || 'Home'} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
            <span className="team-name">{match?.homeTeam?.name || 'Home'}</span>
          </div>
          <div className="match-score-center">
            {(isLive || isFT) ? (
              <span className="score-display">{match?.homeTeam?.score ?? '-'} – {match?.awayTeam?.score ?? '-'}</span>
            ) : (
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-muted)' }}>vs</span>
            )}
            {isNS && match?.date && (
              <span className="match-time">
                {new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
          <div className="match-team">
            <img src={match?.awayTeam?.logoUrl || ''} alt={match?.awayTeam?.name || 'Away'} className="team-logo" onError={e => { e.target.style.display = 'none'; }} />
            <span className="team-name">{match?.awayTeam?.name || 'Away'}</span>
          </div>
        </div>
        {match?.winProb && match?.winProb?.home && (
          <div className="flex gap-8" style={{ marginTop: 14 }}>
            {[
              { label: 'H', val: match.winProb.home, color: 'var(--green)' },
              { label: 'D', val: match.winProb.draw, color: 'var(--yellow)' },
              { label: 'A', val: match.winProb.away, color: 'var(--blue)' },
            ].map(w => (
              <div key={w.label} style={{ flex: w.val, height: 4, background: w.color, opacity: 0.7, borderRadius: 2 }} title={`${w.label}: ${w.val}%`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LeagueTable({ standings }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center" style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <span style={{ minWidth: 22, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center' }}>#</span>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginLeft: 10 }}>CLUB</span>
        {['P','W','D','L','GD','Pts'].map(h => (
          <span key={h} style={{ minWidth: 28, fontSize: 11, fontWeight: 700, textAlign: 'center', color: h === 'Pts' ? 'var(--green)' : 'var(--text-muted)' }}>{h}</span>
        ))}
      </div>
      {standings?.map((row) => (
        <div key={row?.pos || Math.random()} className="league-row" id={`table-row-${row?.pos}`}>
          <span className={`league-pos${row?.pos <= 4 ? ' text-green' : row?.pos >= 18 ? ' text-red' : ''}`}>{row?.pos || '-'}</span>
          <img src={row?.logo || ''} alt={"logo"} style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: '50%', background: 'var(--surface)', padding: 1 }} onError={e => { e.target.style.display='none'; }} />
          <span className="league-team-name">{typeof row?.team === 'object' ? row.team.name : (row?.team || 'Unknown Team')}</span>
          <span className="league-stat">{row?.played || 0}</span>
          <span className="league-stat">{row?.won || 0}</span>
          <span className="league-stat">{row?.drawn || 0}</span>
          <span className="league-stat">{row?.lost || 0}</span>
          <span className="league-stat">{row?.gd || 0}</span>
          <span className="league-pts">{row?.pts || 0}</span>
        </div>
      ))}
    </div>
  );
}

function PlayerStats({ scorers }) {
  return (
    <div>
      <div className="flex items-center gap-8 mb-12" style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>
        <span style={{ flex: 1 }}>PLAYER</span>
        <span style={{ minWidth: 40, textAlign: 'center' }}>G</span>
        <span style={{ minWidth: 40, textAlign: 'center' }}>A</span>
        <span style={{ minWidth: 40, textAlign: 'center' }}>⭐</span>
      </div>
      {scorers?.map(p => (
        <div key={p?.id || Math.random()} className="card" style={{ padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }} id={`player-${p?.id}`}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {p?.nationality || '🌍'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{typeof p?.name === 'object' ? p.name.name : (p?.name || 'Unknown')}</div>
            <div className="text-xs text-muted" style={{ marginTop: 2 }}>{typeof p?.team === 'object' ? p.team.name : (p?.team || 'Unknown Team')} · {p?.position || '-'}</div>
          </div>
          <div style={{ minWidth: 40, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 16 }}>{p?.goals || 0}</div>
            <div className="text-xs text-muted">Goals</div>
          </div>
          <div style={{ minWidth: 40, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: 16 }}>{p?.assists || 0}</div>
            <div className="text-xs text-muted">Ast</div>
          </div>
          <div style={{ minWidth: 40, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--yellow)', fontSize: 16 }}>{p?.rating || '-'}</div>
            <div className="text-xs text-muted">Rtg</div>
          </div>
        </div>
      ))}
    </div>
  );
}
