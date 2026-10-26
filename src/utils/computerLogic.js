import { checkWinner } from './gameLogic';

function findWinningCell(board, player) {
  for (let index = 0; index < 9; index += 1) {
    const row = Math.floor(index / 3);
    const column = index % 3;
    if (board[row][column] !== null) continue;

    const candidate = board.map((boardRow) => [...boardRow]);
    candidate[row][column] = player;
    if (checkWinner(candidate)) return index;
  }
  return null;
}

export function getComputerMove(board) {
  if (!Array.isArray(board) || board.length !== 3 || board.some((row) => !Array.isArray(row) || row.length !== 3)) {
    throw new TypeError('The computer requires a 3 by 3 board.');
  }

  const winningMove = findWinningCell(board, 'O');
  if (winningMove !== null) return winningMove;

  const blockingMove = findWinningCell(board, 'X');
  if (blockingMove !== null) return blockingMove;

  if (board[1][1] === null) return 4;

  for (const index of [0, 2, 6, 8]) {
    if (board[Math.floor(index / 3)][index % 3] === null) return index;
  }

  for (let index = 0; index < 9; index += 1) {
    if (board[Math.floor(index / 3)][index % 3] === null) return index;
  }

  return null;
}
