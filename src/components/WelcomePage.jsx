import { useState, useEffect, useRef } from "react";

export default function WelcomePage({ onGoToSetup }) {
  // Interactive Mini Demo State
  const [demoPhase, setDemoPhase] = useState("idle"); // 'idle' | 'memorise' | 'vanish' | 'solved'
  const [demoSelected, setDemoSelected] = useState(null);
  const [demoTimer, setDemoTimer] = useState(3);
  const demoIntervalRef = useRef(null);

  // Cleanup demo timer on unmount
  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, []);

  function handleStartDemo() {
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    setDemoSelected(null);
    setDemoTimer(3);
    setDemoPhase("memorise");

    let count = 3;
    demoIntervalRef.current = setInterval(() => {
      count -= 1;
      setDemoTimer(count);
      if (count <= 0) {
        clearInterval(demoIntervalRef.current);
        setDemoPhase("vanish");
      }
    }, 1000);
  }

  function handleDemoSelect(word) {
    setDemoSelected(word);
    if (word === "Feather") {
      setDemoPhase("solved");
    }
  }

  function handleResetDemo() {
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    setDemoPhase("idle");
    setDemoSelected(null);
    setDemoTimer(3);
  }

  return (
    <div className="welcome-page-container">
      {/* 1. Hero Section */}
      <section className="welcome-hero notebook-section">
        <div className="hero-grid">
          <div className="hero-text-col">
            <div className="badge-pill">
              <span className="badge-dot"></span>
              <span>TRADITIONAL MEMORY & OBSERVATION PRACTICE</span>
            </div>

            <h1 className="hero-title">
              Look closely.
              <br />
              <span className="handwritten-accent">Remember more.</span>
            </h1>

            <p className="hero-lead">
              A classic memory exercise dating back to 1901. Study the flashcards, notice which
              items disappear, and sharpen your visual attention one round at a time.
            </p>

            <div className="hero-cta-group">
              <button
                className="button button-primary button-lg hero-play-btn"
                type="button"
                onClick={onGoToSetup}
              >
                <span>Play Now</span>
                <span aria-hidden="true">→</span>
              </button>

              <button
                className="button button-ghost hero-demo-btn"
                type="button"
                onClick={handleStartDemo}
              >
                <span>Try Demo</span>
                <span className="btn-sparkle">✨</span>
              </button>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-pill">
                <strong>10</strong>
                <span>Difficulty Levels</span>
              </div>
              <div className="hero-stat-pill">
                <strong>100%</strong>
                <span>Free & Client-Side</span>
              </div>
              <div className="hero-stat-pill">
                <strong>1901</strong>
                <span>Kipling’s Origin</span>
              </div>
            </div>
          </div>

          {/* Interactive Mini-Demo Box */}
          <div className="hero-demo-col">
            <div className="interactive-demo-card">
              <div className="demo-tape" aria-hidden="true"></div>

              <div className="demo-header-row">
                <span className="demo-eyebrow">INTERACTIVE PREVIEW</span>
                {demoPhase === "memorise" && (
                  <span className="demo-timer-badge">Study: {demoTimer}s</span>
                )}
                {demoPhase === "vanish" && (
                  <span className="demo-timer-badge demo-vanish-tag">What vanished?</span>
                )}
                {demoPhase === "solved" && (
                  <span className="demo-timer-badge demo-success-tag">✓ Correct!</span>
                )}
              </div>

              <p className="demo-instruction-text">
                {demoPhase === "idle" &&
                  "Tap 'Try Demo' to watch how cards appear, disappear, and test your recall."}
                {demoPhase === "memorise" &&
                  "Memorise these 4 cards before the clock ticks down!"}
                {demoPhase === "vanish" &&
                  "One item just disappeared! Which word was removed?"}
                {demoPhase === "solved" &&
                  "Spot on! In the real game, you’ll earn 10 points for every missing word identified."}
              </p>

              {/* Cards layout */}
              <div className="mini-demo-grid">
                <div className="mini-card mini-card-yellow">
                  <span className="mini-num">01</span>
                  <strong>Lantern</strong>
                </div>

                <div className="mini-card mini-card-blue">
                  <span className="mini-num">02</span>
                  <strong>Compass</strong>
                </div>

                {demoPhase === "vanish" || demoPhase === "solved" ? (
                  <div className="mini-card mini-card-vanished">
                    <span className="mini-num">03</span>
                    <span className="vanish-puff">💨</span>
                    <small>Disappeared</small>
                  </div>
                ) : (
                  <div className="mini-card mini-card-coral">
                    <span className="mini-num">03</span>
                    <strong>Feather</strong>
                  </div>
                )}

                <div className="mini-card mini-card-mint">
                  <span className="mini-num">04</span>
                  <strong>Key</strong>
                </div>
              </div>

              {/* Interaction zone */}
              {demoPhase === "vanish" && (
                <div className="demo-choices-row">
                  {["Key", "Feather", "Mirror", "Lantern"].map((word) => (
                    <button
                      key={word}
                      type="button"
                      className={`demo-choice-chip ${
                        demoSelected === word
                          ? word === "Feather"
                            ? "choice-correct"
                            : "choice-wrong"
                          : ""
                      }`}
                      onClick={() => handleDemoSelect(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}

              {demoPhase === "solved" && (
                <div className="demo-success-banner">
                  <span>🎉 Great observation! You’re ready for the full challenge.</span>
                </div>
              )}

              <div className="demo-controls-row">
                {demoPhase === "idle" ? (
                  <button
                    className="button button-doodle button-sm"
                    type="button"
                    onClick={handleStartDemo}
                  >
                    ▶ Try Demo (5 sec)
                  </button>
                ) : (
                  <button
                    className="button button-ghost button-sm"
                    type="button"
                    onClick={handleResetDemo}
                  >
                    ↺ Reset Demo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How to Play Section */}
      <section className="notebook-section how-to-play-section">
        <div className="section-title-wrap">
          <span className="eyebrow">RULES & METHODOLOGY</span>
          <h2>How to Play Kim’s Game</h2>
          <p className="muted">
            The rules are simple, but the cognitive demand ramps up quickly as levels increase.
          </p>
        </div>

        <div className="steps-cards-grid">
          <div className="step-card">
            <div className="step-card-number">01</div>
            <h3>Observe & Memorise</h3>
            <p>
              A grid of flashcards is presented on the desk. You have a strict countdown timer
              (from 8s down to 3s, depending on difficulty) to commit as many items to memory as possible.
            </p>
            <span className="step-tip">💡 Tip: Group words into quick mental associations.</span>
          </div>

          <div className="step-card">
            <div className="step-card-number">02</div>
            <h3>Detect What Vanished</h3>
            <p>
              When the timer expires, a set number of cards are quietly whisked away. Compare the
              remaining visible cards against the memory traces in your mind to deduce what is missing.
            </p>
            <span className="step-tip">💡 Tip: Scan the empty card slots to recall spatial positions.</span>
          </div>

          <div className="step-card">
            <div className="step-card-number">03</div>
            <h3>Recall & Score</h3>
            <p>
              Select the missing words from the answer options before the recall clock expires.
              Earn 10 points for each correctly identified missing word. Distractors give zero points.
            </p>
            <span className="step-tip">💡 Tip: Eliminate distractors you know were not on the board.</span>
          </div>
        </div>
      </section>

      {/* 3. Cognitive Science & Research Section */}
      <section className="notebook-section cognitive-science-section">
        <div className="section-title-wrap">
          <span className="eyebrow">COGNITIVE PSYCHOLOGY & EVIDENCE</span>
          <h2>The Science of Memory & Observation Training</h2>
          <p className="muted">
            Understanding working memory capacity, active recall, and what cognitive research actually shows.
          </p>
        </div>

        <div className="science-cards-grid">
          <div className="science-card">
            <span className="science-icon">🧠</span>
            <h3>Working Memory & Capacity Limits</h3>
            <p>
              In cognitive psychology, working memory holds information temporarily for processing.
              George A. Miller’s landmark 1956 paper (<em>The Magical Number Seven, Plus or Minus Two</em>)
              and Nelson Cowan’s subsequent research (2001) demonstrate that humans typically hold
              between 4 and 7 distinct chunks in active visual-verbal memory. Kim’s Game pushes this
              exact capacity boundary as card counts scale from 8 up to 45.
            </p>
          </div>

          <div className="science-card">
            <span className="science-icon">⚡</span>
            <h3>Active Recall & The Testing Effect</h3>
            <p>
              Educational psychology has consistently demonstrated the <em>Testing Effect</em>
              (Roediger & Karpicke, 2006). Actively retrieving information from memory strengthens
              neural retrieval pathways significantly more than passive re-reading. In Kim’s Game,
              generating the missing item from memory engages active retrieval rather than passive recognition.
            </p>
          </div>

          <div className="science-card">
            <span className="science-icon">🎯</span>
            <h3>Visual Search & Focused Attention</h3>
            <p>
              Rapidly scanning flashcards under time pressure exercises selective attention and
              inhibition—filtering irrelevant thoughts while scanning targets. Players intuitively
              learn mnemonic strategies like semantic chunking and spatial loci to maximize retention.
            </p>
          </div>
        </div>

        {/* Evidence Distinction Box */}
        <div className="evidence-distinction-box">
          <div className="distinction-header">
            <span className="distinction-pin">📌</span>
            <h3>Scientific Honesty: What Is Proven vs. What Is Not</h3>
          </div>

          <div className="distinction-columns">
            <div className="distinction-col distinction-proven">
              <h4>✓ Scientifically Supported</h4>
              <ul>
                <li>
                  <strong>Task-Specific Improvement:</strong> Practice consistently improves observation speed, mnemonic chunking, and memory performance on comparable visual recall tasks.
                </li>
                <li>
                  <strong>Attentional Focus:</strong> Timed recall exercises cultivate disciplined, deliberate scanning habits and reduce visual distractibility during tasks.
                </li>
                <li>
                  <strong>Retrieval Practice:</strong> Engaging in effortful recall reinforces retrieval pathways far better than passive re-exposure.
                </li>
              </ul>
            </div>

            <div className="distinction-col distinction-unproven">
              <h4>✗ Not Scientifically Proven (No Overpromising)</h4>
              <ul>
                <li>
                  <strong>No Proven General IQ Increase:</strong> Extensive meta-analyses (e.g. Simons et al., 2016) show brain games do not reliably elevate general intelligence (\(g\)-factor) or transfer broadly to unrelated cognitive disciplines.
                </li>
                <li>
                  <strong>No Clinical Prevention of Dementia:</strong> Playing Kim’s Game cannot be claimed to prevent Alzheimer’s, dementia, or clinical neurodegeneration without rigorous clinical trial evidence.
                </li>
                <li>
                  <strong>No Permanent Photographic Memory:</strong> Memory span increases reflect better chunking techniques, not fundamental alterations to biological memory limits.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Historical Origins & References Section */}
      <section className="notebook-section origins-references-section">
        <div className="section-title-wrap">
          <span className="eyebrow">HISTORICAL TIMELINE & CITATIONS</span>
          <h2>Origins of Kim’s Game</h2>
          <p className="muted">
            From British India espionage fiction to Scouting manuals and elite military reconnaissance.
          </p>
        </div>

        <div className="history-timeline">
          <div className="history-item">
            <div className="history-date">1901</div>
            <div className="history-content">
              <h4>Rudyard Kipling’s <em>Kim</em> (The Jewel Game)</h4>
              <p>
                In Chapter IX of Kipling’s classic novel, the young protagonist Kim is trained in Simla
                by the British intelligence operative Mr. Lurgan. Lurgan tosses fifteen jewels onto a copper
                tray, gives Kim a minute to observe, then covers the tray with paper, commanding him to
                name every jewel and its flaws. Lurgan insists: <em>“Do it many times over till it is done perfectly — for it is worth doing.”</em>
              </p>
              <a
                href="https://en.wikipedia.org/wiki/Kim%27s_Game"
                target="_blank"
                rel="noreferrer"
                className="ref-link"
              >
                Read Wikipedia Entry on Kim’s Game ↗
              </a>
            </div>
          </div>

          <div className="history-item">
            <div className="history-date">1921</div>
            <div className="history-content">
              <h4>Sir Robert Baden-Powell & <em>Scouting Games</em></h4>
              <p>
                Robert Baden-Powell, founder of the worldwide Scout Movement, adapted Kipling’s jewel
                exercise into Chapter IV of his handbook <em>Scouting Games</em>. Scoutmasters placed knives,
                spoons, pencils, and stones on a tray covered with a cloth, uncovering it for 60 seconds
                to train young scouts in observation, situational awareness, and visual recall.
              </p>
              <a
                href="https://en.wikipedia.org/wiki/Scouting_Games"
                target="_blank"
                rel="noreferrer"
                className="ref-link"
              >
                Scouting Games Reference (Sir Robert Baden-Powell) ↗
              </a>
            </div>
          </div>

          <div className="history-item">
            <div className="history-date">Modern</div>
            <div className="history-content">
              <h4>Military Scout Sniper Training (“Keep In Memory”)</h4>
              <p>
                The exercise remains an active curriculum requirement at the United States Marine Corps
                (USMC) Scout Sniper Instructor School in Quantico, Virginia, as well as Camp Lejeune and
                Camp Pendleton. It is also utilized by the British Royal Marines Commandos under the
                backronym <strong>K.I.M.</strong>: <em>“Keep In Memory.”</em>
              </p>
              <a
                href="https://en.wikipedia.org/wiki/United_States_Marine_Corps_Scout_Sniper"
                target="_blank"
                rel="noreferrer"
                className="ref-link"
              >
                USMC Scout Sniper & Tactical Observation Curriculum ↗
              </a>
            </div>
          </div>
        </div>

        {/* References citations list */}
        <div className="academic-references-box">
          <h4>Academic & Historical References:</h4>
          <ol className="citations-list">
            <li>
              Kipling, R. (1901). <em>Kim</em>. London: Macmillan & Co. Ltd. (Chapter IX: The Play of the Jewels).
            </li>
            <li>
              Baden-Powell, R. S. S. (1921). <em>Scouting Games</em>. Chapter IV: Observation Games.
            </li>
            <li>
              Miller, G. A. (1956). The magical number seven, plus or minus two: Some limits on our capacity for processing information. <em>Psychological Review</em>, 63(2), 81–97.
            </li>
            <li>
              Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. <em>Behavioral and Brain Sciences</em>, 24(1), 87–114.
            </li>
            <li>
              Roediger, H. L., & Karpicke, J. D. (2006). The power of testing memory: Basic research and implications for educational practice. <em>Perspectives on Psychological Science</em>, 1(3), 181–210.
            </li>
            <li>
              Simons, D. J., et al. (2016). Do “brain-training” programs work? <em>Psychological Science in the Public Interest</em>, 17(3), 103–186.
            </li>
          </ol>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="welcome-bottom-cta">
        <div className="bottom-cta-sheet">
          <h2>Ready to test your observation?</h2>
          <p className="muted">
            Choose your difficulty level from 1 to 10 and challenge your working memory.
          </p>
          <button
            className="button button-primary button-xl"
            type="button"
            onClick={onGoToSetup}
          >
            Start Playing Now →
          </button>
        </div>
      </section>
    </div>
  );
}
