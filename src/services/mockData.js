// Mock data for the football app
// Replace API calls with real API keys when ready

export const MOCK_LIVE_MATCHES = [
  {
    id: 1,
    status: 'LIVE',
    minute: 67,
    homeTeam: { name: 'Manchester City', logoUrl: 'https://media.api-sports.io/football/teams/50.png', score: 2 },
    awayTeam: { name: 'Arsenal', logoUrl: 'https://media.api-sports.io/football/teams/42.png', score: 1 },
    league: 'Premier League',
    venue: 'Etihad Stadium',
    winProb: { home: 65, draw: 20, away: 15 },
    stats: {
      possession: { home: 62, away: 38 },
      shots: { home: 14, away: 7 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 8, away: 4 },
      fouls: { home: 9, away: 13 },
      yellowCards: { home: 1, away: 2 },
      saves: { home: 2, away: 5 },
    },
    homeLineup: ['Ederson', 'Walker', 'Dias', 'Akanji', 'Gvardiol', 'Rodri', 'De Bruyne', 'Silva', 'Doku', 'Foden', 'Haaland'],
    awayLineup: ['Raya', 'Ben White', 'Saliba', 'Gabriel', 'Timber', 'Partey', 'Rice', 'Ødegaard', 'Saka', 'Havertz', 'Martinelli'],
  },
  {
    id: 2,
    status: 'LIVE',
    minute: 23,
    homeTeam: { name: 'Real Madrid', logoUrl: 'https://media.api-sports.io/football/teams/541.png', score: 0 },
    awayTeam: { name: 'Barcelona', logoUrl: 'https://media.api-sports.io/football/teams/529.png', score: 0 },
    league: 'La Liga',
    venue: 'Santiago Bernabéu',
    winProb: { home: 42, draw: 28, away: 30 },
    stats: {
      possession: { home: 44, away: 56 },
      shots: { home: 4, away: 7 },
      shotsOnTarget: { home: 1, away: 3 },
      corners: { home: 2, away: 5 },
      fouls: { home: 6, away: 5 },
      yellowCards: { home: 0, away: 1 },
      saves: { home: 2, away: 0 },
    },
    homeLineup: ['Courtois', 'Carvajal', 'Militão', 'Rüdiger', 'Mendy', 'Camavinga', 'Tchouaméni', 'Valverde', 'Bellingham', 'Vini Jr', 'Mbappé'],
    awayLineup: ['Ter Stegen', 'Koundé', 'Araujo', 'Christensen', 'Balde', 'Casado', 'De Jong', 'Pedri', 'Yamal', 'Lewandowski', 'Raphinha'],
  }
];

export const MOCK_FIXTURES = [
  {
    id: 101,
    status: 'NS',
    date: '2026-03-08T15:00:00Z',
    homeTeam: { name: 'Liverpool', logoUrl: 'https://media.api-sports.io/football/teams/40.png' },
    awayTeam: { name: 'Chelsea', logoUrl: 'https://media.api-sports.io/football/teams/49.png' },
    league: 'Premier League',
    venue: 'Anfield',
    winProb: { home: 55, draw: 22, away: 23 },
  },
  {
    id: 102,
    status: 'NS',
    date: '2026-03-08T17:30:00Z',
    homeTeam: { name: 'Bayern Munich', logoUrl: 'https://media.api-sports.io/football/teams/157.png' },
    awayTeam: { name: 'Dortmund', logoUrl: 'https://media.api-sports.io/football/teams/165.png' },
    league: 'Bundesliga',
    venue: 'Allianz Arena',
    winProb: { home: 58, draw: 20, away: 22 },
  },
  {
    id: 103,
    status: 'NS',
    date: '2026-03-09T20:00:00Z',
    homeTeam: { name: 'PSG', logoUrl: 'https://media.api-sports.io/football/teams/85.png' },
    awayTeam: { name: 'Marseille', logoUrl: 'https://media.api-sports.io/football/teams/81.png' },
    league: 'Ligue 1',
    venue: 'Parc des Princes',
    winProb: { home: 68, draw: 18, away: 14 },
  },
  {
    id: 104,
    status: 'FT',
    date: '2026-03-06T20:00:00Z',
    homeTeam: { name: 'Juventus', logoUrl: 'https://media.api-sports.io/football/teams/496.png', score: 2 },
    awayTeam: { name: 'Inter Milan', logoUrl: 'https://media.api-sports.io/football/teams/505.png', score: 2 },
    league: 'Serie A',
    venue: 'Allianz Stadium',
    winProb: { home: 38, draw: 25, away: 37 },
  },
];

