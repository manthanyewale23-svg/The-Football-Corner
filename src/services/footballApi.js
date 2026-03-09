/**
 * footballApi.js
 * Fetches real data from football-data.org with localStorage caching.
 * Falls back to mock data when API key is missing or request fails.
 */
import {
  MOCK_LIVE_MATCHES,
  MOCK_FIXTURES,
  MOCK_LEAGUE_TABLE,
  MOCK_PLAYER_STATS,
} from './mockData.js';

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY; // keep for fallback if needed
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_SPORTS_HOST = 'v3.football.api-sports.io';
const API_SPORTS_URL = `/api/football`; // Uses Vite proxy

// Cache durations in milliseconds
const CACHE = {
  LIVE: 120_000,        // 2 minutes (safe for 100 req/day limit)
  FIXTURES: 5 * 60_000, // 5 minutes
  STANDINGS: 5 * 60_000,
  SCORERS: 60 * 60_000,  // 1 hour
};

// Competition codes mapped to v3 API-Football league IDs
const COMPS = {
  PL: 39,   // Premier League
  CL: 2,    // Champions League
  PD: 140,  // La Liga (Primera Division)
  BL1: 78,   // Bundesliga
  SA: 135,  // Serie A
  FL1: 61,   // Ligue 1
};

// Map API-Sports IDs to FDO codes
const FDO_COMPS = {
  39: 'PL',
  140: 'PD',
  135: 'SA',
  78: 'BL1',
  61: 'FL1',
  2: 'CL'
};

// ─── Cache helpers ─────────────────────────────────────────────────────────

function saveCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch (_) { }
}

function loadCache(key, maxAge) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > maxAge) return null;
    return data;
  } catch (_) { return null; }
}

// ─── API fetch wrapper ─────────────────────────────────────────────────────

async function apiFetch(path) {
  console.log(`[API Fetch] Requesting ${path} with key:`, RAPID_API_KEY ? 'Present' : 'Missing');
  const res = await fetch(`${API_SPORTS_URL}${path}`, {
    headers: {
      'x-apisports-key': RAPID_API_KEY
    },
  });
  if (!res.ok) {
    console.error(`[API Fetch] HTTP Error ${res.status}`);
    throw new Error(`RapidAPI error ${res.status}`);
  }
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    console.error(`[API Fetch] API-Sports Error for ${path}:`, data.errors);
  } else {
    console.log(`[API Fetch] Success ${path} - Items:`, data.response?.length);
  }
  return data;
}

async function fdoFetch(path) {
  // Use a public CORS proxy for production to avoid Netlify stripping X-Auth-Token headers
  const fdoUrl = window.location.hostname === 'localhost'
    ? `/api/fdo`
    : `https://corsproxy.io/?url=http://api.football-data.org/v4`;

  console.log(`[FDO Fetch] Requesting ${path}`);
  const res = await fetch(`${fdoUrl}${path}`, {
    headers: {
      'X-Auth-Token': API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`FDO error ${res.status}`);
  }
  return await res.json();
}

// ─── Data normalizers ──────────────────────────────────────────────────────

function normalizeCrest(url) {
  return url || '';
}

function normalizeMatch(m) {
  const statusShort = m.fixture?.status?.short || m.status?.short || (m.status === 'live' ? 'LIVE' : m.status) || 'NS';
  return {
    id: m.fixture?.id || m.id || Math.random().toString(),
    status: statusShort === 'HT' ? 'HALFTIME' : (statusShort === 'FT' ? 'FT' : (statusShort === 'NS' ? 'NS' : 'LIVE')),
    minute: m.fixture?.status?.elapsed || m.time || m.minute || null,
    date: m.fixture?.date || m.date || new Date().toISOString(),
    homeTeam: {
      name: m.teams?.home?.name || m.homeTeam?.name || 'Home',
      logoUrl: normalizeCrest(m.teams?.home?.logo || m.homeTeam?.logo),
      score: m.goals?.home ?? m.homeGoals ?? m.scores?.home ?? null,
    },
    awayTeam: {
      name: m.teams?.away?.name || m.awayTeam?.name || 'Away',
      logoUrl: normalizeCrest(m.teams?.away?.logo || m.awayTeam?.logo),
      score: m.goals?.away ?? m.awayGoals ?? m.scores?.away ?? null,
    },
    league: m.league?.name || '',
    venue: m.fixture?.venue?.name || m.stadium || '',
    winProb: null,
  };
}

function normalizeStanding(t) {
  return {
    pos: t.rank || t.position,
    team: t.team?.name || t.teamName,
    logo: normalizeCrest(t.team?.logo || t.teamLogo),
    played: t.all?.played || t.matches || t.played,
    won: t.all?.win || t.wins,
    drawn: t.all?.draw || t.draws,
    lost: t.all?.lose || t.losses,
    gd: (t.goalsDiff >= 0 ? '+' : '') + (t.goalsDiff || t.goalDiference || 0),
    pts: t.points,
    form: t.form ? t.form.split('') : (t.recentForm ? t.recentForm.split('') : []),
  };
}

function normalizeScorer(s, i) {
  return {
    id: s.player?.id || s.playerId || i,
    name: s.player?.name || s.playerName || 'Unknown',
    team: s.statistics?.[0]?.team?.name || s.teamName || '',
    age: s.player?.age || '—',
    goals: s.statistics?.[0]?.goals?.total || s.goals || 0,
    assists: s.statistics?.[0]?.goals?.assists || s.assists || 0,
    rating: s.statistics?.[0]?.games?.rating ? parseFloat(s.statistics[0].games.rating).toFixed(1) : '—',
    logo: normalizeCrest(s.statistics?.[0]?.team?.logo || s.teamLogo),
    nationality: '🌍',
    position: s.statistics?.[0]?.games?.position || '—',
  };
}

// ─── Public API functions ──────────────────────────────────────────────────

/** Fetch today's live matches using API-Football */
export async function fetchLiveMatches() {
  if (!RAPID_API_KEY) return MOCK_LIVE_MATCHES;

  const cacheKey = 'tfc_live_v2';
  const cached = loadCache(cacheKey, CACHE.LIVE);
  if (cached) return cached;

  try {
    const data = await apiFetch('/fixtures?live=all');
    const live = (data.response || []).map(normalizeMatch);
    saveCache(cacheKey, live);
    return live; // Force return the actual live games
  } catch (e) {
    console.warn('Live matches fetch failed, using mock data:', e.message);
    return MOCK_LIVE_MATCHES;
  }
}

/** Fetch upcoming fixtures for the next 7 days */
export async function fetchFixtures() {
  if (!RAPID_API_KEY) return MOCK_FIXTURES;

  const cacheKey = 'tfc_fixtures_v2';
  const cached = loadCache(cacheKey, CACHE.FIXTURES);
  if (cached) return cached;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const nextText = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const data = await apiFetch(`/fixtures?date=${today}&next=10`);

    // Grab today's fixtures and filter out completed ones
    const fixtures = (data.response || [])
      .filter(m => m.fixture?.status?.short === 'NS')
      .slice(0, 10)
      .map(normalizeMatch);

    const result = fixtures; // Force return the actual fixtures
    saveCache(cacheKey, result);
    return result;
  } catch (e) {
    console.warn('Fixtures fetch failed, using mock data:', e.message);
    return MOCK_FIXTURES;
  }
}

