interface ScoreInput {
  total_followers: number;
  instagram_followers: number;
  tiktok_followers: number;
  youtube_followers: number;
  twitter_followers: number;
  country: string;
  profession: string;
  project_phase: string;
  priority: string;
}

const PRIORITY_MARKETS = ['DE', 'AT', 'HU', 'CZ', 'PL', 'SK'];
const HIGH_VALUE_PROFESSIONS = ['singer', 'actress', 'athlete', 'model', 'tv_host'];

export function calculateRelevanceScore(input: ScoreInput): number {
  let score = 0;

  // Followers (30%) - log scale normalized to 0-30
  if (input.total_followers > 0) {
    const logFollowers = Math.log10(input.total_followers);
    const normalized = Math.min(logFollowers / 7, 1); // 10M = 7 on log scale
    score += normalized * 30;
  }

  // Platform diversity (10%)
  const platforms = [
    input.instagram_followers,
    input.tiktok_followers,
    input.youtube_followers,
    input.twitter_followers,
  ].filter(f => f > 0).length;
  score += (platforms / 4) * 10;

  // Country market fit (20%)
  if (PRIORITY_MARKETS.includes(input.country)) {
    score += 20;
  } else {
    score += 8; // Some value for other European countries
  }

  // Profession fit (15%)
  if (HIGH_VALUE_PROFESSIONS.includes(input.profession)) {
    score += 15;
  } else {
    score += 7;
  }

  // Pipeline proximity (10%)
  const phaseScores: Record<string, number> = {
    research: 2, outreach: 4, negotiation: 6, contract: 8,
    production: 9, live: 10, completed: 10,
  };
  score += phaseScores[input.project_phase] || 0;

  // Priority multiplier (15%)
  const priorityScores: Record<string, number> = {
    low: 3, medium: 8, high: 12, critical: 15,
  };
  score += priorityScores[input.priority] || 0;

  return Math.round(Math.min(score, 100) * 10) / 10;
}
