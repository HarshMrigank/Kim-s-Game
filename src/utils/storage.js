
const INSTRUCTIONS_KEY = "kims-game-instructions-seen";
const BEST_SCORE_KEY = "kims-game-best-score";

export function hasSeenInstructions() {
  try {
    return localStorage.getItem(INSTRUCTIONS_KEY) === "true";
  } catch {
    return false;
  }
}

export function markInstructionsSeen() {
  try {
    localStorage.setItem(INSTRUCTIONS_KEY, "true");
  } catch {
    // The app can still run if browser storage is unavailable.
  }
}

export function getBestScore() {
  try {
    const value = localStorage.getItem(BEST_SCORE_KEY);

    if (value === null) {
      return 0;
    }

    const score = Number(value);

    return Number.isFinite(score) && score >= 0 ? score : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    const currentBest = getBestScore();
    const newScore = Number(score);

    if (!Number.isFinite(newScore) || newScore < 0) {
      return currentBest;
    }

    const best = Math.max(currentBest, newScore);

    localStorage.setItem(BEST_SCORE_KEY, String(best));

    return best;
  } catch {
    return getBestScore();
  }
}
