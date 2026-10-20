
import { useState } from "react";

import GameHeader from "./components/GameHeader";
import SetupScreen from "./components/SetupScreen";
import WordGrid from "./components/WordGrid";
import AnswerOptions from "./components/AnswerOptions";
import ResultsScreen from "./components/ResultsScreen";
import WelcomeModal from "./components/WelcomeModal";

import "./App.css";

const DEMO_WORDS = [
  "Apple",
  "Mountain",
  "Guitar",
  "River",
  "Window",
  "Camera",
  "Garden",
  "Rocket",
];

const DEMO_OPTIONS = [
  "Apple",
  "Mountain",
  "Guitar",
  "River",
  "Window",
  "Camera",
];

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [showWelcome, setShowWelcome] = useState(true);

  const [gameConfig, setGameConfig] = useState({
    playerName: "",
    level: null,
    rounds: 10,
  });

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  function startGame(config) {
    setGameConfig(config);
    setSelectedAnswers([]);
    setShowWelcome(false);
    setScreen("memorise");
  }

  function toggleAnswer(word) {
    setSelectedAnswers((current) => {
      if (current.includes(word)) {
        return current.filter((item) => item !== word);
      }

      if (current.length >= gameConfig.level.missing) {
        return current;
      }

      return [...current, word];
    });
  }

  function submitAnswers() {
    setScreen("results");
  }

  function replayGame() {
    setSelectedAnswers([]);
    setScreen("memorise");
  }

  function returnToSetup() {
    setSelectedAnswers([]);
    setScreen("setup");
  }

  function shareDemoScore() {
    const message =
      `I scored 0 points in Kim's Game at Level ` +
      `${gameConfig.level?.level ?? 1}. ` +
      `Can you beat my score?`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `${message} Play here: ${window.location.href}`
      )
        .then(() => window.alert("Score message copied."))
        .catch(() => window.alert(message));
    } else {
      window.alert(message);
    }
  }

  return (
    <div className="app-shell">
      <GameHeader
        onInstructions={() => setShowWelcome(true)}
      />

      <main className="main-content">
        {screen === "setup" && (
          <SetupScreen onStart={startGame} />
        )}

        {screen === "memorise" && (
          <section className="game-card">
            <div className="game-heading">
              <div>
                <span className="eyebrow">
                  ROUND 1 OF {gameConfig.rounds}
                </span>

                <h1>Memorise these words</h1>

                <p className="muted">
                  {gameConfig.playerName}, study the cards carefully.
                </p>
              </div>

              <div className="timer-placeholder">
                <strong>{gameConfig.level?.time ?? 8}s</strong>
                <span>Time limit</span>
              </div>
            </div>

            <WordGrid
              words={DEMO_WORDS.slice(
                0,
                gameConfig.level?.words ?? 8
              )}
            />

            <div className="demo-notice">
              This is a preview. The countdown and word randomisation
              will be implemented in the next modules.
            </div>

            <button
              className="button button-primary"
              onClick={() => setScreen("answer")}
            >
              Continue to answers →
            </button>
          </section>
        )}

        {screen === "answer" && (
          <section className="game-card">
            <div className="game-heading">
              <div>
                <span className="eyebrow">ROUND 1</span>
                <h1>What disappeared?</h1>
                <p className="muted">
                  Select the words you think are missing.
                </p>
              </div>

              <div className="timer-placeholder">
                <strong>{gameConfig.level?.time ?? 8}s</strong>
                <span>Time limit</span>
              </div>
            </div>

            <WordGrid
              words={DEMO_WORDS.slice(
                gameConfig.level?.missing ?? 2
              )}
            />

            <AnswerOptions
              options={DEMO_OPTIONS}
              selected={selectedAnswers}
              maxSelections={gameConfig.level?.missing ?? 2}
              onToggle={toggleAnswer}
              onSubmit={submitAnswers}
            />

            <p className="demo-notice">
              Demo mode: answer validation and scoring are not
              connected yet.
            </p>
          </section>
        )}

        {screen === "results" && (
          <ResultsScreen
            playerName={gameConfig.playerName}
            level={gameConfig.level?.level ?? 1}
            score={0}
            accuracy={0}
            correctAnswers={0}
            totalAnswers={gameConfig.level?.missing ?? 2}
            onReplay={replayGame}
            onSetup={returnToSetup}
            onShare={shareDemoScore}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>Kim's Game</span>
        <span>Observe. Remember. Improve.</span>
      </footer>

      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStart={() => setShowWelcome(false)}
      />
    </div>
  );
}
