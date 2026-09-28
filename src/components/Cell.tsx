import type { Cell as CellValue } from '../game/types';
import { AI, EMPTY, HUMAN } from '../game/constants';

interface CellProps {
  value: CellValue;
  winning: boolean;
  preview: boolean;
  disabled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  row: number;
  column: number;
}

export function Cell({
  value,
  winning,
  preview,
  disabled,
  onClick,
  onMouseEnter,
  row,
  column,
}: CellProps) {
  const pieceClass =
    value === HUMAN ? 'piece-human' :
    value === AI ? 'piece-ai' :
    preview ? 'piece-preview' : '';

  return (
    <button
      className={`cell ${winning ? 'cell-winning' : ''}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-label={
        value === EMPTY
          ? `Column ${column + 1}, row ${row + 1}, empty`
          : `Column ${column + 1}, row ${row + 1}, ${value === HUMAN ? 'your' : 'AI'} piece`
      }
    >
      <span className={`piece ${pieceClass}`} aria-hidden="true" />
    </button>
  );
}
