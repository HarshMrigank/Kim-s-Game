
export default function GameHeader({ onInstructions }) {
  return (
    <header className="app-header">
      <a
        className="brand"
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          window.location.hash = "home";
        }}
      >
        <span className="brand-mark">K</span>

        <span>
          <strong>Kim's Game</strong>
          <small>Memory training</small>
        </span>
      </a>

      <button
        className="button button-ghost"
        onClick={onInstructions}
        type="button"
      >
        How to play
      </button>
    </header>
  );
}
