# Tic Tac Toe — React Frontend

A complete, browser-based Tic Tac Toe game built with React. **This project is frontend-only:** it has no backend, REST API, server-side game logic, or database. Game rules run in JavaScript in the browser, the scoreboard is persisted with `localStorage`.


## Technology

- React 19 and JavaScript (ES6+)
- CSS
- Jest and React Testing Library
- Browser `localStorage`

## Prerequisites

- Node.js 18


## Features

- Two Player and Play Against Computer modes.
- 3 × 3 board with turn validation, win/draw detection, and highlighted winning cells.
- Computer plays O using deterministic win/block/center/corner/first-open priorities.
- Move history with one-based row and column positions.
- Undo: one move in Two Player mode; the most recent human/computer pair in Computer mode. Undo is disabled after a result.
- Reset Game preserves the scoreboard. Reset Scoreboard asks for confirmation.
- Scoreboard persists across browser reloads and validates stored data.
- Keyboard-focus indicators and responsive layout.

Additional : **Limited undo:** each player gets only one undo per game. Once a player has used theirs, their Undo is unavailable for the rest of that game, and the allowance resets when a new game starts.

## Install and run

From this directory:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). No backend or API needs to be started.

## Run the test suite:

```bash
npm test -- --watch=false --runInBand
```

Create a production build:

```bash
npm run build
```

## Project structure

```text
src/
├── components/
│   ├── GameBoard.jsx
│   ├── GameCell.jsx
│   ├── GameControls.jsx
│   ├── GameStatus.jsx
│   ├── MoveHistory.jsx
│   └── Scoreboard.jsx
├── hooks/
│   └── useGame.js
├── utils/
│   ├── computerLogic.js
│   ├── gameLogic.js
│   └── storage.js
├── App.js
├── App.css
└── App.test.js
```


## AI tools and prompt summary
AI Tools Used
GitHub Copilot was used to draft components, game logic, the reducer, local storage helpers, and test cases.

AI was used as an accelerator. I made the design decisions, reviewed the generated code, and ran the tests myself.

Prompt Summary

The requirements were organized around game rules, computer strategy, state transitions, persistence, UI, and tests. The prompt asked for a frontend-only Tic Tac Toe application in React.js, with no backend. It covered:

Game rules: Turn management, move validation, win detection, draw detection, and game completion.
Computer opponent: A deterministic, priority-based strategy implemented in pure functions (win, then block, then center, then corner, then side).
State management: A reducer handling moves, undo, reset, and mode changes.
Scoreboard and persistence: X wins, O wins, and draws stored in local storage, with validation of stored values.
UI: React components for the board, status, controls, and scoreboard.
Testing: Automated tests for game outcomes, computer priorities, controls, and local storage.
AI-Assisted Workflow
Defined the game rules, state shape, and transitions.
Implemented the pure game logic and computer strategy.
Built the reducer for moves, undo, and reset.
Added local storage helpers for the scoreboard.
Built the React components and wired them to the reducer.
Wrote tests for the logic, controls, and storage.

Review and Adjustments

I reviewed the AI-generated code and adjusted it to meet the requested behavior:

Undo is disabled once the game is complete.
Pending computer moves are canceled on reset and undo, so a delayed move can’t land on a new game.
Invalid or corrupted stored scores are detected and handled instead of breaking the scoreboard.

Additions After the First Version
Limited undo: Each player gets one undo per game, and the allowance resets when a new game starts. This goes beyond the original requirements.
Move history table: The AI-generated version showed moves as a plain list with no move numbers. I replaced it with a table with Move, Player, Position, and Type columns, so each move is numbered and easy to scan. I styled it with alternating row colors, a hover highlight, and separate colors for X and O.
Single-screen layout: I used AI to refine the desktop CSS so the board, scoreboard, and move history fit the viewport without page scrolling. The move history scrolls inside its own panel.

## Design decisions

`useGame` and its reducer own the browser-side game state. Pure functions in `utils/gameLogic.js` detect wins and draws, while `utils/computerLogic.js` selects the computer move. A React effect schedules the computer turn after a short delay; cleanup and a game-generation token prevent a canceled turn from affecting a reset or undone game.

The computer's move priority is:

1. Make an immediate O win.
2. Block an immediate X win.
3. Take the center.
4. Take the first available corner.
5. Take the first remaining empty cell.

Scoreboard state is managed in React and written to `localStorage`. Invalid stored data resets to zero counts with a visible message. The scoreboard is local to the browser profile and is not shared between devices or browsers.

## 10. Clarifications and assumptions

- Each browser profile has its own scoreboard, clearing browser site data also clears the saved scores.
- No accounts, network services, or multiplayer across devices are included.

## 11. Known limitations

- Game state and move history are not persisted after a page reload, only the scoreboard is saved.

## Possible future improvements

- Add a perfect-play minimax opponent and selectable difficulty (easy: random, medium: current rules, hard: minimax).
- Persist the in-progress game so a reload doesn't lose it.
