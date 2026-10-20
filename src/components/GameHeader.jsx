export default function GameHeader({
  onInstructions,
  inGame = false,
  isWelcomeScreen = false,
  roundInfo = null,
  onPlayNow = null,
  onQuitGame = null,
}) {
  return (
    <header className="app-header">
      <div className="brand-group">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            if (inGame && onQuitGame) {
              if (window.confirm("Return to setup? Current session progress will be lost.")) {
                onQuitGame();
              }
            } else if (!inGame && onQuitGame) {
              onQuitGame();
            }
          }}
        >
          <div className="brand-mark-doodle" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
              <rect x="5" y="4" width="30" height="32" rx="4" fill="#FFE28A" stroke="#252525" strokeWidth="2.5" />
              <line x1="12" y1="4" x2="12" y2="36" stroke="#FF8D80" strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="23" cy="18" r="6" stroke="#252525" strokeWidth="2" fill="#FFF9EF" />
              <circle cx="24" cy="18" r="2.5" fill="#252525" />
              <path d="M17 28 Q 23 32 29 28" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="brand-text">
            <div className="brand-title">
              <strong>Kim’s Game</strong>
              <span className="notebook-doodle-star">★</span>
            </div>
            <small className="tagline">Look closely. Remember more.</small>
          </div>
        </a>

        {inGame && roundInfo && (
          <div className="header-round-pill">
            <span className="pill-dot"></span>
            <span>
              Round {roundInfo.currentRound} of {roundInfo.totalRounds}
            </span>
            <span className="pill-separator">•</span>
            <span>
              {roundInfo.icon ? `${roundInfo.icon} ` : ""}{roundInfo.levelName || "Challenge"}
            </span>
          </div>
        )}
      </div>

      <div className="header-actions">
        {isWelcomeScreen && onPlayNow && (
          <button
            className="button button-primary button-sm header-play-btn"
            type="button"
            onClick={onPlayNow}
          >
            <span>Play Now →</span>
          </button>
        )}

        {inGame && onQuitGame && (
          <button
            className="button button-ghost button-sm header-quit-btn"
            type="button"
            onClick={() => {
              if (window.confirm("Leave current game and return to setup?")) {
                onQuitGame();
              }
            }}
          >
            ← Exit Game
          </button>
        )}

        <button
          className="button button-doodle button-sm"
          onClick={onInstructions}
          type="button"
          aria-label="View how to play and rules"
        >
          <span className="btn-icon">💡</span>
          <span>How to play</span>
        </button>
      </div>
    </header>
  );
}
