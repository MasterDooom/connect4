interface PlayerCardProps {
  side: 'human' | 'ai';
  active: boolean;
  thinking?: boolean;
  difficulty?: number;
}

export function PlayerCard({
  side,
  active,
  thinking = false,
  difficulty,
}: PlayerCardProps) {
  const human = side === 'human';

  return (
    <section className={'player-card player-card-' + side + (active ? ' player-card-active' : '')}>
      <div className="player-card-topline">
        <span className="player-card-role">{human ? 'PLAYER 1' : 'OPPONENT'}</span>
        <span className="player-card-status">{active ? 'ACTIVE' : 'WAITING'}</span>
      </div>

      <div className="player-card-main">
        <span className={'player-token ' + (human ? 'player-token-human' : 'player-token-ai')} aria-hidden="true">
          {human ? 'YOU' : 'AI'}
        </span>
        <div>
          <p className="player-card-name">{human ? 'You' : 'Minimax AI'}</p>
          <p className="player-card-detail">
            {human
              ? active ? 'Choose a column' : 'Your next turn'
              : thinking ? 'Calculating move…' : 'Ready to respond'}
          </p>
        </div>
      </div>

      <div className="player-card-bottom">
        {human ? (
          <span>GREEN DISC</span>
        ) : (
          <span>CYAN DISC · DEPTH {difficulty}</span>
        )}
        <span className={'player-live-dot ' + (active ? 'live' : '')} aria-hidden="true" />
      </div>
    </section>
  );
}
