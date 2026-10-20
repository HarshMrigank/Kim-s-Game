export default function AnswerOptions({
  options = [],
  selected = [],
  maxSelections = 2,
  onToggle,
  onSubmit,
}) {
  const isComplete = selected.length === maxSelections;

  return (
    <section className="answer-panel" aria-label="Answer selection panel">
      <div className="answer-heading">
        <div>
          <h3>Which words disappeared?</h3>
          <p className="muted">
            Tap the cards below to mark which words vanished from the desk.
          </p>
        </div>

        <div
          className={`selection-count-badge ${isComplete ? "is-complete" : ""}`}
          aria-live="polite"
        >
          <span className="count-label">Selected</span>
          <strong>
            {selected.length} / {maxSelections}
          </strong>
        </div>
      </div>

      <div className="answer-options-grid">
        {options.map((word) => {
          const isSelected = selected.includes(word);
          const isDisabled = !isSelected && selected.length >= maxSelections;

          return (
            <button
              className={`answer-option-tile ${isSelected ? "is-selected" : ""} ${
                isDisabled ? "is-disabled" : ""
              }`}
              type="button"
              key={word}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onToggle(word)}
            >
              <span className="checkbox-doodle" aria-hidden="true">
                {isSelected ? "✓" : ""}
              </span>
              <span className="tile-text">{word}</span>
            </button>
          );
        })}
      </div>

      <div className="answer-submit-wrap">
        <button
          className="button button-primary button-full submit-answers-btn"
          type="button"
          disabled={!isComplete}
          onClick={onSubmit}
        >
          {isComplete
            ? "Submit answers & see results →"
            : `Select ${maxSelections - selected.length} more word${
                maxSelections - selected.length === 1 ? "" : "s"
              }`}
        </button>
      </div>
    </section>
  );
}
