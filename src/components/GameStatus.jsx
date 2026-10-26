export function GameStatus({ mode, currentPlayer, status, winner }) {
  let message;
  let detail;

  if (status === 'won') {
    message = mode === 'Computer' && winner === 'O'
      ? 'Computer wins!'
      : `Player ${winner} wins!`;
    detail = 'Reset the game to play again.';
  } else if (status === 'draw') {
    message = "It's a draw!";
    detail = 'A close game. Reset to play again.';
  } else {
    message = mode === 'Computer' && currentPlayer === 'O'
      ? 'Computer is thinking…'
      : mode === 'Computer'
        ? 'Your turn'
        : `Player ${currentPlayer}'s turn`;
    detail = mode === 'Computer'
      ? 'You play X. The computer plays O.'
      : 'Take turns and make three in a row.';
  }

  return (
    <div className={`status-card${status !== 'playing' ? ' status-complete' : ''}`} aria-live="polite">
      <div className="status-symbol" aria-hidden="true">
        {status === 'won' ? winner : status === 'draw' ? '＝' : currentPlayer}
      </div>
      <div>
        <p className="status-label">{status === 'playing' ? 'CURRENT TURN' : 'GAME RESULT'}</p>
        <h2>{message}</h2>
        <p className="status-detail">{detail}</p>
      </div>
    </div>
  );
}
