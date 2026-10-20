import { useEffect, useState, useRef, useCallback } from "react";

import GameHeader from "./components/GameHeader";
import WelcomePage from "./components/WelcomePage";
import SetupScreen from "./components/SetupScreen";
import WordGrid from "./components/WordGrid";
import AnswerOptions from "./components/AnswerOptions";
import RoundReview from "./components/RoundReview";
import ResultsScreen from "./components/ResultsScreen";
import WelcomeModal from "./components/WelcomeModal";

import {
  createRound,
  createAnswerOptions,
} from "./utils/gameLogic";

import { evaluateAnswers } from "./utils/scoring";
import {
  hasSeenInstructions,
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
} from "./utils/storage";

import useTimer from "./hooks/useTimer";

import "./App.css";

const initialSavedSession = typeof window !== "undefined" ? getActiveSession() : null;

export default function App() {
  const [screen, setScreen] = useState(() => initialSavedSession?.screen || "welcome");
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenInstructions());

  const [wordBank, setWordBank] = useState([]);
  const [loadingWords, setLoadingWords] = useState(true);
  const [error, setError] = useState("");

  const [gameConfig, setGameConfig] = useState(() => initialSavedSession?.gameConfig || null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(() => initialSavedSession?.currentRoundIndex || 0);
  const [usedWordsInSession, setUsedWordsInSession] = useState(() => new Set());

  const [round, setRound] = useState(() => initialSavedSession?.round || null);
  const [options, setOptions] = useState(() => initialSavedSession?.options || []);
  const [selectedAnswers, setSelectedAnswers] = useState(() => initialSavedSession?.selectedAnswers || []);

  const [roundResult, setRoundResult] = useState(() => initialSavedSession?.roundResult || null);
  const [accumulatedScore, setAccumulatedScore] = useState(() => initialSavedSession?.accumulatedScore || 0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(() => initialSavedSession?.totalCorrectAnswers || 0);
  const [totalPossibleAnswers, setTotalPossibleAnswers] = useState(() => initialSavedSession?.totalPossibleAnswers || 0);
  const [roundHistory, setRoundHistory] = useState(() => initialSavedSession?.roundHistory || []);

  const [timerDeadline, setTimerDeadline] = useState(() => initialSavedSession?.timerDeadline || null);
  const [timerDuration, setTimerDuration] = useState(() => initialSavedSession?.timerDuration || 8);

  const selectedAnswersRef = useRef(selectedAnswers);
  const roundRef = useRef(round);
  const gameConfigRef = useRef(gameConfig);
  const currentRoundIndexRef = useRef(currentRoundIndex);
  const accumulatedScoreRef = useRef(accumulatedScore);
  const totalCorrectAnswersRef = useRef(totalCorrectAnswers);
  const totalPossibleAnswersRef = useRef(totalPossibleAnswers);
  const roundHistoryRef = useRef(roundHistory);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
    roundRef.current = round;
    gameConfigRef.current = gameConfig;
    currentRoundIndexRef.current = currentRoundIndex;
    accumulatedScoreRef.current = accumulatedScore;
    totalCorrectAnswersRef.current = totalCorrectAnswers;
    totalPossibleAnswersRef.current = totalPossibleAnswers;
    roundHistoryRef.current = roundHistory;
  }, [
    selectedAnswers,
    round,
    gameConfig,
    currentRoundIndex,
    accumulatedScore,
    totalCorrectAnswers,
    totalPossibleAnswers,
    roundHistory,
  ]);

  // Load word bank from /words.json
  useEffect(() => {
    async function loadWords() {
      try {
        const response = await fetch("/words.json");

        if (!response.ok) {
          throw new Error("Could not load the word bank.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("The word bank is empty or invalid.");
        }

        const cleanedWords = data
          .filter((word) => typeof word === "string")
          .map((word) => word.trim())
          .filter(Boolean);

        const uniqueWords = [...new Set(cleanedWords)];

        if (uniqueWords.length === 0) {
          throw new Error("No valid words were found.");
        }

        setWordBank(uniqueWords);
        setError("");
      } catch (err) {
        setError(err.message || "Unable to load game words.");
      } finally {
        setLoadingWords(false);
      }
    }

    loadWords();
  }, []);

  // Check for timer expiration on mount after wordBank is ready
  useEffect(() => {
    if (loadingWords) return;

    try {
      const saved = getActiveSession();
      if (!saved || !saved.gameConfig || !saved.round) return;

      const now = Date.now();
      const {
        screen: savedScreen,
        round: savedRound,
        selectedAnswers: savedSelected,
        accumulatedScore: savedScore,
        totalCorrectAnswers: savedCorrect,
        totalPossibleAnswers: savedPossible,
        timerDeadline: savedDeadline,
      } = saved;

      if (savedScreen === "memorise" && savedDeadline && savedDeadline <= now) {
        setTimeout(() => {
          // Memorise timer expired while offline/reloading -> advance to answer
          const answerOpts = createAnswerOptions(
            wordBank,
            savedRound.missingWords,
            4,
            savedRound.allWords
          );
          const nextDeadline = Date.now() + (savedRound.level?.time || 8) * 1000;
          setOptions(answerOpts);
          setSelectedAnswers([]);
          setTimerDeadline(nextDeadline);
          setScreen("answer");
        }, 0);
      } else if (savedScreen === "answer" && savedDeadline && savedDeadline <= now) {
        setTimeout(() => {
          // Answer timer expired while offline/reloading -> auto-submit
          const evaluated = evaluateAnswers(
            savedSelected || [],
            savedRound.missingWords
          );
          setRoundResult(evaluated);
          setAccumulatedScore((savedScore || 0) + evaluated.score);
          setTotalCorrectAnswers((savedCorrect || 0) + evaluated.correctAnswers.length);
          setTotalPossibleAnswers((savedPossible || 0) + evaluated.totalAnswers);
          setScreen("round-review");
        }, 0);
      }
    } catch {
      clearActiveSession();
    }
  }, [loadingWords, wordBank]);

  // Synchronize active session to localStorage whenever key state changes
  const persistSession = useCallback((override = {}) => {
    if (screen === "setup" || screen === "welcome") {
      clearActiveSession();
      return;
    }

    const sessionData = {
      screen,
      gameConfig: gameConfigRef.current,
      currentRoundIndex: currentRoundIndexRef.current,
      round: roundRef.current,
      options,
      selectedAnswers: selectedAnswersRef.current,
      roundResult,
      accumulatedScore: accumulatedScoreRef.current,
      totalCorrectAnswers: totalCorrectAnswersRef.current,
      totalPossibleAnswers: totalPossibleAnswersRef.current,
      roundHistory: roundHistoryRef.current,
      timerDeadline,
      timerDuration,
      ...override,
    };

    saveActiveSession(sessionData);
  }, [screen, options, roundResult, timerDeadline, timerDuration]);

  useEffect(() => {
    if (screen !== "setup" && screen !== "welcome" && gameConfig && round) {
      persistSession();
    }
  }, [screen, gameConfig, round, options, selectedAnswers, roundResult, timerDeadline, timerDuration, persistSession]);

  // Handle memorise timer expiration
  const handleMemoriseExpire = useCallback(() => {
    if (!roundRef.current) return;

    try {
      const answerOptions = createAnswerOptions(
        wordBank,
        roundRef.current.missingWords,
        4,
        roundRef.current.allWords
      );

      const nextDeadline = Date.now() + (roundRef.current.level?.time || 8) * 1000;

      setOptions(answerOptions);
      setSelectedAnswers([]);
      setTimerDeadline(nextDeadline);
      setScreen("answer");
      setError("");

      persistSession({
        screen: "answer",
        options: answerOptions,
        selectedAnswers: [],
        timerDeadline: nextDeadline,
      });
    } catch (err) {
      setError(err.message || "Could not generate answer choices.");
    }
  }, [wordBank, persistSession]);

  // Memorise timer hook
  const memoriseTimer = useTimer({
    initialSeconds: timerDuration,
    deadlineTimestamp: timerDeadline,
    isRunning: screen === "memorise",
    onExpire: handleMemoriseExpire,
  });

  // Handle answer timer expiration (auto-submit)
  const handleAnswerExpire = useCallback(() => {
    if (!roundRef.current) return;

    const currentSelected = selectedAnswersRef.current;
    const result = evaluateAnswers(currentSelected, roundRef.current.missingWords);

    const newAccumScore = accumulatedScoreRef.current + result.score;
    const newCorrect = totalCorrectAnswersRef.current + result.correctAnswers.length;
    const newPossible = totalPossibleAnswersRef.current + result.totalAnswers;

    const roundSummary = {
      roundNumber: currentRoundIndexRef.current + 1,
      scoreEarned: result.score,
      correctCount: result.correctAnswers.length,
      totalCount: result.totalAnswers,
      accuracy: result.accuracy,
    };

    const newHistory = [...roundHistoryRef.current, roundSummary];

    setRoundResult(result);
    setAccumulatedScore(newAccumScore);
    setTotalCorrectAnswers(newCorrect);
    setTotalPossibleAnswers(newPossible);
    setRoundHistory(newHistory);
    setTimerDeadline(null);
    setScreen("round-review");

    persistSession({
      screen: "round-review",
      roundResult: result,
      accumulatedScore: newAccumScore,
      totalCorrectAnswers: newCorrect,
      totalPossibleAnswers: newPossible,
      roundHistory: newHistory,
      timerDeadline: null,
    });
  }, [persistSession]);

  // Answer timer hook
  const answerTimer = useTimer({
    initialSeconds: timerDuration,
    deadlineTimestamp: timerDeadline,
    isRunning: screen === "answer",
    onExpire: handleAnswerExpire,
  });

  // Start new game session
  function startGame(config) {
    try {
      if (wordBank.length === 0) {
        throw new Error("Game words are not available yet.");
      }

      if (!config?.level) {
        throw new Error("Please select a difficulty level.");
      }

      const freshUsed = new Set();
      const newRound = createRound(wordBank, config.level, freshUsed);
      newRound.allWords.forEach((w) => freshUsed.add(w));

      const duration = config.level.time;
      const deadline = Date.now() + duration * 1000;

      setGameConfig(config);
      setCurrentRoundIndex(0);
      setUsedWordsInSession(freshUsed);
      setRound(newRound);
      setOptions([]);
      setSelectedAnswers([]);
      setRoundResult(null);
      setAccumulatedScore(0);
      setTotalCorrectAnswers(0);
      setTotalPossibleAnswers(0);
      setRoundHistory([]);
      setTimerDuration(duration);
      setTimerDeadline(deadline);
      memoriseTimer.resetTimer(duration, deadline);
      setError("");
      setScreen("memorise");
      setShowWelcome(false);

      persistSession({
        screen: "memorise",
        gameConfig: config,
        currentRoundIndex: 0,
        round: newRound,
        options: [],
        selectedAnswers: [],
        roundResult: null,
        accumulatedScore: 0,
        totalCorrectAnswers: 0,
        totalPossibleAnswers: 0,
        roundHistory: [],
        timerDuration: duration,
        timerDeadline: deadline,
      });
    } catch (err) {
      setError(err.message || "Could not start the game.");
    }
  }

  // Early proceed from memorise to answer
  function showAnswerScreenEarly() {
    handleMemoriseExpire();
  }

  // Toggle answer selection
  function toggleAnswer(word) {
    if (!round) return;

    setSelectedAnswers((previous) => {
      let next;
      if (previous.includes(word)) {
        next = previous.filter((item) => item !== word);
      } else if (previous.length >= round.missingWords.length) {
        next = previous;
      } else {
        next = [...previous, word];
      }
      return next;
    });
  }

  // Manual submit answers
  function submitAnswers() {
    if (!round || selectedAnswers.length !== round.missingWords.length) {
      return;
    }
    handleAnswerExpire();
  }

  // Advance from round-review to next round OR results
  function advanceFromReview() {
    const nextRoundIndex = currentRoundIndex + 1;
    const totalRounds = gameConfig?.rounds || 1;

    if (nextRoundIndex >= totalRounds) {
      // Session finished!
      setScreen("results");
      persistSession({
        screen: "results",
      });
    } else {
      // Start next round
      try {
        const nextRound = createRound(
          wordBank,
          gameConfig.level,
          usedWordsInSession
        );
        const nextUsed = new Set(usedWordsInSession);
        nextRound.allWords.forEach((w) => nextUsed.add(w));

        const duration = gameConfig.level.time;
        const deadline = Date.now() + duration * 1000;

        setCurrentRoundIndex(nextRoundIndex);
        setUsedWordsInSession(nextUsed);
        setRound(nextRound);
        setOptions([]);
        setSelectedAnswers([]);
        setRoundResult(null);
        setTimerDuration(duration);
        setTimerDeadline(deadline);
        memoriseTimer.resetTimer(duration, deadline);
        setScreen("memorise");

        persistSession({
          screen: "memorise",
          currentRoundIndex: nextRoundIndex,
          round: nextRound,
          options: [],
          selectedAnswers: [],
          roundResult: null,
          timerDuration: duration,
          timerDeadline: deadline,
        });
      } catch (err) {
        setError(err.message || "Failed to start next round.");
      }
    }
  }

  // Replay game with same configuration
  function replayGame() {
    if (gameConfig) {
      clearActiveSession();
      startGame(gameConfig);
    }
  }

  // Return to welcome page and clear in-progress session
  function returnToWelcome() {
    clearActiveSession();
    setScreen("welcome");
    setGameConfig(null);
    setCurrentRoundIndex(0);
    setRound(null);
    setOptions([]);
    setSelectedAnswers([]);
    setRoundResult(null);
    setAccumulatedScore(0);
    setTotalCorrectAnswers(0);
    setTotalPossibleAnswers(0);
    setRoundHistory([]);
    setTimerDeadline(null);
    setError("");
  }

  // Return to setup
  function returnToSetup() {
    clearActiveSession();
    setScreen("setup");
    setGameConfig(null);
    setCurrentRoundIndex(0);
    setRound(null);
    setOptions([]);
    setSelectedAnswers([]);
    setRoundResult(null);
    setAccumulatedScore(0);
    setTotalCorrectAnswers(0);
    setTotalPossibleAnswers(0);
    setRoundHistory([]);
    setTimerDeadline(null);
    setError("");
  }

  const levelNumber = round?.level?.level ?? 1;
  const levelName = round?.level?.name ?? "";
  const totalRounds = gameConfig?.rounds || 1;
  const currentRoundNum = currentRoundIndex + 1;
  const missingWordsSet = round ? new Set(round.missingWords) : null;

  const overallAccuracy =
    totalPossibleAnswers > 0
      ? Math.round((totalCorrectAnswers / totalPossibleAnswers) * 100)
      : 0;

  const inActiveGame =
    screen === "memorise" ||
    screen === "answer" ||
    screen === "round-review";

  return (
    <div className="app-shell notebook-theme">
      {/* Background notebook doodle decorations */}
      <div className="bg-doodle bg-doodle-star-1" aria-hidden="true">★</div>
      <div className="bg-doodle bg-doodle-star-2" aria-hidden="true">✦</div>
      <div className="bg-doodle bg-doodle-arrow" aria-hidden="true">↗</div>
      <div className="bg-doodle bg-doodle-circle" aria-hidden="true">○</div>

      <GameHeader
        onInstructions={() => setShowWelcome(true)}
        inGame={inActiveGame}
        isWelcomeScreen={screen === "welcome"}
        roundInfo={
          inActiveGame && gameConfig
            ? {
                currentRound: currentRoundNum,
                totalRounds,
                levelName: round?.level?.name || levelName,
                icon: round?.level?.icon || "🧠",
              }
            : null
        }
        onPlayNow={() => setScreen("setup")}
        onQuitGame={returnToWelcome}
      />

      <main className="main-content">
        {loadingWords && (
          <div className="status-loading-card">
            <span className="loading-spinner" aria-hidden="true">⏳</span>
            <p>Loading the observation word bank...</p>
          </div>
        )}

        {error && (
          <p role="alert" className="error-message notebook-error-alert">
            {error}
          </p>
        )}

        {/* 1. Welcome & Landing Page */}
        {!loadingWords && screen === "welcome" && (
          <WelcomePage onGoToSetup={() => setScreen("setup")} />
        )}

        {/* 2. Dedicated Setup Page */}
        {!loadingWords && screen === "setup" && (
          <SetupScreen
            onStart={startGame}
            onBack={returnToWelcome}
          />
        )}

        {/* 3. Memorise Phase Screen */}
        {screen === "memorise" && round && (
          <section className="game-card notebook-game-card" aria-label="Memorisation Phase">
            <div className="game-heading">
              <div className="heading-copy">
                <span className="eyebrow eyebrow-badge">
                  ROUND {currentRoundNum} OF {totalRounds} • {round.level?.icon} {levelName}
                </span>

                <h1 className="game-screen-title">Memorise these words</h1>

                <p className="muted">
                  <strong>{gameConfig?.playerName}</strong>, study the flashcards carefully.
                  {round.level?.roast ? ` (${round.level.roast})` : ""}
                </p>
              </div>

              {/* Hand-drawn circular timer badge */}
              <div
                className={`notebook-timer-badge ${
                  memoriseTimer.secondsLeft <= 3 ? "timer-warning" : ""
                }`}
                aria-live="polite"
              >
                <span className="timer-icon" aria-hidden="true">⏱️</span>
                <strong className="timer-sec">{memoriseTimer.secondsLeft}s</strong>
                <span className="timer-label">Remaining</span>
              </div>
            </div>

            <WordGrid words={round.allWords} />

            <div className="game-action-bar">
              <button
                className="button button-primary button-lg ready-btn"
                type="button"
                onClick={showAnswerScreenEarly}
              >
                I am ready early →
              </button>
            </div>
          </section>
        )}

        {/* 4. Recall / Answer Phase Screen */}
        {screen === "answer" && round && (
          <section className="game-card notebook-game-card" aria-label="Recall Phase">
            <div className="game-heading">
              <div className="heading-copy">
                <span className="eyebrow eyebrow-coral">
                  ROUND {currentRoundNum} OF {totalRounds} • {round.level?.icon} {levelName}
                </span>

                <h1 className="game-screen-title">What disappeared?</h1>

                <p className="muted">
                  The desk has changed. Identify the exactly{" "}
                  <strong>{round.missingWords.length}</strong> missing words before the clock runs out.
                </p>
              </div>

              <div
                className={`notebook-timer-badge ${
                  answerTimer.secondsLeft <= 3 ? "timer-warning" : ""
                }`}
                aria-live="polite"
              >
                <span className="timer-icon" aria-hidden="true">⏳</span>
                <strong className="timer-sec">{answerTimer.secondsLeft}s</strong>
                <span className="timer-label">Answer Time</span>
              </div>
            </div>

            {/* Preserved grid with vanished slots */}
            <WordGrid
              words={round.allWords}
              missingSet={missingWordsSet}
              isRecall={true}
            />

            <AnswerOptions
              options={options}
              selected={selectedAnswers}
              maxSelections={round.missingWords.length}
              onToggle={toggleAnswer}
              onSubmit={submitAnswers}
            />
          </section>
        )}

        {/* 5. Round Review Screen */}
        {screen === "round-review" && roundResult && (
          <RoundReview
            currentRound={currentRoundNum}
            totalRounds={totalRounds}
            roundResult={roundResult}
            levelInfo={round?.level}
            accumulatedScore={accumulatedScore - roundResult.score}
            isLastRound={currentRoundNum >= totalRounds}
            onContinue={advanceFromReview}
            onExit={returnToWelcome}
          />
        )}

        {/* 6. Final Results Screen */}
        {screen === "results" && gameConfig && (
          <ResultsScreen
            playerName={gameConfig.playerName}
            level={levelNumber}
            levelInfo={gameConfig.level}
            score={accumulatedScore}
            accuracy={overallAccuracy}
            correctAnswers={totalCorrectAnswers}
            totalAnswers={totalPossibleAnswers}
            roundHistory={roundHistory}
            onReplay={replayGame}
            onSetup={returnToSetup}
          />
        )}
      </main>

      <footer className="app-footer notebook-footer">
        <div className="footer-left">
          <strong>Kim’s Game</strong>
          <span>• Look closely. Remember more.</span>
        </div>
        <div className="footer-author">
          <span>Crafted by </span>
          <a
            href="https://www.linkedin.com/in/harsh-mrigank-a29584277"
            target="_blank"
            rel="noopener noreferrer"
            className="author-linkedin-link"
          >
            <span className="linkedin-badge-mark" aria-hidden="true">in</span>
            <strong>Harsh Mrigank</strong>
          </a>
        </div>
      </footer>

      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStart={() => {
          setShowWelcome(false);
          setScreen("setup");
        }}
      />
    </div>
  );
}
