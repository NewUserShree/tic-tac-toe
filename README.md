# Tic Tac Toe — React Frontend

A complete, browser-based Tic Tac Toe game built with React. **This project is frontend-only:** it has no backend, REST API, server-side game logic, or database. Game rules run in JavaScript in the browser; the scoreboard is persisted with `localStorage`.

## Features

- Two Player and Play Against Computer modes.
- 3 × 3 board with turn validation, win/draw detection, and highlighted winning cells.
- Computer plays O using deterministic win/block/center/corner/first-open priorities.
- Move history with one-based row and column positions.
- Undo: one move in Two Player mode; the most recent human/computer pair in Computer mode. Undo is disabled after a result.
- Reset Game preserves the scoreboard. Reset Scoreboard asks for confirmation.
- Scoreboard persists across browser reloads and validates stored data.
- Keyboard-focus indicators and responsive layout.

## Technology

- React 19 and JavaScript (ES6+)
- CSS
- Jest and React Testing Library
- Browser `localStorage`

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Install and run

From this directory:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). No backend or API needs to be started.

Run the test suite:

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

## Design and rules

`useGame` and its reducer own the browser-side game state. Pure functions in `utils/gameLogic.js` detect wins and draws, while `utils/computerLogic.js` selects the computer move. A React effect schedules the computer turn after a short delay; cleanup and a game-generation token prevent a canceled turn from affecting a reset or undone game.

The computer's move priority is:

1. Make an immediate O win.
2. Block an immediate X win.
3. Take the center.
4. Take the first available corner.
5. Take the first remaining empty cell.

Scoreboard state is managed in React and written to `localStorage`. Invalid stored data resets to zero counts with a visible message. The scoreboard is local to the browser profile and is not shared between devices or browsers.

## AI-assisted development notes

The given requirements were organized around game rules, computer strategy, state transitions, persistence, UI, and tests. AI assistance was used to draft and connect the React components, pure game logic, reducer, local storage helpers, and test cases. The implementation was then adjusted to meet the requested behavior, including disabling undo after completion, canceling delayed computer moves on reset/undo, and checking invalid stored scores. The automated tests exercise core game outcomes, computer priorities, controls, and local storage. See the test command above for the verification entry point.

## Assumptions and limitations

- Each browser profile has its own scoreboard, clearing browser site data also clears the saved scores.
- The computer uses the required deterministic heuristic rather than a full minimax strategy, so it is not guaranteed to play perfectly.
- Game state and move history are not persisted after a page reload, only the scoreboard is.
- No accounts, network services, or multiplayer across devices are included.

## Possible future improvements

- Add an optional perfect-play minimax opponent.
- Add configurable computer difficulty and sound preferences.
- Persist the current game locally if reload recovery is desired.

