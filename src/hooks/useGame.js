import { useCallback, useEffect, useReducer, useState } from 'react';
import { getComputerMove } from '../utils/computerLogic';
import { checkWinner, createEmptyBoard, isBoardFull } from '../utils/gameLogic';
import { createEmptyScoreboard, loadScoreboard, saveScoreboard } from '../utils/storage';

function createGameState(mode, scoreboard, storageMessage = '', generation = 0) {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'X',
    mode,
    status: 'playing',
    winner: null,
    winningCells: [],
    moveHistory: [],
    scoreRecorded: false,
    scoreboard,
    storageMessage,
    generation,
  };
}

function initialGameState() {
  const saved = loadScoreboard();
  return createGameState('TwoPlayer', saved.scoreboard, saved.message);
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'MODE_CHANGE':
      if (!['TwoPlayer', 'Computer'].includes(action.mode) || action.mode === state.mode) return state;
      return createGameState(action.mode, state.scoreboard, state.storageMessage, state.generation + 1);

    case 'RESET_GAME':
      return createGameState(state.mode, state.scoreboard, state.storageMessage, state.generation + 1);

    case 'RESET_SCOREBOARD':
      return { ...state, scoreboard: createEmptyScoreboard() };

    case 'UNDO': {
      if (state.status !== 'playing' || state.moveHistory.length === 0) return state;
      const removeCount = state.mode === 'Computer' && state.moveHistory.length >= 2 ? 2 : 1;
      const removedMoves = state.moveHistory.slice(-removeCount);
      const board = state.board.map((row) => [...row]);
      removedMoves.forEach((move) => {
        board[move.row][move.column] = null;
      });
      return {
        ...state,
        board,
        currentPlayer: removedMoves[0].player,
        moveHistory: state.moveHistory.slice(0, -removeCount),
        winner: null,
        winningCells: [],
        generation: state.generation + 1,
      };
    }

    case 'MOVE': {
      const { index, actor = 'human', generation } = action;
      if (
        state.status !== 'playing' ||
        !Number.isInteger(index) ||
        index < 0 ||
        index > 8 ||
        (generation !== undefined && generation !== state.generation)
      ) return state;

      const isComputerMove = actor === 'computer';
      if (isComputerMove) {
        if (state.mode !== 'Computer' || state.currentPlayer !== 'O') return state;
      } else if (state.mode === 'Computer' ? state.currentPlayer !== 'X' : state.currentPlayer === null) {
        return state;
      }

      const row = Math.floor(index / 3);
      const column = index % 3;
      if (state.board[row][column] !== null) return state;

      const player = isComputerMove ? 'O' : state.currentPlayer;
      const board = state.board.map((boardRow) => [...boardRow]);
      board[row][column] = player;
      const moveHistory = [
        ...state.moveHistory,
        {
          moveNumber: state.moveHistory.length + 1,
          player,
          row,
          column,
          moveType: isComputerMove ? 'Computer' : 'Human',
        },
      ];

      const winnerResult = checkWinner(board);
      const isDraw = !winnerResult && isBoardFull(board);
      const status = winnerResult ? 'won' : isDraw ? 'draw' : 'playing';
      let scoreboard = state.scoreboard;
      let scoreRecorded = state.scoreRecorded;

      if (status !== 'playing' && !scoreRecorded) {
        scoreboard = {
          ...scoreboard,
          ...(winnerResult
            ? player === 'X'
              ? { xWins: scoreboard.xWins + 1 }
              : { oWins: scoreboard.oWins + 1 }
            : { draws: scoreboard.draws + 1 }),
        };
        scoreRecorded = true;
      }

      return {
        ...state,
        board,
        currentPlayer: status === 'playing' ? (player === 'X' ? 'O' : 'X') : player,
        status,
        winner: winnerResult?.winner ?? null,
        winningCells: winnerResult?.winningCells ?? [],
        moveHistory,
        scoreRecorded,
        scoreboard,
      };
    }

    default:
      return state;
  }
}

export function useGame() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGameState);
  const [storageMessage, setStorageMessage] = useState(game.storageMessage);

  useEffect(() => {
    const message = saveScoreboard(game.scoreboard);
    if (message) {
      setStorageMessage((current) => current === message ? current : message);
    }
  }, [game.scoreboard]);

  useEffect(() => {
    if (game.mode !== 'Computer' || game.status !== 'playing' || game.currentPlayer !== 'O') return undefined;

    const generation = game.generation;
    const index = getComputerMove(game.board);
    if (index === null) return undefined;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'MOVE', index, actor: 'computer', generation });
    }, 550);
    return () => window.clearTimeout(timer);
  }, [game.board, game.currentPlayer, game.generation, game.mode, game.status]);

  const changeMode = useCallback((mode) => dispatch({ type: 'MODE_CHANGE', mode }), []);
  const play = useCallback((index) => dispatch({ type: 'MOVE', index }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);
  const resetScoreboard = useCallback(() => dispatch({ type: 'RESET_SCOREBOARD' }), []);

  return {
    game,
    scoreboard: game.scoreboard,
    storageMessage,
    changeMode,
    play,
    undo,
    resetGame,
    resetScoreboard,
  };
}

export { gameReducer, initialGameState };
