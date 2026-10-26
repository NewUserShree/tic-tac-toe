export function GameControls({
  mode,
  onModeChange,
  onReset,
  onUndo,
  canUndo,
}) {
  return (
    <div className="game-controls">
      <button
        className="button button-primary"
        type="button"
        onClick={onReset}
      >
        New Game
      </button>

      <button
        className="button button-secondary"
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title={
          canUndo
            ? 'Undo your last move'
            : 'Undo is unavailable or your undo chance has been used'
        }
      >
        Undo Last Move
      </button>

      <span className="mode-summary">
        {mode === 'Computer'
          ? 'You: X · Computer: O'
          : 'Two players · X starts'}
      </span>
    </div>
  );
}
