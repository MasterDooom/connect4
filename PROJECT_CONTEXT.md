# Connect 4 — Project Context

> Source of truth for the GAME-GD2 Connect 4 project.
> Repository: `MasterDooom/connect4`
> Course: GAME-GD2 — Turn-Based Strategy Game with a Real AI Opponent
> Last updated: 2026-09-28

## 1. Goal

Build a polished browser-based **Connect 4: Human vs AI** game that directly satisfies the GAME-GD2 brief.

Required:
- Complete turn-based loop.
- Legal-move detection.
- Turn switching.
- Win and draw detection.
- Real minimax/negamax game-tree search.
- Meaningful search depth.
- Alpha-beta pruning.
- Heuristic evaluation for non-terminal positions.
- UI that clearly communicates valid moves and current state.
- New Game flow.
- Responsive and accessible presentation.

The AI must not be random, purely greedy, or limited to one-move lookahead.

## 2. Project Principles

1. Treat `PROJECT_CONTEXT.md` as the source of truth.
2. Inspect before changing.
3. Preserve working systems.
4. Challenge/disprove the approach before implementation.
5. Work in small explicit stages.
6. Build one coherent section at a time.
7. Test and integrate after each stage.
8. Perform a hostile review before calling the project finished.
9. Fix issues found during review.
10. Keep the implementation explainable in a GAME-GD2 viva.

## 3. Technical Direction

Stack:
- Vite
- React
- TypeScript
- CSS
- No backend.
- No external AI/API.

Reason: the project is primarily an algorithm/game-development demonstration. Local deterministic AI keeps the game self-contained and makes the minimax implementation directly inspectable.

## 4. Target Architecture

`@
connect4/
├── public/
├── src/
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   ├── GameStatus.tsx
│   │   └── NewGameButton.tsx
│   ├── game/
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── board.ts
│   │   └── rules.ts
│   ├── ai/
│   │   ├── minimax.ts
│   │   ├── evaluation.ts
│   │   └── moveOrdering.ts
│   ├── hooks/
│   │   └── useConnect4.ts
│   ├── styles/
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── PROJECT_CONTEXT.md
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
`@

The exact structure can change if implementation reveals a better boundary, but changes must be recorded here.

## 5. Domain Model

Board:
`@
type Cell = 0 | 1 | 2;
// 0 = empty, 1 = human, 2 = AI
type Board = Cell[][];
`@

Constants:
- ROWS = 6
- COLS = 7
- EMPTY = 0
- HUMAN = 1
- AI = 2

Game state concept:
`@
type GameStatus = 'playing' | 'human-won' | 'ai-won' | 'draw';
`@

Avoid magic numbers scattered through the code.

## 6. Game Rules Layer

Rules must be independent of React and testable as pure logic.

Required operations:
1. Create empty board.
2. Find legal columns.
3. Check whether a column is full.
4. Drop a piece.
5. Return the resulting row/position.
6. Detect a win.
7. Detect a draw.
8. Determine terminal state.
9. Generate legal moves.

Invariant: a legal move changes exactly one empty cell into the current player's piece and places it at the lowest available row.

## 7. Win Detection

Check four directions:
- Horizontal: (0, 1)
- Vertical: (1, 0)
- Diagonal down-right: (1, 1)
- Diagonal down-left: (1, -1)

Prefer checking around the latest move rather than unnecessarily scanning the entire board.

Return winning positions so the UI can highlight the four.

Must cover horizontal, vertical, both diagonal directions, edge positions, and false-positive prevention.

## 8. AI Design

Use **minimax with alpha-beta pruning**.

Concept:
`@
MAX = AI turn
MIN = Human turn
`@

At every node:
1. Check terminal state.
2. Return terminal score if terminal.
3. If depth is zero, return heuristic evaluation.
4. Generate legal moves.
5. Simulate each move.
6. Recursively evaluate child state.
7. Update alpha/beta.
8. Prune when alpha >= beta.
9. Return the best value.