export const MOCK_LEAGUE_TABLE = [
  { pos: 1, team: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png', played: 28, won: 21, drawn: 4, lost: 3, gd: '+38', pts: 67, form: ['W','W','D','W','W'] },
  { pos: 2, team: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png', played: 28, won: 19, drawn: 5, lost: 4, gd: '+29', pts: 62, form: ['W','D','W','L','W'] },
  { pos: 3, team: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png', played: 28, won: 18, drawn: 5, lost: 5, gd: '+27', pts: 59, form: ['W','W','W','D','L'] },
  { pos: 4, team: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', played: 28, won: 16, drawn: 5, lost: 7, gd: '+15', pts: 53, form: ['L','W','W','D','W'] },
  { pos: 5, team: 'Aston Villa', logo: 'https://media.api-sports.io/football/teams/66.png', played: 28, won: 14, drawn: 6, lost: 8, gd: '+8', pts: 48, form: ['W','D','W','L','D'] },
  { pos: 6, team: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png', played: 28, won: 13, drawn: 5, lost: 10, gd: '+2', pts: 44, form: ['D','W','L','W','L'] },
  { pos: 7, team: 'Newcastle', logo: 'https://media.api-sports.io/football/teams/34.png', played: 28, won: 12, drawn: 7, lost: 9, gd: '+4', pts: 43, form: ['W','W','D','D','L'] },
  { pos: 8, team: 'Manchester Utd', logo: 'https://media.api-sports.io/football/teams/33.png', played: 28, won: 11, drawn: 6, lost: 11, gd: '-5', pts: 39, form: ['L','D','W','L','W'] },
];

export const MOCK_PLAYER_STATS = [
  { id: 1, name: 'Erling Haaland', team: 'Manchester City', age: 25, goals: 24, assists: 6, rating: 8.4, logo: 'https://media.api-sports.io/football/teams/50.png', nationality: '🇳🇴', position: 'ST' },
  { id: 2, name: 'Mohamed Salah', team: 'Liverpool', age: 33, goals: 21, assists: 13, rating: 8.6, logo: 'https://media.api-sports.io/football/teams/40.png', nationality: '🇪🇬', position: 'RW' },
  { id: 3, name: 'Bukayo Saka', team: 'Arsenal', age: 24, goals: 16, assists: 12, rating: 8.3, logo: 'https://media.api-sports.io/football/teams/42.png', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'RW' },
  { id: 4, name: 'Kylian Mbappé', team: 'Real Madrid', age: 27, goals: 28, assists: 8, rating: 8.7, logo: 'https://media.api-sports.io/football/teams/541.png', nationality: '🇫🇷', position: 'CF' },
  { id: 5, name: 'Vinicius Jr.', team: 'Real Madrid', age: 25, goals: 20, assists: 14, rating: 8.5, logo: 'https://media.api-sports.io/football/teams/541.png', nationality: '🇧🇷', position: 'LW' },
];

export const MOCK_NEWS = [
  {
    id: 1,
    title: 'Haaland Scores Hat-Trick as City Cruise Past Bayern in Champions League',
    description: 'Erling Haaland delivered another masterclass performance at the Etihad, netting a stunning hat-trick to put Manchester City in command of their Champions League quarter-final tie.',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80',
    source: 'BBC Sport',
    url: 'https://bbc.com/sport',
    publishedAt: '2026-03-07T06:30:00Z',
    category: 'Champions League',
  },
  {
    id: 2,
    title: 'El Clásico Preview: Can Barcelona End Real Madrid\'s Unbeaten Run at Bernabéu?',
    description: 'Sunday\'s El Clásico promises to be a blockbuster as Barcelona head to the Bernabéu looking to overturn Real Madrid\'s perfect home record this season.',
    image: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=600&q=80',
    source: 'ESPN',
    url: 'https://espn.com',
    publishedAt: '2026-03-07T04:00:00Z',
    category: 'La Liga',
  },
  {
    id: 3,
    title: 'Liverpool Continue Title Charge with Dominant Win Over Everton',
    description: "Mohamed Salah was once again the difference-maker as Liverpool romped to a 4-0 victory in the Merseyside derby, extending their lead at the top of the Premier League.",
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
    source: 'Sky Sports',
    url: 'https://skysports.com',
    publishedAt: '2026-03-06T22:00:00Z',
    category: 'Premier League',
  },
  {
    id: 4,
    title: 'Brazil Name Vinicius Jr. as New Captain Ahead of 2026 World Cup Qualifiers',
    description: 'The Brazilian football federation has confirmed that Real Madrid winger Vinicius Jr. will wear the captain\'s armband for the upcoming World Cup qualifying campaign.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80',
    source: 'Marca',
    url: 'https://marca.com',
    publishedAt: '2026-03-06T18:00:00Z',
    category: 'International',
  },
  {
    id: 5,
    title: 'Transfer Window: PSG Eye Surprise Move for Premier League Star',
    description: 'Paris Saint-Germain are reportedly planning a summer move for a high-profile Premier League forward, with initial contact already made with the player\'s representatives.',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80',
    source: 'L\'Équipe',
    url: 'https://lequipe.fr',
    publishedAt: '2026-03-06T14:00:00Z',
    category: 'Transfers',
  },
];

export const MOCK_LEADERBOARD = [
  { uid: 'u1', rank: 1, username: 'TacticMaster', photoURL: '', iqScore: 2840, predictions: 142, accuracy: 71 },
  { uid: 'u2', rank: 2, username: 'GoalGuru99', photoURL: '', iqScore: 2615, predictions: 130, accuracy: 68 },
  { uid: 'u3', rank: 3, username: 'PitchProphет', photoURL: '', iqScore: 2490, predictions: 125, accuracy: 67 },
  { uid: 'u4', rank: 4, username: 'xGWizard', photoURL: '', iqScore: 2310, predictions: 118, accuracy: 65 },
  { uid: 'u5', rank: 5, username: 'FootballOracle', photoURL: '', iqScore: 2255, predictions: 111, accuracy: 64 },
  { uid: 'u6', rank: 6, username: 'PressingMachine', photoURL: '', iqScore: 2100, predictions: 107, accuracy: 62 },
  { uid: 'u7', rank: 7, username: 'DNAFan2024', photoURL: '', iqScore: 1990, predictions: 99, accuracy: 60 },
  { uid: 'u8', rank: 8, username: 'BackHeel_King', photoURL: '', iqScore: 1875, predictions: 94, accuracy: 59 },
  { uid: 'u9', rank: 9, username: 'SweepCleaner', photoURL: '', iqScore: 1740, predictions: 88, accuracy: 57 },
  { uid: 'u10', rank: 10, username: 'TifoManiac', photoURL: '', iqScore: 1620, predictions: 82, accuracy: 55 },
];

export const CAREER_CLUBS = [
  { name: 'Manchester City', style: 'possession', league: 'PL', logo: 'https://media.api-sports.io/football/teams/50.png' },
  { name: 'Arsenal', style: 'pressing', league: 'PL', logo: 'https://media.api-sports.io/football/teams/42.png' },
  { name: 'Real Madrid', style: 'counter', league: 'LL', logo: 'https://media.api-sports.io/football/teams/541.png' },
  { name: 'Barcelona', style: 'possession', league: 'LL', logo: 'https://media.api-sports.io/football/teams/529.png' },
  { name: 'Bayern Munich', style: 'pressing', league: 'BL', logo: 'https://media.api-sports.io/football/teams/157.png' },
  { name: 'Liverpool', style: 'pressing', league: 'PL', logo: 'https://media.api-sports.io/football/teams/40.png' },
  { name: 'PSG', style: 'counter', league: 'L1', logo: 'https://media.api-sports.io/football/teams/85.png' },
  { name: 'Juventus', style: 'defensive', league: 'SA', logo: 'https://media.api-sports.io/football/teams/496.png' },
  { name: 'Inter Milan', style: 'counter', league: 'SA', logo: 'https://media.api-sports.io/football/teams/505.png' },
  { name: 'Atletico Madrid', style: 'defensive', league: 'LL', logo: 'https://media.api-sports.io/football/teams/530.png' },
];

export const SIMILAR_PLAYERS = {
  ST_fast: { name: 'Erling Haaland', description: 'Pure goalscorer, devastating in the box', nationality: '🇳🇴' },
  ST_technical: { name: 'Robert Lewandowski', description: 'Clinical finisher with superb technique', nationality: '🇵🇱' },
  LW_dribbling: { name: 'Vinicius Jr.', description: 'Explosive pace and magical dribbling', nationality: '🇧🇷' },
  RW_creative: { name: 'Bukayo Saka', description: 'Versatile, creative and consistent', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  CM_passing: { name: 'Kevin De Bruyne', description: 'Visionary passer and match controller', nationality: '🇧🇪' },
  CM_defending: { name: 'Rodri', description: 'Defensive midfielder, engine of the team', nationality: '🇪🇸' },
  CB_aerial: { name: 'Virgil van Dijk', description: 'Commanding in the air, great leader', nationality: '🇳🇱' },
  CB_technical: { name: 'Rúben Dias', description: 'Ball-playing CB, intense and focused', nationality: '🇵🇹' },
  GK: { name: 'Thibaut Courtois', description: 'Shot-stopper with incredible reflexes', nationality: '🇧🇪' },
  LB: { name: 'Theo Hernandez', description: 'Marauding full-back with pace and power', nationality: '🇫🇷' },
  default: { name: 'Luka Modric', description: 'Elegant and intelligent, a true maestro', nationality: '🇭🇷' },
};

export const MOCK_TRIVIA_QUESTIONS = [
  { id: 1, question: 'Who won the 2023 Ballon d\'Or?', options: ['Kylian Mbappé', 'Lionel Messi', 'Erling Haaland', 'Vinicius Jr.'], correctIndex: 1 },
  { id: 2, question: 'Which club has won the most UEFA Champions League titles?', options: ['Barcelona', 'Bayern Munich', 'Real Madrid', 'Liverpool'], correctIndex: 2 },
  { id: 3, question: 'How many players are on each side in a standard football match?', options: ['10', '11', '12', '9'], correctIndex: 1 },
  { id: 4, question: 'Which country won the FIFA World Cup 2022?', options: ['France', 'Brazil', 'Argentina', 'Portugal'], correctIndex: 2 },
  { id: 5, question: 'Erling Haaland plays for which Premier League club?', options: ['Chelsea', 'Manchester United', 'Arsenal', 'Manchester City'], correctIndex: 3 },
  { id: 6, question: 'What does "VAR" stand for in football?', options: ['Video Assistant Referee', 'Vertical Action Replay', 'Video Analysis Review', 'Virtual Action Rule'], correctIndex: 0 },
  { id: 7, question: 'Which stadium is home to Real Madrid?', options: ['Camp Nou', 'Allianz Arena', 'Santiago Bernabéu', 'Old Trafford'], correctIndex: 2 },
  { id: 8, question: 'Who is the all-time top scorer in the UEFA Champions League?', options: ['Lionel Messi', 'Cristiano Ronaldo', 'Robert Lewandowski', 'Raúl'], correctIndex: 1 },
  { id: 9, question: 'In which year was the Premier League founded?', options: ['1985', '1992', '1988', '1996'], correctIndex: 1 },
  { id: 10, question: 'Which country hosted the 2018 FIFA World Cup?', options: ['Qatar', 'Brazil', 'Germany', 'Russia'], correctIndex: 3 },
  { id: 11, question: 'What colour card results in a player being sent off?', options: ['Yellow', 'Orange', 'Red', 'Blue'], correctIndex: 2 },
  { id: 12, question: 'Which player is known as "The Egyptian King"?', options: ['Sadio Mané', 'Mohamed Salah', 'Riyad Mahrez', 'Ahmed Musa'], correctIndex: 1 },
  { id: 13, question: 'How long is a standard football match (excluding extra time)?', options: ['80 minutes', '100 minutes', '90 minutes', '85 minutes'], correctIndex: 2 },
  { id: 14, question: 'Which club did Kylian Mbappé join from Paris Saint-Germain?', options: ['Barcelona', 'Chelsea', 'Real Madrid', 'Bayern Munich'], correctIndex: 2 },
  { id: 15, question: 'What is the maximum number of substitutions allowed in modern football?', options: ['3', '4', '5', '6'], correctIndex: 2 },
];

export const MOCK_WEEKLY_LEADERBOARD = [
  { uid: 'u3', rank: 1, username: 'xGWizard', photoURL: '', iqScore: 480, predictions: 18, accuracy: 78 },
  { uid: 'u7', rank: 2, username: 'DNAFan2024', photoURL: '', iqScore: 410, predictions: 16, accuracy: 75 },
  { uid: 'u1', rank: 3, username: 'TacticMaster', photoURL: '', iqScore: 375, predictions: 15, accuracy: 73 },
  { uid: 'u5', rank: 4, username: 'FootballOracle', photoURL: '', iqScore: 320, predictions: 14, accuracy: 71 },
  { uid: 'u2', rank: 5, username: 'GoalGuru99', photoURL: '', iqScore: 290, predictions: 13, accuracy: 69 },
  { uid: 'u9', rank: 6, username: 'SweepCleaner', photoURL: '', iqScore: 255, predictions: 12, accuracy: 67 },
  { uid: 'u4', rank: 7, username: 'xGWizard', photoURL: '', iqScore: 220, predictions: 11, accuracy: 64 },
  { uid: 'u8', rank: 8, username: 'BackHeel_King', photoURL: '', iqScore: 195, predictions: 10, accuracy: 60 },
];

