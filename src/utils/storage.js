
const INSTRUCTIONS_KEY = "kims-game-instructions-seen";
const BEST_SCORE_KEY = "kims-game-best-score";
const PLAYER_NAME_KEY = "kims-game-player-name";
const ACTIVE_SESSION_KEY = "kims-game-active-session";

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
    // Gracefully handle storage disabled/quota
  }
}

export function getSavedPlayerName() {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function savePlayerName(name) {
  try {
    if (typeof name === "string" && name.trim()) {
      localStorage.setItem(PLAYER_NAME_KEY, name.trim());
    }
  } catch {
    // Ignore storage errors
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

export function getActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);

    // Validate minimum required session structure
    if (
      session &&
      typeof session === "object" &&
      typeof session.screen === "string" &&
      session.gameConfig &&
      session.round
    ) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveActiveSession(session) {
  try {
    if (!session) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Graceful fallback if storage fails
  }
}

export function clearActiveSession() {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}
