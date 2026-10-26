export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const createEmptyBoard = () => Array.from({ length: 3 }, () => Array(3).fill(null));

export function checkWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [first, second, third] = combination;
    const firstValue = board[Math.floor(first / 3)][first % 3];
    if (
      firstValue &&
      firstValue === board[Math.floor(second / 3)][second % 3] &&
      firstValue === board[Math.floor(third / 3)][third % 3]
    ) {
      return { winner: firstValue, winningCells: combination };
    }
  }
  return null;
}

export function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== null));
}
