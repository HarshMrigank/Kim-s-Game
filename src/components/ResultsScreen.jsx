
export default function ResultsScreen({
  playerName,
  level,
  score,
  accuracy,
  correctAnswers,
  totalAnswers,
  onReplay,
  onSetup,
  onShare,
}) {
  return (
    <section className="results-card">
      <span className="eyebrow">SESSION COMPLETE</span>

      <div className="result-symbol" aria-hidden="true">
        ✓
      </div>

      <h1>Well played, {playerName || "Player"}.</h1>

      <p className="muted">
        You completed Level {level || 1}.
      </p>

      <div className="score-display">
        <span>Total score</span>
        <strong>{score ?? 0}</strong>
        <small>Points earned</small>
      </div>

      <div className="results-stats">
        <div>
          <strong>{accuracy ?? 0}%</strong>
          <span>Accuracy</span>
        </div>

        <div>
          <strong>{correctAnswers ?? 0}</strong>
          <span>Correct</span>
        </div>

        <div>
          <strong>{totalAnswers ?? 0}</strong>
          <span>Total answers</span>
        </div>
      </div>

      <div className="results-actions">
        <button className="button button-primary" onClick={onReplay}>
          Play again
        </button>

        <button className="button button-secondary" onClick={onSetup}>
          Back to setup
        </button>

        <button className="button button-ghost" onClick={onShare}>
          Share my score
        </button>
      </div>
    </section>
  );
}
