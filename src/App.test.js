import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { getComputerMove } from './utils/computerLogic';
import { checkWinner, createEmptyBoard, isBoardFull } from './utils/gameLogic';

beforeEach(() => {
  window.localStorage.clear();
  jest.useRealTimers();
  window.confirm = jest.fn(() => true);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('renders the game and starts with X', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Tic Tac Toe' })).toBeInTheDocument();
  expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 1, empty/i })).toBeEnabled();
  expect(screen.getByRole('button', { name: /undo last move/i })).toBeDisabled();
});

test('makes two-player moves, alternates turns, and records history', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  expect(screen.getByText("Player O's turn")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 1, x/i })).toBeDisabled();
  expect(screen.getByText('Row 1, Column 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 1, x/i })).toHaveTextContent('X');

  fireEvent.click(screen.getByRole('button', { name: /row 2, column 2, empty/i }));
  expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  expect(screen.getByText('2 moves')).toBeInTheDocument();
});

test('detects and highlights a win and updates the score only once', () => {
  render(<App />);

  [
    [0, 0], [1, 0],
    [0, 1], [1, 1],
    [0, 2],
  ].forEach(([row, column]) => {
    fireEvent.click(screen.getByRole('button', {
      name: new RegExp(`row ${row + 1}, column ${column + 1}, empty`, 'i'),
    }));
  });

  expect(screen.getByText('Player X wins!')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 1, x/i })).toHaveClass('cell-winning');
  expect(screen.getByRole('button', { name: /row 1, column 2, x/i })).toHaveClass('cell-winning');
  expect(screen.getByRole('button', { name: /row 1, column 3, x/i })).toHaveClass('cell-winning');
  expect(screen.getByText('1', { selector: '.score-item strong' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 3, column 3, empty/i })).toBeDisabled();
  expect(window.localStorage.getItem('tic-tac-toe-scoreboard')).toContain('"xWins":1');
});

test('undo removes one two-player move and restores that player turn', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /row 2, column 2, empty/i }));

  fireEvent.click(screen.getByRole('button', { name: /undo last move/i }));

  expect(screen.getByText("Player O's turn")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 2, column 2, empty/i })).toBeEnabled();
  expect(screen.getByText('1 move')).toBeInTheDocument();
});

test('reset game clears game state but preserves scoreboard', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 2, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 3, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /row 2, column 1, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /row 2, column 2, empty/i }));

  const score = window.localStorage.getItem('tic-tac-toe-scoreboard');
  fireEvent.click(screen.getByRole('button', { name: /new game/i }));

  expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  expect(screen.getByText('Your moves will appear here.')).toBeInTheDocument();
  expect(window.localStorage.getItem('tic-tac-toe-scoreboard')).toBe(score);
});

test('scoreboard reset asks for confirmation and resets all counters', () => {
  window.localStorage.setItem('tic-tac-toe-scoreboard', JSON.stringify({ xWins: 4, oWins: 2, draws: 1 }));
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /reset scoreboard/i }));
  expect(window.confirm).toHaveBeenCalled();
  expect(screen.getAllByText('0', { selector: '.score-item strong' })).toHaveLength(3);
  expect(JSON.parse(window.localStorage.getItem('tic-tac-toe-scoreboard'))).toEqual({
    xWins: 0, oWins: 0, draws: 0,
  });
});

test('canceling scoreboard reset leaves saved values unchanged', () => {
  window.localStorage.setItem('tic-tac-toe-scoreboard', JSON.stringify({ xWins: 4, oWins: 2, draws: 1 }));
  window.confirm.mockReturnValue(false);
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /reset scoreboard/i }));
  expect(screen.getByText('4', { selector: '.score-item strong' })).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem('tic-tac-toe-scoreboard')).xWins).toBe(4);
});

test('switching mode creates a fresh game and computer answers after a delay', () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.change(screen.getByLabelText(/game mode/i), { target: { value: 'Computer' } });
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  expect(screen.getByText('Computer is thinking…')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 2, empty/i })).toBeDisabled();

  act(() => jest.advanceTimersByTime(550));
  expect(screen.getByRole('button', { name: /row 2, column 2, o/i })).toBeInTheDocument();
  expect(screen.getByText('2 moves')).toBeInTheDocument();
});

test('undo in computer mode removes the human move and cancels its pending response', () => {
  jest.useFakeTimers();
  render(<App />);
  fireEvent.change(screen.getByLabelText(/game mode/i), { target: { value: 'Computer' } });
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /undo last move/i }));
  act(() => jest.advanceTimersByTime(600));

  expect(screen.getByText('Your turn')).toBeInTheDocument();
  expect(screen.getByText('Your moves will appear here.')).toBeInTheDocument();
});

