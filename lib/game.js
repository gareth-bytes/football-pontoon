// Generate a random 6-character game code
// Uses uppercase letters and numbers, avoids ambiguous chars (0/O, 1/I/L)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateGameCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

// Calculate player score from their picks and goals
export function calculateScore(picks, goals) {
  let total = 0;
  const teamGoals = {};

  for (const pick of picks) {
    const teamId = pick.team_id;
    const count = goals.filter(g => g.team_id === teamId).length;
    teamGoals[teamId] = count;
    total += count;
  }

  return {
    total,
    teamGoals,
    isBust: total > 21,
    isPontoon: total === 21,
  };
}

// Determine if a player is stuck (all 4 teams eliminated)
export function isPlayerStuck(picks, teams) {
  return picks.every(pick => {
    const team = teams.find(t => t.id === pick.team_id);
    return team?.eliminated === true;
  });
}

// Sort players for leaderboard
// 1. Non-bust players sorted by score DESC (closest to 21 wins)
// 2. Bust players sorted by bust time ASC (first to bust at bottom... but highest total = wooden spoon)
export function sortLeaderboard(playerScores) {
  const nonBust = playerScores
    .filter(p => !p.is_bust)
    .sort((a, b) => b.total_goals - a.total_goals);

  const bust = playerScores
    .filter(p => p.is_bust)
    .sort((a, b) => {
      // Sort bust players: lower total first (less bad), higher total last
      if (a.total_goals !== b.total_goals) return a.total_goals - b.total_goals;
      // Same total: earlier bust time is worse
      return new Date(a.bust_at) - new Date(b.bust_at);
    });

  return [...nonBust, ...bust];
}

// Determine wooden spoon winner (highest total, tiebreak: first to reach that score)
export function getWoodenSpoon(playerScores) {
  if (playerScores.length === 0) return null;

  const sorted = [...playerScores].sort((a, b) => {
    if (b.total_goals !== a.total_goals) return b.total_goals - a.total_goals;
    // Tiebreak: who reached this score first
    if (a.bust_at && b.bust_at) return new Date(a.bust_at) - new Date(b.bust_at);
    return 0;
  });

  return sorted[0];
}

// Determine winners (highest score ≤ 21, ties share)
export function getWinners(playerScores) {
  const eligible = playerScores.filter(p => !p.is_bust && p.total_goals <= 21);
  if (eligible.length === 0) return [];

  const maxScore = Math.max(...eligible.map(p => p.total_goals));
  return eligible.filter(p => p.total_goals === maxScore);
}

// Format countdown
export function formatCountdown(targetDate) {
  const now = new Date();
  const diff = new Date(targetDate) - now;

  if (diff <= 0) return 'Locked';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
