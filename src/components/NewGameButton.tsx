interface NewGameButtonProps {
  onClick: () => void;
}

export function NewGameButton({ onClick }: NewGameButtonProps) {
  return (
    <button className="new-game-button" type="button" onClick={onClick}>
      New Game
    </button>
  );
}
