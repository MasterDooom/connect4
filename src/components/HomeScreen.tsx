import { useState } from 'react';

interface HomeScreenProps {
  difficulty: number;
  setDifficulty: (depth: number) => void;
  onStart: () => void;
}

const DIFFICULTIES = [
  { depth: 4, label: 'EASY', detail: 'Relaxed' },
  { depth: 6, label: 'NORMAL', detail: 'Balanced' },
  { depth: 7, label: 'HARD', detail: 'Ruthless' },
];

const PREVIEW = [
  0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 0, 0, 0,
  0, 0, 1, 2, 0, 0, 0,
  0, 2, 1, 1, 0, 0, 0,
  2, 1, 2, 1, 0, 0, 0,
  1, 2, 1, 2, 1, 0, 0,
];

export function HomeScreen({ difficulty, setDifficulty, onStart }: HomeScreenProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <main className="home-screen">
      <div className="home-grid-glow" aria-hidden="true" />
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-mark" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>AI ARENA</span>
        </div>
        <span className="home-build">GAME-GD2 · CONNECT 4</span>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="home-kicker">THE CLASSIC. REBUILT.</p>
          <h1 id="home-title">
            CONNECT <span>4</span>
          </h1>
          <p className="home-tagline">
            Read the board. Control the center.
            <br />
            Beat the machine.
          </p>

          <div className="home-meta">
            <span><b>7 × 6</b> BOARD</span>
            <span className="home-meta-dot" aria-hidden="true" />
            <span><b>MINIMAX</b> AI</span>
            <span className="home-meta-dot" aria-hidden="true" />
            <span>LOCAL · OFFLINE</span>
          </div>

          <div className="difficulty-panel">
            <div className="difficulty-panel-heading">
              <span>CHOOSE YOUR OPPONENT</span>
              <span>DEPTH {difficulty}</span>
            </div>
            <div className="home-difficulty-grid" role="group" aria-label="AI difficulty">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.depth}
                  type="button"
                  className={'home-difficulty' + (difficulty === item.depth ? ' selected' : '')}
                  aria-pressed={difficulty === item.depth}
                  onClick={() => setDifficulty(item.depth)}
                >
                  <span className="home-difficulty-name">{item.label}</span>
                  <span className="home-difficulty-detail">{item.detail}</span>
                  <span className="home-difficulty-depth">{item.depth}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="home-actions">
            <button type="button" className="primary-start-button" onClick={onStart}>
              <span>START MATCH</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className={'secondary-home-button' + (showRules ? ' active' : '')}
              onClick={() => setShowRules((value) => !value)}
              aria-expanded={showRules}
            >
              <span aria-hidden="true">?</span>
              HOW TO PLAY
            </button>
          </div>

          <div className={'rules-drawer' + (showRules ? ' open' : '')} aria-hidden={!showRules}>
            <div className="rules-drawer-line">
              <span>01</span>
              <p>Drop your disc into any open column.</p>
            </div>
            <div className="rules-drawer-line">
              <span>02</span>
              <p>Connect four horizontally, vertically, or diagonally.</p>
            </div>
            <div className="rules-drawer-line">
              <span>03</span>
              <p>The AI searches ahead with minimax and alpha-beta pruning.</p>
            </div>
          </div>
        </div>

        <div className="home-preview" aria-hidden="true">
          <div className="home-preview-top">
            <span>LIVE PREVIEW</span>
            <span>VS AI</span>
          </div>
          <div className="mini-board">
            {PREVIEW.map((value, index) => (
              <span
                key={index}
                className={'mini-slot ' + (value === 1 ? 'mini-human' : value === 2 ? 'mini-ai' : '')}
              >
                {(value !== 0) && <i />}
              </span>
            ))}
          </div>
          <div className="home-preview-bottom">
            <span>YOUR MOVE</span>
            <span className="home-preview-arrow">↓</span>
            <span>COLUMN 4</span>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>HUMAN VS MINIMAX AI</span>
        <span>NO RNG · NO API · PURE STRATEGY</span>
      </footer>
    </main>
  );
}
