import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { NewGameButton } from './components/NewGameButton';
import { getLegalMoves } from './game/board';
import { useConnect4 } from './hooks/useConnect4';

function App() {
  const game = useConnect4();
  const legalMoves = new Set(getLegalMoves(game.board));

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

        <div className="controls-row">
          <GameStatus status={game.status} aiThinking={game.aiThinking} />
          <label className="difficulty">
            Difficulty
            <select
              value={game.difficulty}
              onChange={(event) => game.setDifficulty(Number(event.target.value))}
              disabled={game.aiThinking}
            >
              <option value={4}>Easy · depth 4</option>
              <option value={6}>Medium · depth 6</option>
              <option value={7}>Hard · depth 7</option>
            </select>
          </label>
        </div>

        <div className="column-controls" aria-label="Playable columns">
          {Array.from({ length: 7 }, (_, column) => (
            <button
              key={column}
              type="button"
              className="column-button"
              disabled={game.status !== 'playing' || game.aiThinking || !legalMoves.has(column)}
              onClick={() => game.playColumn(column)}
              aria-label={`Drop piece in column ${column + 1}`}
            >
              {column + 1}
            </button>
          ))}
        </div>

        <Board
          board={game.board}
          winningCells={game.winningCells}
          disabled={game.status !== 'playing' || game.aiThinking}
          previewColumn={game.previewColumn}
          onColumnClick={game.playColumn}
          onColumnHover={game.setPreviewColumn}
        />

        <div className="footer-info">
          <p className="hint">Choose a column to drop your piece.</p>
          {game.aiNodes !== null && <p className="search-info">{game.aiNodes.toLocaleString()} positions searched</p>}
        </div>
      </section>
    </main>
  );
}

export default App;
