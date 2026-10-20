
import { useState } from "react";
import { LEVELS } from "../data/levels";

export default function SetupScreen({ onStart }) {
  const [name, setName] = useState("");
  const [levelNumber, setLevelNumber] = useState("1");
  const [rounds, setRounds] = useState("10");
  const [error, setError] = useState("");

  const selectedLevel = LEVELS.find(
    (level) => level.level === Number(levelNumber)
  );

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name before starting.");
      return;
    }

    setError("");

    onStart({
      playerName: trimmedName,
      level: selectedLevel,
      rounds: Number(rounds),
    });
  }

  return (
    <section className="setup-layout">
      <div className="intro-copy">
        <span className="eyebrow">TRAIN YOUR ATTENTION</span>

        <h1>
          Notice more.
          <br />
          Remember better.
        </h1>

        <p>
          Memorise a collection of words, identify what disappears,
          and challenge your memory one round at a time.
        </p>

        <div className="feature-row">
          <div className="feature-card">
            <span>01</span>
            <strong>Observe</strong>
            <small>Study the words</small>
          </div>

          <div className="feature-card">
            <span>02</span>
            <strong>Remember</strong>
            <small>Recall what's missing</small>
          </div>

          <div className="feature-card">
            <span>03</span>
            <strong>Improve</strong>
            <small>Build your score</small>
          </div>
        </div>
      </div>

      <form className="setup-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">YOUR NEXT CHALLENGE</span>
          <h2>Set up your game</h2>
          <p className="muted">
            Choose your settings before you begin.
          </p>
        </div>

        <label className="field">
          Player name

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            maxLength={40}
            autoComplete="nickname"
          />
        </label>

        <label className="field">
          Difficulty level

          <select
            value={levelNumber}
            onChange={(event) => setLevelNumber(event.target.value)}
          >
            {LEVELS.map((level) => (
              <option key={level.level} value={level.level}>
                Level {level.level} — {level.name}
              </option>
            ))}
          </select>
        </label>

        {selectedLevel && (
          <div className="level-summary">
            <div>
              <strong>{selectedLevel.words}</strong>
              <span>Words to memorise</span>
            </div>

            <div>
              <strong>{selectedLevel.missing}</strong>
              <span>Missing words</span>
            </div>

            <div>
              <strong>{selectedLevel.time}s</strong>
              <span>Per phase</span>
            </div>
          </div>
        )}

        <label className="field">
          Number of rounds

          <select
            value={rounds}
            onChange={(event) => setRounds(event.target.value)}
          >
            <option value="5">5 rounds</option>
            <option value="10">10 rounds</option>
            <option value="20">20 rounds</option>
          </select>
        </label>

        {error && <p className="error-message">{error}</p>}

        <button className="button button-primary button-full" type="submit">
          Start training <span aria-hidden="true">→</span>
        </button>

        <p className="fine-print">
          No account required. Just focus and play.
        </p>
      </form>
    </section>
  );
}