The actual React board must never be mutated by recursive search.

## 9. Search Depth

Target difficulty:
- Easy: depth 4
- Medium: depth 6
- Hard: depth 7 or 8

Benchmark in-browser before selecting the final hard depth. Correctness comes before depth.

If depth 8 causes unacceptable latency, improve move ordering/pruning or use depth 7. Never fake search depth or replace minimax with a greedy shortcut.

## 10. Alpha-Beta and Move Ordering

Alpha-beta:
`@
alpha = best guaranteed value for maximizer
beta  = best guaranteed value for minimizer

prune when alpha >= beta
`@

Use center-first move ordering:
`@
[3, 2, 4, 1, 5, 0, 6]
`@

Immediate winning moves may be prioritized as an optimization. Move ordering is not a substitute for minimax.

## 11. Terminal Scoring

Starting scale:
`@
AI win    = +100000 + depth
Human win = -100000 - depth
Draw      = 0
`@

The depth adjustment rewards faster AI wins and delays losses.

## 12. Heuristic Evaluation

Evaluate every four-cell window.

Starting weights:
`@
AI:    3 + empty  = +100
AI:    2 + 2 empty = +10

Human: 3 + empty  = -100
Human: 2 + 2 empty = -10

AI center piece    = +3
Human center piece = -3
`@

Four-in-a-row remains a terminal condition rather than merely a heuristic.

Why:
- Three-in-a-row plus an open cell is an immediate threat.
- Two-in-a-row represents future potential.
- Center control creates more possible winning lines.
- Opponent threats must be penalized strongly.

Weights are tunable after tactical testing and should be documented if changed.

## 13. Performance

Potential bottlenecks:
- Excessive board cloning.
- Poor move ordering.
- Repeated unnecessary win scans.
- Searching branches that alpha-beta could prune.
- Blocking the UI for too long.

Mitigations:
1. Keep AI outside React components.
2. Use efficient board simulation/copying.
3. Generate legal moves per node.
4. Search center-first.
5. Prune aggressively.
6. Avoid unnecessary allocations.
7. Benchmark depth.
8. Show an AI-thinking state.
9. Prevent user input during AI computation.

## 14. UI Architecture

React owns:
- Displayed board.
- Current player.
- Game status.
- Winning cells.
- AI thinking state.
- Difficulty.

Pure modules own:
- Board mechanics.
- Rules.
- Move generation.
- Minimax.
- Evaluation.
- Move ordering.

A `useConnect4` hook may coordinate:
`@
human input
  -> validate
  -> apply move
  -> terminal check
  -> AI thinking
  -> search
  -> apply AI move
  -> terminal check
  -> human turn
`@

Guard against game-over input, AI-turn input, full columns, duplicate clicks, and stale AI results after New Game.

## 15. UI Requirements

Main screen:
- Game title.
- Human vs AI indicator.
- Current turn/status.
- 7×6 board.
- New Game.
- Difficulty selector if implemented.
- Optional compact AI/search information.

Interaction:
- Hover/tap feedback for playable columns.
- Full columns visibly disabled.
- Current player obvious.
- Winning four highlighted.
- AI thinking state visible.
- No interaction after game over.

Accessibility:
- Semantic buttons.
- Meaningful labels.
- Visible keyboard focus.
- Keyboard-usable column selection.
- Do not rely only on color.
- Status changes should be exposed appropriately.

Responsive:
- No horizontal overflow.
- Board scales to viewport.
- Controls remain usable.
- Text remains readable.

## 16. Implementation Stages

### Stage 0 — Reconnaissance
Status: COMPLETE.
- Confirmed repository.
- Confirmed main branch.
- Inspected root.
- Confirmed only minimal README existed.
- No existing application architecture to preserve.

### Stage 1 — Foundation
- Scaffold Vite + React + TypeScript.
- Establish source directories.
- Establish scripts.
- Create basic app shell.
- Confirm dev/build.
- Update README and context.

