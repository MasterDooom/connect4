import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { NewGameButton } from './components/NewGameButton';
import { useConnect4 } from './hooks/useConnect4';

function App() {
  const game = useConnect4();

  return (
    <main className="app-shell">
      <section className="game-shell" aria-labelledby="game-title">
        <header className="game-header">
          <div>
            <p className="eyebrow">GAME-GD2 · TURN-BASED STRATEGY</p>
            <h1 id="game-title">Connect 4</h1>
            <p className="subtitle">Human vs AI</p>
          </div>
          <NewGameButton onClick={game.newGame} />
        </header>

        <GameStatus status={game.status} aiThinking={game.aiThinking} />

        <Board
          board={game.board}
          winningCells={game.winningCells}
          disabled={game.status !== 'playing' || game.aiThinking}
          previewColumn={game.previewColumn}
          onColumnClick={game.playColumn}
          onColumnHover={game.setPreviewColumn}
        />

        <p className="hint">Choose a column to drop your piece.</p>
      </section>
    </main>
  );
}

export default App;