test('reset while the computer is waiting prevents a stale computer move', () => {
  jest.useFakeTimers();
  render(<App />);
  fireEvent.change(screen.getByLabelText(/game mode/i), { target: { value: 'Computer' } });
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  fireEvent.click(screen.getByRole('button', { name: /new game/i }));
  act(() => jest.advanceTimersByTime(600));

  expect(screen.getByText('Your turn')).toBeInTheDocument();
  expect(screen.getByText('Your moves will appear here.')).toBeInTheDocument();
});

test('undo in computer mode removes the latest human and computer move together', () => {
  jest.useFakeTimers();
  render(<App />);
  fireEvent.change(screen.getByLabelText(/game mode/i), { target: { value: 'Computer' } });
  fireEvent.click(screen.getByRole('button', { name: /row 1, column 1, empty/i }));
  act(() => jest.advanceTimersByTime(550));
  fireEvent.click(screen.getByRole('button', { name: /undo last move/i }));

  expect(screen.getByText('Your turn')).toBeInTheDocument();
  expect(screen.getByText('Your moves will appear here.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /row 1, column 1, empty/i })).toBeEnabled();
  expect(screen.getByRole('button', { name: /row 2, column 2, empty/i })).toBeEnabled();
});

test('declares a draw when the final move fills the board without a winner', () => {
  render(<App />);
  [
    [0, 0], [0, 1],
    [0, 2], [1, 1],
    [1, 0], [1, 2],
    [2, 1], [2, 0],
    [2, 2],
  ].forEach(([row, column]) => {
    fireEvent.click(screen.getByRole('button', {
      name: new RegExp(`row ${row + 1}, column ${column + 1}, empty`, 'i'),
    }));
  });

  expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  expect(screen.getByText('1', { selector: '.score-item strong' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /undo last move/i })).toBeDisabled();
});

test('loads valid scoreboard data from localStorage on startup', () => {
  window.localStorage.setItem('tic-tac-toe-scoreboard', JSON.stringify({ xWins: 3, oWins: 2, draws: 1 }));
  render(<App />);
  const scoreboard = screen.getByRole('region', { name: /scoreboard/i });

  expect(within(scoreboard).getByText('3')).toBeInTheDocument();
  expect(within(scoreboard).getByText('2')).toBeInTheDocument();
  expect(within(scoreboard).getByText('1')).toBeInTheDocument();
});

test('invalid saved scoreboard data falls back to zero with a message', () => {
  window.localStorage.setItem('tic-tac-toe-scoreboard', '{not valid json');
  render(<App />);

  expect(screen.getByText(/saved scoreboard could not be read/i)).toBeInTheDocument();
  expect(screen.getAllByText('0', { selector: '.score-item strong' })).toHaveLength(3);
});

test('detects all winning lines and a full-board draw', () => {
  const winningBoards = [
    [['X', 'X', 'X'], ['O', null, 'O'], [null, null, null]],
    [['X', 'O', null], ['X', 'O', null], ['X', null, null]],
    [['X', 'O', null], ['O', 'X', null], [null, null, 'X']],
    [[null, null, 'X'], ['O', 'X', null], ['X', null, 'O']],
  ];

  winningBoards.forEach((board) => {
    expect(checkWinner(board)?.winner).toBe('X');
  });
  expect(isBoardFull([
    ['X', 'O', 'X'],
    ['X', 'O', 'O'],
    ['O', 'X', 'X'],
  ])).toBe(true);
  expect(checkWinner(createEmptyBoard())).toBeNull();
});

test('computer prioritizes winning, blocking, center, corners, then any empty cell', () => {
  expect(getComputerMove([['O', 'O', null], ['X', 'X', null], [null, null, null]])).toBe(2);
  expect(getComputerMove([['X', 'X', null], ['O', null, null], [null, null, null]])).toBe(2);
  expect(getComputerMove(createEmptyBoard())).toBe(4);
  expect(getComputerMove([['X', null, null], [null, 'O', null], [null, null, null]])).toBe(2);
  expect(getComputerMove([['X', 'O', 'X'], ['X', 'O', 'O'], ['O', 'X', null]])).toBe(8);
  expect(getComputerMove([['X', 'O', 'X'], ['X', 'O', 'O'], ['O', 'X', 'X']])).toBeNull();
});