Exit: app starts and builds cleanly.

### Stage 2 — Game Engine
- Constants/types.
- Empty board.
- Legal move detection.
- Piece dropping.
- Win detection.
- Draw detection.
- Terminal-state handling.
- Unit tests.

Exit: complete rules engine works without React.

### Stage 3 — Playable Game
- Board rendering.
- Cell rendering.
- Turn indicator.
- Human moves.
- Win/draw UI.
- Invalid-move handling.
- New Game.

Exit: a complete game loop works even before AI integration.

### Stage 4 — AI Engine
- Legal search moves.
- Terminal scoring.
- Heuristic evaluator.
- Minimax.
- Alpha-beta pruning.
- Center-first move ordering.
- Configurable depth.
- Benchmark.
- Tactical tests.

Exit: AI demonstrably plans ahead and remains responsive.

### Stage 5 — Human vs AI
- AI turn.
- Thinking state.
- Input lock.
- Apply AI result.
- Terminal checks.
- New Game safety.
- Rapid-click safety.

Exit: complete reliable Human vs AI games.

### Stage 6 — UI Polish
Status: COMPLETE.
- Visual system and responsive layout.
- Board/piece styling and player legend.
- Column hover preview and explicit keyboard column controls.
- Win highlight and distinct terminal states.
- Difficulty control with disabled state during AI thinking.
- Accessible labels/status announcements.
- Visible keyboard focus.
- Reduced-motion support.
- Removed external font dependency for a self-contained UI.

Exit: finished game presentation.

### Stage 7 — Verification
Status: AUTOMATED VERIFICATION COMPLETE; LIVE MANUAL GAMEPLAY PENDING.

Run:
- TypeScript/build.
- Lint if configured.
- Unit tests.
- Manual gameplay.
- AI tactical tests.
- Responsive checks.
- Accessibility checks.

### Stage 8 — Hostile Review
Status: STATIC/CODE HOSTILE REVIEW COMPLETE; LIVE MANUAL UX REVIEW PENDING.

Review for:
- Illegal moves.
- Missed/false wins.
- Contradictory state.
- AI double turns.
- Genuine minimax.
- Genuine alpha-beta.
- Real heuristic cutoff.
- Meaningful depth.
- Browser freezes.
- Excessive allocations.
- Poor UX.
- Accessibility failures.
- Duplicated/messy logic.

Fix everything found.

### Stage 9 — Final Launch Review
Verify:
- Build.
- Tests.
- README.
- PROJECT_CONTEXT.md.
- All course requirements.
- Final architecture.
- Final search depth.
- Final heuristic.
- Known limitations.

## 17. Test Matrix

Rules:
- Empty board has 7 legal moves.
- Pieces stack correctly.
- Full column becomes illegal.
- Horizontal win.
- Vertical win.
- Diagonal / win.
- Diagonal \\ win.
- Three-in-a-row is not a win.
- Draw detection.

AI:
- Takes immediate win.
- Blocks immediate loss.
- Never selects full column.
- Correct terminal score ordering.
- Pruned minimax agrees with unpruned minimax on small positions.
- Heuristic ranks stronger positions appropriately.
- Center bonus behaves as intended.

Integration:
- Human can complete game.
- AI can complete game.
- New Game after win.
- New Game during AI thinking.
- Rapid repeated clicks.
- All columns full.
- Edge-column play.

## 18. Viva Explanation

Why minimax:
Connect 4 is deterministic, two-player, zero-sum, and perfect-information. Minimax models the opponent's best response.

Why depth-limited:
The full game tree is too large to exhaustively search for every browser move.

Why heuristic:
At the cutoff, the AI needs a numerical estimate of positional strength. Four-cell windows and center control provide meaningful Connect 4 features.

Why alpha-beta:
It removes branches that cannot affect the minimax result without changing the decision.

Why move ordering:
Searching promising moves first increases alpha-beta pruning efficiency.

