// Football DNA Profile (FDP) logic

const FDP_TYPES = {
  ATTACKING_MIND: {
    id: 'ATTACKING_MIND',
    name: 'Attacking Mind',
    emoji: '⚡',
    description: 'You live for goals, chaos, and end-to-end action. Attack is always the best policy.',
    color: '#ff6d00',
    traits: ['High-scoring games lover', 'Backs strikers & tricky wingers', 'Counter-attack enthusiast'],
  },
  TACTICAL_ANALYST: {
    id: 'TACTICAL_ANALYST',
    name: 'Tactical Analyst',
    emoji: '🧠',
    description: 'You see the game like a coach. Formations, pressing lines, and half-time adjustments excite you.',
    color: '#3d8ef8',
    traits: ['Formation nerd', 'Appreciates pressing & structure', 'Values intelligence over flair'],
  },
  COUNTER_EXPERT: {
    id: 'COUNTER_EXPERT',
    name: 'Counter Attack Expert',
    emoji: '🏹',
    description: 'Sit deep, absorb pressure, hit them on the break. You love the art of the perfect counter.',
    color: '#ff5722',
    traits: ['Loves compact defensive lines', 'Fast transition enthusiast', 'Fan of low-block masterclasses'],
  },
  CREATIVE_PLAYMAKER: {
    id: 'CREATIVE_PLAYMAKER',
    name: 'Creative Playmaker Fan',
    emoji: '🎨',
    description: 'Skill, flair, and creativity define your football DNA. Magic dribbles and through-balls are your currency.',
    color: '#9c27b0',
    traits: ['Loves tricky #10s', 'Values assists over goals', 'Appreciates audacious skill moves'],
  },
  DEFENSIVE_WALL: {
    id: 'DEFENSIVE_WALL',
    name: 'Defensive Wall',
    emoji: '🧱',
    description: 'A 1-0 win with a clean sheet? Pure bliss. You appreciate the defensive arts and organization.',
    color: '#607d8b',
    traits: ['Clean sheet obsessive', 'Rates centre-backs highly', 'Loves sweeper-keepers'],
  },
  PRESSING_MACHINE: {
    id: 'PRESSING_MACHINE',
    name: 'Pressing Machine',
    emoji: '🔥',
    description: 'Intensity, energy, and relentless pressing. You want your team to hunt the ball constantly.',
    color: '#f44336',
    traits: ['High-press fanatic', 'Loves stamina kings', 'Values work rate above all'],
  },
  SET_PIECE_SPECIALIST: {
    id: 'SET_PIECE_SPECIALIST',
    name: 'Set Piece Specialist',
    emoji: '📐',
    description: 'Corner routines, free kick curlers, and penalty drama. The dead-ball game is where you shine.',
    color: '#ffcb2b',
    traits: ['Loves dead-ball situations', 'Appreciates game management', 'Tactical foul awareness'],
  },
  TOTAL_FOOTBALL: {
    id: 'TOTAL_FOOTBALL',
    name: 'Total Football Thinker',
    emoji: '🔮',
    description: 'Fluid positions, rotating players, collective genius. Cruyff-style total football is your religion.',
    color: '#1de9b6',
    traits: ['Positional play lover', 'Values versatile players', 'Appreciates collective movement'],
  },
};

