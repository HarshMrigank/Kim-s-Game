import { useState } from "react";
import { LEVELS } from "../data/levels";
import { getSavedPlayerName, savePlayerName } from "../utils/storage";

export default function SetupScreen({ onStart, onBack }) {
  const [name, setName] = useState(() => getSavedPlayerName() || "");
  const [selectedLevelNum, setSelectedLevelNum] = useState(1);
  const [rounds, setRounds] = useState(5);
  const [error, setError] = useState("");

  const selectedLevel =
    LEVELS.find((l) => l.level === Number(selectedLevelNum)) || LEVELS[0];

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name or an observer callsign to begin.");
      return;
    }

    setError("");
    savePlayerName(trimmed);

    onStart({
      playerName: trimmed,
      level: selectedLevel,
      rounds: Number(rounds),
    });
  }

  return (
    <div className="setup-page-wrapper">
      <div className="setup-nav-bar">
        <button
          className="button button-ghost button-sm back-nav-btn"
          type="button"
          onClick={onBack}
        >
          ← Back to Overview
        </button>
      </div>

      <div className="setup-container">
        {/* Spiral Notebook Header */}
        <div className="notebook-spiral-header" aria-hidden="true">
          <div className="spiral-holes">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="spiral-hole"></span>
            ))}
          </div>
        </div>

        <form className="setup-notebook-sheet" onSubmit={handleSubmit}>
          <div className="sheet-heading">
            <span className="eyebrow">OBSERVER REGISTRATION</span>
            <h2>Set Up Your Challenge</h2>
            <p className="muted">
              Choose your test parameters. When ready, tap start to begin the memorisation phase.
            </p>
          </div>

          {/* 1. Player Name */}
          <div className="field-group">
            <label className="handwritten-label" htmlFor="player-name">
              <span>Observer Name / Callsign:</span>
              <span className="field-hint">(Used for your score report)</span>
            </label>
            <input
              id="player-name"
              className="notebook-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Agent Kim, Sherlock, Observer"
              maxLength={35}
              autoComplete="nickname"
            />
          </div>

          {/* 2. Dropdown-Based Level Selection (No "Level 1/2", Just Sarcastic Names & Creative Visuals) */}
          <div className="field-group">
            <label className="handwritten-label" htmlFor="level-dropdown">
              <span>Choose Your Memory Challenge:</span>
            </label>

            <div className="dropdown-wrapper">
              <select
                id="level-dropdown"
                className="notebook-select"
                value={selectedLevelNum}
                onChange={(e) => setSelectedLevelNum(Number(e.target.value))}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    {lvl.icon} {lvl.name} ({lvl.words} cards • {lvl.missing} missing • {lvl.time}s)
                  </option>
                ))}
              </select>
              <span className="select-arrow-doodle" aria-hidden="true">▼</span>
            </div>

            {/* Creative Visual Spotlight Card for the Selected Sarcastic Level */}
            <div
              className="sarcastic-level-card"
              style={{ borderLeftColor: selectedLevel.color }}
            >
              <div className="sarcastic-card-header">
                <span className="sarcastic-card-icon" aria-hidden="true">
                  {selectedLevel.icon}
                </span>
                <div className="sarcastic-text-wrap">
                  <h3 className="sarcastic-name">{selectedLevel.name}</h3>
                  <p className="sarcastic-roast">“{selectedLevel.roast}”</p>
                </div>
              </div>

              <div className="selected-level-spotlight">
                <div className="spotlight-metric">
                  <span className="metric-label">Flashcards</span>
                  <strong className="metric-value">{selectedLevel.words}</strong>
                  <small className="metric-sub">total words</small>
                </div>

                <div className="spotlight-metric spotlight-coral">
                  <span className="metric-label">Missing</span>
                  <strong className="metric-value">{selectedLevel.missing}</strong>
                  <small className="metric-sub">words that vanish</small>
                </div>

                <div className="spotlight-metric spotlight-blue">
                  <span className="metric-label">Time Limit</span>
                  <strong className="metric-value">{selectedLevel.time}s</strong>
                  <small className="metric-sub">per phase</small>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Session Length */}
          <div className="field-group">
            <label className="handwritten-label">
              <span>Session Length (Number of Rounds):</span>
            </label>
            <div className="rounds-selector-group">
              {[
                { count: 1, label: "1 Round (Quick Drill)" },
                { count: 3, label: "3 Rounds (Standard)" },
                { count: 5, label: "5 Rounds (Full Session)" },
                { count: 10, label: "10 Rounds (Endurance)" },
              ].map((opt) => (
                <button
                  key={opt.count}
                  type="button"
                  className={`round-opt-btn ${rounds === opt.count ? "is-active" : ""}`}
                  onClick={() => setRounds(opt.count)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-message notebook-error">{error}</p>}

          <div className="form-submit-row">
            <button
              className="button button-primary button-xl start-challenge-btn"
              type="submit"
            >
              Start “{selectedLevel.name}” →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