## 19. Constraints

- No external AI service.
- No random AI behavior.
- No single-move-only AI.
- No backend unless a concrete requirement appears.
- No unnecessary dependencies.
- No visual polish that compromises algorithm correctness.
- No unnecessary rewrites.
- Keep game and AI logic independently testable.

## 20. Definition of Done

- [ ] Vite/React/TypeScript app works.
- [ ] 7×6 Connect 4 board.
- [ ] Legal moves.
- [ ] Turn switching.
- [ ] Human win detection.
- [ ] AI win detection.
- [ ] Draw detection.
- [ ] New Game.
- [ ] Minimax/negamax.
- [ ] Meaningful multi-ply search.
- [ ] Alpha-beta pruning.
- [ ] Heuristic evaluation.
- [ ] Immediate wins taken.
- [ ] Immediate threats blocked.
- [ ] No random AI.
- [ ] Responsive performance.
- [ ] Valid moves communicated.
- [ ] AI thinking state.
- [ ] Winning cells highlighted.
- [ ] Responsive UI.
- [ ] Accessibility basics.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Hostile review completed.
- [ ] README explains setup/gameplay/AI.
- [ ] PROJECT_CONTEXT.md matches actual implementation.

## 21. Current State

Repository: `MasterDooom/connect4`
Branch: `main`
Current code: playable Human-vs-AI Connect 4 with pure game engine, minimax AI, and responsive game UI.
Completed: reconnaissance, architecture, game engine, tests, playable UI, AI, Human-vs-AI integration, first UI polish pass, automated verification, and static hostile review.
Current change: second UI polish pass focused on clearer move affordance, a slightly smaller game arena, and animated piece drops.
Automated verification before this UI pass: GitHub Actions run 25 passed 14/14 tests and the production build.
Manual device gameplay remains the final unverified item; the connected desktop is available, but the project is not currently present as a local checkout there, so no manual browser interaction was claimed.
Next priority: **manual gameplay review, then final launch review.**

## 22. Change Log

### 2026-09-28 — UI polish pass 2
- Reworked numbered column controls into a dedicated move-picker panel with clear "YOUR MOVE" guidance.
- Added number + drop-arrow affordances, stronger hover/focus states, and button hover/focus preview linking.
- Reduced arena width and spacing to keep the full board visible more often on laptop-height screens.
- Added compact height-based spacing adjustments for shorter viewports.
- Added glossy token styling, board depth, and a short gravity/drop animation for each newly placed piece.
- Added last-move state to the React orchestration layer solely for visual drop feedback.
- Updated hover/focus copy to make the column-control interaction explicit.
- Preserved keyboard accessibility and reduced-motion behavior.
- Used the previously shared motion/interaction/design references as inspiration without adding external runtime dependencies.


### 2026-09-28
- Completed Stage 6 UI/UX polish: responsive layout, player legend, clearer controls, accessible status/labels, semantic board grouping, focus states, and reduced-motion support.
- Removed the remote Google Fonts import so the demo UI has no external font dependency.
- Confirmed `MasterDooom/connect4`.
- Confirmed `main`.
- Confirmed effectively empty starting repository.
- Selected Connect 4 for GAME-GD2.
- Selected Vite + React + TypeScript.
- Selected minimax + alpha-beta pruning.
- Defined heuristic evaluation.
- Defined center-first move ordering.
- Defined staged implementation/testing/hostile-review workflow.
- Created this source-of-truth project context.


### 2026-09-28 — Verification and hostile review
- Corrected the remaining AI diagonal test fixture.
- Added explicit cleanup for pending AI timeouts during New Game/unmount.
- Simplified board accessibility by making cells presentational and keeping the seven column buttons as the single keyboard interaction path.
- Preserved mouse hover previews after the board semantics refactor.
- GitHub Actions run 23 passed all 14 tests and the production build.
- Static hostile review found no additional correctness, AI, state-management, or UI architecture issues requiring changes.
