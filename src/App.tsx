import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { NewGameButton } from './components/NewGameButton';
import { PlayerCard } from './components/PlayerCard';
import { getLegalMoves } from './game/board';
import { useConnect4 } from './hooks/useConnect4';

const DIFFICULTIES = [
  { depth: 4, label: 'EASY' },
  { depth: 6, label: 'NORMAL' },
  { depth: 7, label: 'HARD' },
];

function App() {
  const game = useConnect4();
  const legalMoves = new Set(getLegalMoves(game.board));
  const gameLocked = game.status !== 'playing' || game.aiThinking;
  const humanActive = game.status === 'playing' && !game.aiThinking;
  const aiActive = game.aiThinking;

  return (
    <main className="app-shell">
      <section className="game-frame" aria-labelledby="game-title">
        <header className="game-topbar">
          <div className="brand-lockup">
            <p className="eyebrow">GAME-GD2 · AI ARENA</p>
            <div className="brand-line">
              <h1 id="game-title">CONNECT <span>4</span></h1>
              <span className="brand-dot" aria-hidden="true" />
            </div>
            <p className="brand-subtitle">Human <span aria-hidden="true">vs</span> Minimax AI</p>
          </div>

          <div className="topbar-actions">
            <div className="difficulty-control" aria-label="AI difficulty">
              <span className="difficulty-label">AI DEPTH</span>
              <div className="difficulty-buttons">
                {DIFFICULTIES.map(({ depth, label }) => (
                  <button
                    key={depth}
                    type="button"
                    className={'difficulty-button' + (game.difficulty === depth ? ' selected' : '')}
                    onClick={() => game.setDifficulty(depth)}
                    disabled={game.aiThinking}
                    aria-pressed={game.difficulty === depth}
                  >
                    <span>{label}</span>
                    <small>{depth}</small>
                  </button>
                ))}
              </div>
            </div>

            <NewGameButton onClick={game.newGame} />
          </div>
        </header>

        <div className="arena-layout">
          <PlayerCard side="human" active={humanActive} />

          <section className="arena-center" aria-label="Connect 4 game board">
            <div className="turn-banner">
              <div className="turn-banner-main">
                <span className={'turn-pip ' + (aiActive ? 'turn-pip-ai' : '')} aria-hidden="true" />
                <div>
                  <p className="turn-eyebrow">{aiActive ? 'OPPONENT TURN' : 'YOUR TURN'}</p>
                  <p className="turn-title">
                    {aiActive ? 'AI is reading the board' : 'Pick a column'}
                  </p>
                </div>
              </div>
              <GameStatus status={game.status} aiThinking={game.aiThinking} />
            </div>

            <div className="board-stage">
              <div className="column-guide">
                <span className="column-guide-label">DROP</span>
                <div className="column-controls" aria-label="Choose a column">
                  {Array.from({ length: 7 }, (_, column) => (
                    <button
                      key={column}
                      type="button"
                      className={'column-button' + (game.previewColumn === column ? ' selected' : '')}
                      disabled={gameLocked || !legalMoves.has(column)}
                      onClick={() => game.playColumn(column)}
                      onMouseEnter={() => !gameLocked && legalMoves.has(column) && game.setPreviewColumn(column)}
                      onMouseLeave={() => game.setPreviewColumn(null)}
                      onFocus={() => !gameLocked && legalMoves.has(column) && game.setPreviewColumn(column)}
                      onBlur={() => game.setPreviewColumn(null)}
                      aria-label={legalMoves.has(column)
                        ? 'Drop your piece in column ' + (column + 1)
                        : 'Column ' + (column + 1) + ' is full'}
                    >
                      <span className="column-number">{column + 1}</span>
                      <span className="column-drop" aria-hidden="true">↓</span>
                    </button>
                  ))}
                </div>
              </div>

              <Board
                board={game.board}
                winningCells={game.winningCells}
                lastMove={game.lastMove}
                disabled={gameLocked}
                previewColumn={game.previewColumn}
                onColumnHover={game.setPreviewColumn}
              />
            </div>

            <div className="arena-footer">
              <div className="arena-footer-copy">
                <span className="footer-key">1–7</span>
                <span>
                  {game.aiThinking
                    ? 'AI is calculating its response.'
                    : game.status === 'playing'
                      ? 'Click a number to drop your disc.'
                      : 'Match complete · start a new game to rematch.'}
                </span>
              </div>

              {game.aiNodes !== null && (
                <p className="search-info" aria-label={game.aiNodes.toLocaleString() + ' positions searched by the AI'}>
                  {game.aiNodes.toLocaleString()} nodes
                </p>
              )}
            </div>
          </section>

          <PlayerCard
            side="ai"
            active={aiActive}
            thinking={game.aiThinking}
            difficulty={game.difficulty}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
