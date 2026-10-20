export default function RoundReview({
  currentRound = 1,
  totalRounds = 5,
  roundResult,
  levelInfo = null,
  accumulatedScore = 0,
  isLastRound = false,
  onContinue,
  onExit,
}) {
  const { score, correctAnswers = [], incorrectAnswers = [], missedWords = [] } =
    roundResult || {};

  return (
    <section className="game-card round-review-card" aria-label="Round results">
      <div className="review-header">
        <span className="eyebrow eyebrow-badge">
          ROUND {currentRound} OF {totalRounds} • {levelInfo?.icon} {levelInfo?.name || "Challenge"}
        </span>
        <h2>Round Summary</h2>
        <p className="muted">
          {levelInfo?.roast ? `“${levelInfo.roast}”` : "Here is how your recall held up on this set."}
        </p>
      </div>

      <div className="round-score-banner">
        <div className="round-pts">
          <span className="label">Points this round</span>
          <strong className="pts-value">+{score}</strong>
        </div>
        <div className="round-total-pts">
          <span className="label">Cumulative session score</span>
          <strong className="pts-value">{accumulatedScore + score} pts</strong>
        </div>
      </div>

      <div className="review-breakdown">
        {/* Correctly identified */}
        <div className="breakdown-group">
          <h4 className="group-title text-success">
            <span>✓ Correctly Recalled ({correctAnswers.length})</span>
          </h4>
          <div className="chips-container">
            {correctAnswers.length > 0 ? (
              correctAnswers.map((word) => (
                <span className="chip chip-success" key={word}>
                  ✓ {word} <small>+10 pts</small>
                </span>
              ))
            ) : (
              <span className="chip chip-empty">None identified</span>
            )}
          </div>
        </div>

        {/* Missed words */}
        {missedWords.length > 0 && (
          <div className="breakdown-group">
            <h4 className="group-title text-warning">
              <span>⚠️ Missed Words ({missedWords.length})</span>
            </h4>
            <div className="chips-container">
              {missedWords.map((word) => (
                <span className="chip chip-missed" key={word}>
                  💨 {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Incorrect selections */}
        {incorrectAnswers.length > 0 && (
          <div className="breakdown-group">
            <h4 className="group-title text-danger">
              <span>✗ Distractors Selected ({incorrectAnswers.length})</span>
            </h4>
            <div className="chips-container">
              {incorrectAnswers.map((word) => (
                <span className="chip chip-danger" key={word}>
                  ✗ {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="review-actions-stacked">
        <button
          className="button button-primary button-lg button-full"
          type="button"
          onClick={onContinue}
        >
          {isLastRound ? "View Final Results →" : `Proceed to Round ${currentRound + 1} →`}
        </button>

        {onExit && (
          <button
            className="button button-ghost button-sm"
            type="button"
            onClick={() => {
              if (window.confirm("Leave this game session and return to overview?")) {
                onExit();
              }
            }}
          >
            ← Exit Session to Overview
          </button>
        )}
      </div>
    </section>
  );
}
