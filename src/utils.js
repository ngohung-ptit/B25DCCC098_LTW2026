import { POINTS, RANKS } from './data';

export const calcScore = (answers = []) => {
  return answers
    .filter((a) => a.correct)
    .reduce((sum, a) => sum + (POINTS[a.level] || 0) + (a.speedBonus || 0), 0);
};

export const getRank = (score = 0) => {
  const found = RANKS.find((r) => score >= r.min);
  return found ? found.title : '';
};
