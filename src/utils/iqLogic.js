// IQ Points calculation logic

export const IQ_RULES = {
  CORRECT_EXACT_SCORE: 25,   // Got exact scoreline right
  CORRECT_OUTCOME: 10,        // Got H/D/A right, wrong score
  WRONG_OUTCOME: -3,          // Got nothing right
  MIN_IQ: 0,
};

export function evaluatePrediction(prediction, actualResult) {
  const { homeScore: predH, awayScore: predA } = prediction;
  const { homeScore: actH, awayScore: actA } = actualResult;

  const predOutcome = predH > predA ? 'H' : predH < predA ? 'A' : 'D';
  const actOutcome = actH > actA ? 'H' : actH < actA ? 'A' : 'D';

  if (predH === actH && predA === actA) {
    return { points: IQ_RULES.CORRECT_EXACT_SCORE, result: 'exact', label: 'Perfect Score!' };
  } else if (predOutcome === actOutcome) {
    return { points: IQ_RULES.CORRECT_OUTCOME, result: 'correct', label: 'Correct Result' };
  } else {
    return { points: IQ_RULES.WRONG_OUTCOME, result: 'wrong', label: 'Wrong Prediction' };
  }
}

export function getIQLevel(score) {
  if (score >= 3000) return { level: 'Elite Analyst', color: '#ffd700', emoji: '👑' };
  if (score >= 2000) return { level: 'Football Genius', color: '#1de9b6', emoji: '🧠' };
  if (score >= 1500) return { level: 'Tactical Expert', color: '#3d8ef8', emoji: '🎯' };
  if (score >= 1000) return { level: 'Match Predictor', color: '#00c853', emoji: '⚽' };
  if (score >= 500)  return { level: 'Amateur Analyst', color: '#ffcb2b', emoji: '📊' };
  return { level: 'Football Rookie', color: '#94a3b8', emoji: '🌱' };
}

export function newIQScore(currentScore, pointsDelta) {
  return Math.max(IQ_RULES.MIN_IQ, currentScore + pointsDelta);
}
