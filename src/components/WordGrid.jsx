
export default function WordGrid({ words = [] }) {
  return (
    <div className="word-grid">
      {words.map((word, index) => (
        <div className="word-card" key={`${word}-${index}`}>
          <span className="word-number">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="word-label">{word}</span>
        </div>
      ))}
    </div>
  );
}
