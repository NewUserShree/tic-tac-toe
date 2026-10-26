import { GameCell } from './GameCell';

export function GameBoard({ board, winningCells, disabled, onCellClick }) {
  return (
    <div className="board" role="group" aria-label="Tic Tac Toe board">
      {board.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const index = rowIndex * 3 + columnIndex;
          return (
            <GameCell
              key={index}
              index={index}
              row={rowIndex}
              column={columnIndex}
              value={cell}
              isWinning={winningCells.includes(index)}
              disabled={disabled || cell !== null}
              onClick={onCellClick}
            />
          );
        })
      )}
    </div>
  );
}
