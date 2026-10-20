const CARD_COLORS = [
  "#FFE28A", // soft yellow
  "#77BCE8", // notebook blue
  "#A9DCC3", // mint green
  "#C8B8F0", // lavender
  "#FF8D80", // coral red
];

export default function WordGrid({
  words = [],
  missingSet = null,
  isRecall = false,
}) {
  return (
    <div className="word-grid" role="region" aria-label="Word cards grid">
      {words.map((word, index) => {
        const isMissing = isRecall && missingSet && missingSet.has(word);
        const color = CARD_COLORS[index % CARD_COLORS.length];
        // Subtle tilt for notebook feel (-1.2deg to 1.2deg)
        const rotation = (index % 4 === 0) ? -1.2 : (index % 4 === 1) ? 0.8 : (index % 4 === 2) ? -0.7 : 1.1;

        if (isMissing) {
          return (
            <div
              className="word-card word-card-vanished"
              key={`vanished-${word}-${index}`}
              aria-label="Disappeared card slot"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <span className="word-number">#{String(index + 1).padStart(2, "0")}</span>
              <div className="vanished-content">
                <span className="vanished-icon" aria-hidden="true">💨</span>
                <span className="vanished-text">Missing</span>
              </div>
            </div>
          );
        }

        return (
          <div
            className="word-card"
            key={`${word}-${index}`}
            style={{
              backgroundColor: "#FFFDF8",
              borderTop: `5px solid ${color}`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <div className="word-card-header">
              <span className="word-number">#{String(index + 1).padStart(2, "0")}</span>
              <span
                className="word-color-dot"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            </div>

            <span className="word-label">{word}</span>
          </div>
        );
      })}
    </div>
  );
}
