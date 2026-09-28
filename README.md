# Connect 4 — Human vs AI

A browser-based Connect 4 game built for **GAME-GD2 — Turn-Based Strategy Game with a Real AI Opponent**.

## Requirements covered

- 7×6 Connect 4 board
- Legal move detection and gravity
- Human and AI turn handling
- Horizontal, vertical, and diagonal win detection
- Draw detection
- New Game
- Minimax game-tree search
- Alpha-beta pruning
- Depth-based difficulty
- Heuristic evaluation of non-terminal positions
- Center-first move ordering
- AI immediate-win and immediate-block behavior
- Responsive board UI
- Keyboard-focusable controls
- Visible valid-column controls
- AI thinking state
- Winning-cell highlighting

## Stack

- React
- TypeScript
- Vite
- Vitest
- CSS

No backend, external AI API, or random AI behavior is used.

## Run locally

~~~bash
npm install
npm run dev
~~~

Build:

~~~bash
npm run build
~~~

Tests:

~~~bash
npm test
~~~

## AI

The AI uses depth-limited **minimax with alpha-beta pruning**.

- AI is the maximizing player.
- Human is the minimizing player.
- Terminal wins receive very large scores.
- Non-terminal positions are evaluated using four-cell windows and center-column control.
- Candidate moves are searched center-first: 3, 2, 4, 1, 5, 0, 6.
- Difficulty currently maps to search depths 4, 6, and 7.

The search returns the selected column, evaluation score, and number of positions searched. This makes the multi-ply search directly inspectable during development and the GAME-GD2 viva.

## Heuristic

The evaluator considers every possible four-cell window:

| Pattern | Score |
| --- | ---: |
| AI 3 + 1 empty | +100 |
| AI 2 + 2 empty | +10 |
| Human 3 + 1 empty | -100 |
| Human 2 + 2 empty | -10 |
| AI center piece | +3 |
| Human center piece | -3 |

Terminal four-in-a-row states are handled separately by minimax.

## Architecture

~~~text
src/
├── ai/
│   ├── evaluation.ts
│   ├── minimax.ts
│   ├── minimax.test.ts
│   └── moveOrdering.ts
├── components/
│   ├── Board.tsx
│   ├── Cell.tsx
│   ├── GameStatus.tsx
│   └── NewGameButton.tsx
├── game/
│   ├── board.ts
│   ├── constants.ts
│   ├── rules.ts
│   ├── rules.test.ts
│   └── types.ts
├── hooks/
│   └── useConnect4.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
~~~

The game engine and AI are pure TypeScript modules. React owns presentation and turn orchestration.

## Project workflow

PROJECT_CONTEXT.md is the source of truth.

Implementation is being completed in explicit stages:

1. Foundation
2. Game engine
3. Playable human game
4. AI engine
5. Human vs AI integration
6. UI/accessibility polish
7. Verification
8. Hostile review
9. Final launch review

## Verification status

The repository contains automated Vitest coverage for core game rules and AI tactics, plus a GitHub Actions workflow for tests and builds.

At the current development checkpoint, the GitHub Actions API has not reported a workflow run yet. Local execution with npm install && npm test && npm run build remains the authoritative immediate verification step until Actions produces a run.

See PROJECT_CONTEXT.md for the full architecture, test matrix, constraints, and GAME-GD2 viva explanation.
