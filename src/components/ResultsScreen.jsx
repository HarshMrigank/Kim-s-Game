import { useState } from "react";
import { createReportScreenshotBlob } from "../utils/generateScreenshot";

export default function ResultsScreen({
  playerName,
  level,
  levelInfo = null,
  score,
  accuracy,
  correctAnswers,
  totalAnswers,
  roundHistory = [],
  onReplay,
  onSetup,
}) {
  const [sharing, setSharing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Evaluation title & badge based on accuracy
  let ratingTitle = "Observation Apprentice";
  let ratingBadge = "🌱";
  let feedbackNote =
    "Good effort! Regular recall practice trains your brain to group and notice details more effectively.";

  if (accuracy >= 90) {
    ratingTitle = "Master Spy / Scout Sniper";
    ratingBadge = "🎖️";
    feedbackNote =
      "Outstanding observation! Lurgan Sahib and Robert Baden-Powell would be proud of this situational recall.";
  } else if (accuracy >= 75) {
    ratingTitle = "Sharp-Eyed Observer";
    ratingBadge = "🔍";
    feedbackNote =
      "Impressive memory span! You retained the majority of items under strict time limits.";
  } else if (accuracy >= 50) {
    ratingTitle = "Solid Recall Specialist";
    ratingBadge = "⚡";
    feedbackNote =
      "Well done! Try chunking related words into mental stories or spatial groups on your next run.";
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  }

  // Share screenshot of record rather than link
  async function handleShareScreenshot() {
    setSharing(true);
    try {
      const blob = await createReportScreenshotBlob({
        playerName: playerName || "Observer",
        level: level || 1,
        tier: levelInfo?.tier || (level <= 2 ? "Beginner" : level <= 4 ? "Easy" : level <= 6 ? "Intermediate" : level <= 8 ? "Hard" : "Expert"),
        levelName: levelInfo?.name || "",
        score: score ?? 0,
        accuracy: Math.round(accuracy ?? 0),
        correctAnswers: correctAnswers ?? 0,
        totalAnswers: totalAnswers ?? 0,
        roundsCount: roundHistory.length || 1,
        ratingTitle,
        ratingBadge,
      });

      if (!blob) {
        throw new Error("Could not generate report screenshot.");
      }

      const fileName = `kims-game-${(playerName || "observer").toLowerCase().replace(/\s+/g, "_")}-score.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // Check if browser/mobile device supports native file sharing
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Kim's Game Observation Report",
          text: `Check out my observation record in Kim's Game! Scored ${score} points on "${levelInfo?.name || "Memory Challenge"}".`,
          files: [file],
        });
        showToast("✓ Screenshot shared successfully!");
        return;
      }

      // Fallback: download the PNG screenshot directly & attempt clipboard write
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          showToast("📸 Screenshot downloaded & copied to clipboard!");
          return;
        } catch {
          // Clipboard write might be restricted by user permissions
        }
      }

      showToast("📸 Screenshot downloaded! Ready to share or post.");
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast("⚠️ Could not share screenshot automatically.");
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <section className="results-card notebook-report-card" aria-label="Game results">
      <div className="report-stamp-wrap" aria-hidden="true">
        <div className="notebook-stamp">
          <span className="stamp-symbol">{ratingBadge}</span>
          <span className="stamp-text">{ratingTitle}</span>
        </div>
      </div>

      <span className="eyebrow">FINAL PERFORMANCE REPORT</span>

      <h1 className="results-title">Well played, {playerName || "Observer"}.</h1>

      <p className="muted results-subtitle">
        “{levelInfo?.name || "Memory Challenge"}” Complete • {roundHistory.length || 1} Round
        {roundHistory.length === 1 ? "" : "s"} Finished
      </p>

      {/* Main Score Display */}
      <div className="score-display">
        <span className="score-caption">Total Points Earned</span>
        <strong className="score-number">{score ?? 0}</strong>
        <small className="score-subtext">
          {score > 0 ? `${score / 10} words correctly retrieved` : "Keep practicing!"}
        </small>
      </div>

      {/* Stats Grid */}
      <div className="results-stats">
        <div className="stat-box">
          <strong>{Math.round(accuracy ?? 0)}%</strong>
          <span>Overall Accuracy</span>
        </div>

        <div className="stat-box">
          <strong>
            {correctAnswers ?? 0} / {totalAnswers ?? 0}
          </strong>
          <span>Correct Words</span>
        </div>

        <div className="stat-box">
          <strong className="stat-level-name">
            {levelInfo?.icon} {levelInfo?.name || "Challenge"}
          </strong>
          <span>Challenge Tier</span>
        </div>
      </div>

      <div className="report-note-box">
        <span className="note-pin" aria-hidden="true">📌</span>
        <p><strong>Observer Assessment:</strong> {feedbackNote}</p>
      </div>

      {roundHistory.length > 1 && (
        <div className="round-history-recap">
          <h3>Session Round Breakdown</h3>
          <div className="recap-table-wrap">
            <table className="recap-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Points</th>
                  <th>Correct</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {roundHistory.map((r, i) => (
                  <tr key={i}>
                    <td>Round {r.roundNumber || i + 1}</td>
                    <td>+{r.scoreEarned}</td>
                    <td>
                      {r.correctCount} / {r.totalCount}
                    </td>
                    <td>{Math.round(r.accuracy)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="share-toast" role="status">
          {toastMsg}
        </div>
      )}

      <div className="results-actions">
        <button
          className="button button-doodle button-lg"
          type="button"
          disabled={sharing}
          onClick={handleShareScreenshot}
        >
          <span>{sharing ? "Generating Image... ⏳" : "Share Record Screenshot 📸"}</span>
        </button>

        <button
          className="button button-primary button-lg"
          type="button"
          onClick={onReplay}
        >
          Play Again ↺
        </button>

        <button
          className="button button-ghost button-lg"
          type="button"
          onClick={onSetup}
        >
          Change Setup / Difficulty
        </button>
      </div>
    </section>
  );
}
