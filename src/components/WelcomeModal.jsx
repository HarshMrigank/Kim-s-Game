import { markInstructionsSeen } from "../utils/storage";

export default function WelcomeModal({ isOpen, onClose, onStart }) {
  if (!isOpen) {
    return null;
  }

  function handleDismiss() {
    markInstructionsSeen();
    if (onStart) {
      onStart();
    } else {
      onClose();
    }
  }

  function handleCloseOnly() {
    markInstructionsSeen();
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleCloseOnly();
        }
      }}
      role="presentation"
    >
      <section
        className="welcome-modal notebook-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close instructions"
          onClick={handleCloseOnly}
        >
          ✕
        </button>

        <div className="modal-header-tape" aria-hidden="true"></div>

        <span className="eyebrow">THE NOTEBOOK BRIEFING</span>

        <h2 id="welcome-title">Welcome to Kim’s Game</h2>

        <p className="welcome-desc">
          Inspired by Rudyard Kipling’s 1901 novel <em>Kim</em> and Robert Baden-Powell’s
          famous scout training, this classic exercise tests how quickly you can observe,
          retain, and recall details under pressure.
        </p>

        {/* Visual demo illustration */}
        <div className="demo-box notebook-paper-box">
          <div className="demo-box-header">
            <span className="demo-caption">Visual Walkthrough:</span>
            <span className="demo-step-badge">Try noticing what vanishes</span>
          </div>

          <div className="demo-cards" aria-label="Example flashcards showing one item disappearing">
            <div className="demo-card demo-card-1">
              <span className="demo-num">01</span>
              <strong>Lantern</strong>
            </div>
            <div className="demo-card demo-card-2">
              <span className="demo-num">02</span>
              <strong>Compass</strong>
            </div>
            <div className="demo-card demo-card-missing" title="This item vanished!">
              <span className="demo-num">03</span>
              <strong className="vanished-word">Feather</strong>
              <span className="vanish-badge">💨 Vanished!</span>
            </div>
            <div className="demo-card demo-card-4">
              <span className="demo-num">04</span>
              <strong>Key</strong>
            </div>
          </div>
        </div>

        {/* 3 Steps */}
        <div className="instruction-steps">
          <div className="step-item">
            <span className="step-num">1</span>
            <div>
              <strong>Study & Memorise:</strong>
              <p>Flashcards appear on the table for a few seconds. Absorb as many words as you can.</p>
            </div>
          </div>

          <div className="step-item">
            <span className="step-num">2</span>
            <div>
              <strong>Spot What Disappeared:</strong>
              <p>A few words are quietly whisked away. Compare the empty spaces against your memory.</p>
            </div>
          </div>

          <div className="step-item">
            <span className="step-num">3</span>
            <div>
              <strong>Select & Score:</strong>
              <p>Choose the missing items from the options list before the answer timer runs out. Earn 10 points per correct word.</p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="button button-primary button-full"
            type="button"
            onClick={handleDismiss}
          >
            Let’s Play! →
          </button>
        </div>
      </section>
    </div>
  );
}