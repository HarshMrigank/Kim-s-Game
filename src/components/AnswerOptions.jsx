
export default function AnswerOptions({
  options = [],
  selected = [],
  maxSelections = 2,
  onToggle,
  onSubmit,
}) {
  return (
    <section className="answer-panel">
      <div className="answer-heading">
        <div>
          <h3>Which words disappeared?</h3>
          <p className="muted">
            Select {maxSelections} missing words.
          </p>
        </div>

        <span className="selection-count">
          {selected.length}/{maxSelections}
        </span>
      </div>

      <div className="answer-options">
        {options.map((word) => {
          const isSelected = selected.includes(word);

          return (
            <button
              className={`answer-option ${
                isSelected ? "is-selected" : ""
              }`}
              type="button"
              key={word}
              aria-pressed={isSelected}
              disabled={!isSelected && selected.length >= maxSelections}
              onClick={() => onToggle(word)}
            >
              <span className="option-indicator">
                {isSelected ? "✓" : "+"}
              </span>

              {word}
            </button>
          );
        })}
      </div>

      <button
        className="button button-primary button-full"
        type="button"
        disabled={selected.length !== maxSelections}
        onClick={onSubmit}
      >
        Submit answers
      </button>
    </section>
  );
}
