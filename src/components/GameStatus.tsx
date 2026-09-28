import type { GameStatus as GameStatusType } from '../game/types';

interface GameStatusProps {
  status: GameStatusType;
  aiThinking: boolean;
}

const messages: Record<GameStatusType, string> = {
  playing: 'Your turn',
  'human-won': 'You win',
  'ai-won': 'AI wins',
  draw: 'Draw',
};

export function GameStatus({ status, aiThinking }: GameStatusProps) {
  const text = aiThinking ? 'AI is thinking…' : messages[status];
  const statusClass = aiThinking ? 'thinking' : 'status-' + status;

  return (
    <div className={'status ' + statusClass} role="status" aria-live="polite" aria-atomic="true">
      <span className={'status-dot ' + (aiThinking ? 'thinking' : '')} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
