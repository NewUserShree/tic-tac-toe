import './App.css';
import { useState } from 'react';

import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameStatus } from './components/GameStatus';
import { MoveHistory } from './components/MoveHistory';
import { Scoreboard } from './components/Scoreboard';
import { useGame } from './hooks/useGame';

function App() {
  const {
    game,
    scoreboard,
    storageMessage,
    changeMode,
    play,
    undo,
    resetGame,
    resetScoreboard,
  } = useGame();

  // Track undo usage for each player.
  const [undoUsed, setUndoUsed] = useState({
    X: false,
    O: false,
  });

  // Get the most recent move.
  const lastMove =
    game.moveHistory.length > 0
      ? game.moveHistory[game.moveHistory.length - 1]
      : null;

  // Determine whether Undo is available.
  const canUndo =
    game.status === 'playing' &&
    lastMove !== null &&
    (game.mode === 'Computer'
      ? !undoUsed.X
      : !undoUsed[lastMove.player]);

  // Handle Undo.
  const handleUndo = () => {
    if (!canUndo) return;

    if (game.mode === 'Computer') {
      // One undo chance for the human player.
      setUndoUsed((prev) => ({
        ...prev,
        X: true,
      }));
    } else {
      // Consume the undo chance of the player
      // whose move is being undone.
      setUndoUsed((prev) => ({
        ...prev,
        [lastMove.player]: true,
      }));
    }

    undo();
  };

  // Start a new game and restore undo chances.
  const handleReset = () => {
    resetGame();

    setUndoUsed({
      X: false,
      O: false,
    });
  };

  // Change mode and restore undo chances.
  const handleModeChange = (newMode) => {
    changeMode(newMode);

    setUndoUsed({
      X: false,
      O: false,
    });
  };

  // Reset the scoreboard only after confirmation.
  const handleResetScoreboard = () => {
      resetScoreboard();
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          

          <h1>Tic Tac Toe</h1>
          <p className="subtitle">Three in a row. One legendary showdown.</p>
        </div>

        <label className="mode-picker" htmlFor="game-mode">
          <span>Game mode</span>

          <select
            id="game-mode"
            value={game.mode}
            onChange={(event) =>
              handleModeChange(event.target.value)
            }
          >
            <option value="TwoPlayer">Two Player</option>
            <option value="Computer">
              Play Against Computer
            </option>
          </select>
        </label>
      </header>

      {storageMessage && (
        <p className="storage-message" role="status">
          {storageMessage}
        </p>
      )}

      <main className="app-layout">
        <section
          className="panel game-panel"
          aria-label="Current game"
        >
          <GameStatus
            mode={game.mode}
            currentPlayer={game.currentPlayer}
            status={game.status}
            winner={game.winner}
          />

          <GameBoard
            board={game.board}
            winningCells={game.winningCells}
            disabled={
              game.status !== 'playing' ||
              (game.mode === 'Computer' &&
                game.currentPlayer === 'O')
            }
            onCellClick={play}
          />

          <GameControls
            mode={game.mode}
            onModeChange={handleModeChange}
            onReset={handleReset}
            onUndo={handleUndo}
            canUndo={Boolean(canUndo)}
          />
        </section>

        <aside className="sidebar">
          <Scoreboard
            scoreboard={scoreboard}
            onReset={handleResetScoreboard}
          />

          <MoveHistory history={game.moveHistory} />
        </aside>
      </main>

      <footer className="app-footer">
        Runs entirely in your browser. No backend or account
        required.
      </footer>
    </div>
  );
}

export default App;
