export default function WelcomeModal({ isOpen, onClose, onStart }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close instructions"
          onClick={onClose}
        >
          ×
        </button>

        <span className="eyebrow">PREPARE YOUR BRAIN CELLS</span>

        <h2 id="welcome-title">Welcome to Kim's Game</h2>

        <p className="muted">
          Prove your memory isn't as fried as you think. Stare at the words, 
          catch what vanishes into thin air, and try not to panic when the timer hits zero.
        </p>

        {/* Enhanced Visual Demo section */}
        <div className="demo-box">
          <p className="demo-caption">How it works:</p>
          <div className="demo-cards" aria-label="Example word cards">
            <span className="demo-tag">Apple</span>
            <span className="demo-tag">River</span>
            <span className="demo-tag demo-missing" title="This one vanished!">Guitar 💨</span>
            <span className="demo-tag">Mountain</span>
          </div>
        </div>

        <div className="instruction-steps">
          <div>
            <span>01</span>
            <p><strong>Memorize:</strong> Stare down the words before the shrinking clock runs out.</p>
          </div>

          <div>
            <span>02</span>
            <p><strong>Hunt:</strong> Pick out the exact words that magically disappeared from the screen.</p>
          </div>

          <div>
            <span>03</span>
            <p><strong>Survive:</strong> Earn 10 points per correct pick and unlock even more insulting levels.</p>
          </div>
        </div>

        <button
          className="button button-primary button-full"
          type="button"
          onClick={onStart}
        >
          I'm ready to be humbled →
        </button>
      </section>
    </div>
  );
}