import type { GameStatus } from '../game/types';

interface ResultOverlayProps {
  status: Exclude<GameStatus, 'playing'>;
  moveCount: number;
  aiNodes: number | null;
  difficulty: number;
  onRematch: () => void;
  onMenu: () => void;
}

const RESULT_COPY = {
  'human-won': {
    eyebrow: 'MATCH COMPLETE',
    title: 'VICTORY',
    detail: 'You connected four before the machine.',
    icon: '✦',
  },
  'ai-won': {
    eyebrow: 'MATCH COMPLETE',
    title: 'DEFEAT',
    detail: 'The AI found the winning line.',
    icon: '×',
  },
  draw: {
    eyebrow: 'MATCH COMPLETE',
    title: 'DEAD EVEN',
    detail: 'The board is full. No line was completed.',
    icon: '＝',
  },
} as const;

export function ResultOverlay({
  status,
  moveCount,
  aiNodes,
  difficulty,
  onRematch,
  onMenu,
}: ResultOverlayProps) {
  const copy = RESULT_COPY[status];

  return (
    <section className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-card">
        <div className={'result-icon result-icon-' + status} aria-hidden="true">{copy.icon}</div>
        <p className="result-eyebrow">{copy.eyebrow}</p>
        <h2 id="result-title">{copy.title}</h2>
        <p className="result-detail">{copy.detail}</p>

        <div className="result-stats">
          <div>
            <span>MOVES</span>
            <strong>{moveCount}</strong>
          </div>
          <div>
            <span>AI DEPTH</span>
            <strong>{difficulty}</strong>
          </div>
          <div>
            <span>SEARCHED</span>
            <strong>{aiNodes === null ? '—' : aiNodes.toLocaleString()}</strong>
          </div>
        </div>

        <div className="result-actions">
          <button type="button" className="result-primary" onClick={onRematch}>
            RUN IT BACK <span aria-hidden="true">↻</span>
          </button>
          <button type="button" className="result-secondary" onClick={onMenu}>
            MAIN MENU
          </button>
        </div>
      </div>
    </section>
  );
}