export const FDP_QUESTIONS = [
  {
    id: 1,
    question: 'Your team is winning 1-0 in the 80th minute. What should they do?',
    options: [
      { text: 'Keep attacking — score more!', scores: { ATTACKING_MIND: 3, PRESSING_MACHINE: 2 } },
      { text: 'Hold shape, defend the lead', scores: { DEFENSIVE_WALL: 3, COUNTER_EXPERT: 2 } },
      { text: 'Press high and suffocate them', scores: { PRESSING_MACHINE: 3, TACTICAL_ANALYST: 1 } },
      { text: 'Control possession calmly', scores: { TOTAL_FOOTBALL: 3, TACTICAL_ANALYST: 2 } },
    ],
  },
  {
    id: 2,
    question: 'Which type of goal excites you the most?',
    options: [
      { text: '25-yard rocket into the top corner', scores: { ATTACKING_MIND: 3, CREATIVE_PLAYMAKER: 2 } },
      { text: 'Perfectly worked team goal with 15 passes', scores: { TOTAL_FOOTBALL: 3, TACTICAL_ANALYST: 2 } },
      { text: 'Lightning counter-attack in 4 seconds', scores: { COUNTER_EXPERT: 3, ATTACKING_MIND: 2 } },
      { text: 'Curling free kick into the net', scores: { SET_PIECE_SPECIALIST: 3, CREATIVE_PLAYMAKER: 2 } },
    ],
  },
  {
    id: 3,
    question: 'Which football legend fascinates you most?',
    options: [
      { text: 'Ronaldo — pure goals machine', scores: { ATTACKING_MIND: 3 } },
      { text: 'Messi — genius and creativity', scores: { CREATIVE_PLAYMAKER: 3, TOTAL_FOOTBALL: 1 } },
      { text: 'Klopp / Guardiola — brilliant managers', scores: { TACTICAL_ANALYST: 3, PRESSING_MACHINE: 2 } },
      { text: 'Maldini / Beckenbauer — defensive artists', scores: { DEFENSIVE_WALL: 3, TACTICAL_ANALYST: 1 } },
    ],
  },
  {
    id: 4,
    question: 'What would you build your team around?',
    options: [
      { text: 'A deadly striker partnership', scores: { ATTACKING_MIND: 3 } },
      { text: 'A rock-solid defensive block', scores: { DEFENSIVE_WALL: 3, COUNTER_EXPERT: 2 } },
      { text: 'A creative #10 / playmaker', scores: { CREATIVE_PLAYMAKER: 3, TOTAL_FOOTBALL: 1 } },
      { text: 'A high-energy pressing system', scores: { PRESSING_MACHINE: 3, TACTICAL_ANALYST: 2 } },
    ],
  },
  {
    id: 5,
    question: 'Your preferred match result?',
    options: [
      { text: '5-4 thriller!', scores: { ATTACKING_MIND: 3 } },
      { text: '1-0 through defensive masterclass', scores: { DEFENSIVE_WALL: 3, COUNTER_EXPERT: 2 } },
      { text: '3-0 with complete team performance', scores: { PRESSING_MACHINE: 2, TOTAL_FOOTBALL: 3 } },
      { text: '2-1 with a late set piece winner', scores: { SET_PIECE_SPECIALIST: 3 } },
    ],
  },
  {
    id: 6,
    question: 'How do you watch football?',
    options: [
      { text: 'Eyes glued to the striker at all times', scores: { ATTACKING_MIND: 3 } },
      { text: 'Analyzing off-the-ball movement and shape', scores: { TACTICAL_ANALYST: 3, TOTAL_FOOTBALL: 2 } },
      { text: 'Tracking pressing triggers and defensive lines', scores: { PRESSING_MACHINE: 3, TACTICAL_ANALYST: 2 } },
      { text: 'Appreciating individual creativity and dribbles', scores: { CREATIVE_PLAYMAKER: 3 } },
    ],
  },
  {
    id: 7,
    question: 'Your ideal transfer window would bring?',
    options: [
      { text: 'A 30-goal-a-season striker', scores: { ATTACKING_MIND: 3 } },
      { text: 'A dominant, aerial centre-back', scores: { DEFENSIVE_WALL: 3 } },
      { text: 'A pacy box-to-box midfielder', scores: { PRESSING_MACHINE: 3, ATTACKING_MIND: 1 } },
      { text: 'A technically gifted playmaker', scores: { CREATIVE_PLAYMAKER: 3, TOTAL_FOOTBALL: 2 } },
    ],
  },
  {
    id: 8,
    question: 'Which tactical style do you prefer?',
    options: [
      { text: '4-3-3 with inverted wingers', scores: { ATTACKING_MIND: 2, TOTAL_FOOTBALL: 3 } },
      { text: '5-4-1 solid defensive block', scores: { DEFENSIVE_WALL: 3, COUNTER_EXPERT: 2 } },
      { text: '4-2-3-1 with a holding midfielder', scores: { TACTICAL_ANALYST: 3, SET_PIECE_SPECIALIST: 1 } },
      { text: '4-1-4-1 high intensity pressing', scores: { PRESSING_MACHINE: 3, TACTICAL_ANALYST: 2 } },
    ],
  },
];

export function calculateFDP(answers) {
  const scores = {};
  
  Object.keys(FDP_TYPES).forEach(key => { scores[key] = 0; });

  answers.forEach(({ questionId, optionIndex }) => {
    const question = FDP_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;
    const option = question.options[optionIndex];
    if (!option) return;
    Object.entries(option.scores).forEach(([type, pts]) => {
      if (scores[type] !== undefined) scores[type] += pts;
    });
  });

  const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return FDP_TYPES[topType];
}

export { FDP_TYPES };
