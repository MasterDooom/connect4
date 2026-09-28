import type { GameStatus } from '../game/types';

interface GameStatusProps {
  status: GameStatus;
  aiThinking: boolean;
}

const messages: Record<GameStatus, string> = {
  playing: 'Your turn',
  'human-won': 'You win',
  'ai-won': 'AI wins',
  draw: 'Draw',
};

export function GameStatus({ status, aiThinking }: GameStatusProps) {
  const text = aiThinking ? 'AI is thinking…' : messages[status];
  return (
    <div className="status" role="status" aria-live="polite">
      <span className={`status-dot ${aiThinking ? 'thinking' : ''}`} aria-hidden="true" />
      {text}
    </div>
  );
}