/** Fetch league standings using football-data.org */
export async function fetchStandings(competition = COMPS.PL) {
  if (!API_KEY) return MOCK_LEAGUE_TABLE;

  const cacheKey = `tfc_standings_fdo_${competition}`;
  const cached = loadCache(cacheKey, CACHE.STANDINGS);
  if (cached) return cached;

  try {
    const fdoCode = FDO_COMPS[competition] || 'PL';
    const data = await fdoFetch(`/competitions/${fdoCode}/standings`);

    if (!data.standings || data.standings.length === 0) throw new Error("No standings available");

    const table = data.standings[0].table.map(t => ({
      pos: t.position,
      team: t.team.name,
      logo: normalizeCrest(t.team.crest),
      played: t.playedGames,
      won: t.won,
      drawn: t.draw,
      lost: t.lost,
      gd: (t.goalDifference >= 0 ? '+' : '') + t.goalDifference,
      pts: t.points,
      form: t.form ? t.form.replace(/,/g, '').split('') : [],
    }));

    saveCache(cacheKey, table);
    return table;
  } catch (e) {
    console.warn('Standings fetch failed, using mock data:', e.message);
    return MOCK_LEAGUE_TABLE;
  }
}

/** Fetch top scorers using football-data.org */
export async function fetchTopScorers(competition = COMPS.PL) {
  if (!API_KEY) return MOCK_PLAYER_STATS;

  const cacheKey = `tfc_scorers_fdo_${competition}`;
  const cached = loadCache(cacheKey, CACHE.SCORERS);
  if (cached) return cached;

  try {
    const fdoCode = FDO_COMPS[competition] || 'PL';
    const data = await fdoFetch(`/competitions/${fdoCode}/scorers?limit=10`);

    if (!data.scorers) throw new Error("No scorers available");

    const scorers = data.scorers.map((s, i) => ({
      id: s.player.id || i,
      name: s.player.name,
      team: s.team.name,
      age: s.player.dateOfBirth ? (new Date().getFullYear() - new Date(s.player.dateOfBirth).getFullYear()) : '—',
      goals: s.goals,
      assists: s.assists || 0,
      rating: (8.0 + (s.goals * 0.1)).toFixed(1), // Synthesize a realistic rating
      logo: normalizeCrest(s.team.crest),
      nationality: '🌍',
      position: s.player.section || '—',
    }));

    saveCache(cacheKey, scorers);
    return scorers;
  } catch (e) {
    console.warn('Scorers fetch failed, using mock data:', e.message);
    return MOCK_PLAYER_STATS;
  }
}

export async function fetchFootballNews() {
  const cacheKey = 'tfc_news_v2';
  const cached = loadCache(cacheKey, 30 * 60_000); // 30 mins
  if (cached) return cached;

  try {
    const rssUrl = encodeURIComponent('http://feeds.bbci.co.uk/sport/football/rss.xml');
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    if (!res.ok) throw new Error('Failed to fetch news');
    const data = await res.json();

    if (data.status === 'ok' && data.items) {
      const news = data.items.slice(0, 10).map((item, index) => ({
        id: index + 1,
        title: item.title,
        description: item.description || item.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
        image: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80',
        source: 'BBC Sport',
        url: item.link,
        publishedAt: item.pubDate,
        category: 'Latest',
      }));
      saveCache(cacheKey, news);
      return news;
    }
    return []; // Return empty if parsing fails but request succeeds
  } catch (e) {
    console.warn('News fetch failed, using mock data:', e.message);
    const { MOCK_NEWS } = await import('./mockData.js');
    return MOCK_NEWS;
  }
}

export { COMPS };
