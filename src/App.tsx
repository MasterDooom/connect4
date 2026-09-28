import { useEffect, useState } from 'react';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { HomeScreen } from './components/HomeScreen';
import { NewGameButton } from './components/NewGameButton';
import { PlayerCard } from './components/PlayerCard';
import { ResultOverlay } from './components/ResultOverlay';
import { getLegalMoves } from './game/board';
import { useConnect4 } from './hooks/useConnect4';

type Screen = 'home' | 'match' | 'result';

function App() {
  const game = useConnect4();
  const [screen, setScreen] = useState<Screen>('home');

  const legalMoves = new Set(getLegalMoves(game.board));
  const gameLocked = game.status !== 'playing' || game.aiThinking;
  const humanActive = game.status === 'playing' && !game.aiThinking;
  const aiActive = game.aiThinking;

  useEffect(() => {
    if (screen !== 'match' || game.status === 'playing' || game.aiThinking) return;

    const timeout = window.setTimeout(() => {
      setScreen('result');
    }, 950);

    return () => window.clearTimeout(timeout);
  }, [screen, game.status, game.aiThinking]);

  const startMatch = () => {
    game.newGame();
    setScreen('match');
  };

  const rematch = () => {
    game.newGame();
    setScreen('match');
  };

  const goHome = () => {
    game.newGame();
    setScreen('home');
  };

  if (screen === 'home') {
    return (
      <HomeScreen
        difficulty={game.difficulty}
        setDifficulty={game.setDifficulty}
        onStart={startMatch}
      />
    );
  }

  const resultStatus = game.status === 'playing' ? null : game.status;

  return (
    <main className="app-shell">
      <section className="game-frame" aria-labelledby="game-title">
        <header className="match-topbar">
          <button type="button" className="menu-button" onClick={goHome}>
            <span aria-hidden="true">←</span>
            MENU
          </button>

          <div className="match-brand">
            <span className="match-brand-kicker">AI ARENA</span>
            <h1 id="game-title">CONNECT <span>4</span></h1>
            <span className="match-brand-subtitle">HUMAN VS MINIMAX</span>
          </div>

          <div className="match-actions">
            <div className="match-difficulty">
              <span>DEPTH {game.difficulty}</span>
            </div>
            <NewGameButton onClick={rematch} />
          </div>
        </header>

        <div className="match-layout">
          <PlayerCard side="human" active={humanActive} />

          <section className="arena-center" aria-label="Connect 4 game board">
            <div className="turn-banner">
              <div className="turn-banner-main">
                <span className={'turn-pip ' + (aiActive ? 'turn-pip-ai' : '')} aria-hidden="true" />
                <div>
                  <p className="turn-eyebrow">{aiActive ? 'OPPONENT TURN' : 'YOUR TURN'}</p>
                  <p className="turn-title">
                    {aiActive ? 'The machine is reading the board' : 'Choose your column'}
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
                      ? 'Select a numbered column to drop your disc.'
                      : 'Final position locked.'}
                </span>
              </div>

              <div className="match-stat-strip">
                <span>MOVE <b>{String(game.moveCount).padStart(2, '0')}</b></span>
                {game.aiNodes !== null && (
                  <span>SEARCH <b>{game.aiNodes.toLocaleString()}</b></span>
                )}
              </div>
            </div>
          </section>

          <PlayerCard
            side="ai"
            active={aiActive}
            thinking={game.aiThinking}
            difficulty={game.difficulty}
          />
        </div>

        {screen === 'result' && resultStatus && (
          <ResultOverlay
            status={resultStatus}
            moveCount={game.moveCount}
            aiNodes={game.aiNodes}
            difficulty={game.difficulty}
            onRematch={rematch}
            onMenu={goHome}
          />
        )}
      </section>
    </main>
  );
}

export default App;
