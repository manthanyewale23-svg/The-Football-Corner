// Career Predictor logic
import { CAREER_CLUBS, SIMILAR_PLAYERS } from '../services/mockData.js';

export function calculateCareer(formData) {
  const { age, gender, strengths, weaknesses, position } = formData;

  // Determine style score
  const styleScores = { possession: 0, pressing: 0, counter: 0, defensive: 0 };

  if (strengths.includes('speed')) {
    styleScores.counter += 2;
    styleScores.pressing += 1;
  }
  if (strengths.includes('dribbling')) {
    styleScores.possession += 2;
  }
  if (strengths.includes('passing')) {
    styleScores.possession += 2;
    styleScores.pressing += 1;
  }
  if (strengths.includes('shooting')) {
    styleScores.counter += 1;
    styleScores.pressing += 1;
  }
  if (strengths.includes('defending')) {
    styleScores.defensive += 3;
    styleScores.counter += 1;
  }
  if (strengths.includes('heading')) {
    styleScores.defensive += 2;
  }
  if (weaknesses.includes('speed')) {
    styleScores.possession += 1;
    styleScores.defensive += 1;
    styleScores.counter -= 1;
  }

  const bestStyle = Object.entries(styleScores).sort((a, b) => b[1] - a[1])[0][0];
  const matchingClubs = CAREER_CLUBS.filter(c => c.style === bestStyle);
  const club = matchingClubs[Math.floor(Math.random() * matchingClubs.length)] || CAREER_CLUBS[0];

  // Suggest similar player
  const playerKey = getSimilarPlayerKey(position, strengths);
  const similarPlayer = SIMILAR_PLAYERS[playerKey] || SIMILAR_PLAYERS.default;

  // Find ideal position
  const idealPosition = getIdealPosition(position, strengths, weaknesses);

  // Generate fun description
  const description = generateDescription(formData, club, similarPlayer, idealPosition);

  return {
    club,
    similarPlayer,
    idealPosition,
    description,
    playingStyle: bestStyle,
    potentialRating: calculatePotential(age, strengths, weaknesses),
  };
}

function getSimilarPlayerKey(position, strengths) {
  if (position === 'GK') return 'GK';
  if (position === 'CB') {
    return strengths.includes('heading') ? 'CB_aerial' : 'CB_technical';
  }
  if (position === 'LB' || position === 'RB') return 'LB';
  if (position === 'CM' || position === 'DM') {
    return strengths.includes('defending') ? 'CM_defending' : 'CM_passing';
  }
  if (position === 'CAM' || position === 'AM') return 'CM_passing';
  if (position === 'LW' || position === 'RW') {
    return strengths.includes('dribbling') ? 'LW_dribbling' : 'RW_creative';
  }
  if (position === 'ST' || position === 'CF') {
    return strengths.includes('speed') ? 'ST_fast' : 'ST_technical';
  }
  return 'default';
}

function getIdealPosition(position, strengths, weaknesses) {
  // If they already selected a specific pos, validate it
  if (position !== 'any') {
    // Slightly adjust based on strengths
    if ((position === 'ST' || position === 'CF') && strengths.includes('speed') && !strengths.includes('shooting')) {
      return 'CF (false nine)';
    }
    if (position === 'CM' && strengths.includes('defending')) return 'DM (Defensive Midfielder)';
    if (position === 'CM' && strengths.includes('dribbling')) return 'CAM (Attacking Midfielder)';
    return position;
  }
  // Auto-detect
  if (strengths.includes('defending') && strengths.includes('heading')) return 'CB (Centre-Back)';
  if (strengths.includes('passing') && strengths.includes('speed')) return 'CM/DM (Box-to-Box)';
  if (strengths.includes('dribbling') && strengths.includes('speed')) return 'LW/RW (Winger)';
  if (strengths.includes('shooting')) return 'ST (Striker)';
  return 'CM (Central Midfielder)';
}

function calculatePotential(age, strengths, weaknesses) {
  const baseRating = 70;
  const strengthBonus = Math.min(strengths.length * 3, 15);
  const weaknessPenalty = Math.min(weaknesses.length * 2, 10);
  const ageBonus = age < 20 ? 5 : age < 25 ? 3 : age < 30 ? 0 : -5;
  return Math.min(99, Math.max(50, baseRating + strengthBonus - weaknessPenalty + ageBonus));
}

function generateDescription(formData, club, player, idealPos) {
  const { age, gender } = formData;
  const pronoun = gender === 'female' ? 'her' : 'their';
  return `Based on ${pronoun} attributes at age ${age}, they would thrive as a ${idealPos} playing for a club like ${club.name}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} playing style is most reminiscent of ${player.name} — ${player.description}.`;
}
