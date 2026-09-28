import type { Cell as CellValue } from '../game/types';
import { AI, EMPTY, HUMAN } from '../game/constants';

interface CellProps {
  value: CellValue;
  winning: boolean;
  preview: boolean;
  row: number;
  column: number;
  onMouseEnter: () => void;
}

export function Cell({
  value,
  winning,
  preview,
  row,
  column,
  onMouseEnter,
}: CellProps) {
  const pieceClass =
    value === HUMAN ? 'piece-human' :
    value === AI ? 'piece-ai' :
    preview ? 'piece-preview' : '';

  const stateLabel =
    value === EMPTY ? 'empty' :
    value === HUMAN ? 'your piece' : 'AI piece';

  return (
    <div
      className={'cell ' + (winning ? 'cell-winning' : '')}
      aria-label={'Column ' + (column + 1) + ', row ' + (row + 1) + ' from top, ' + stateLabel}
      onMouseEnter={onMouseEnter}
    >
      <span className={'piece ' + pieceClass} aria-hidden="true" />
    </div>
  );
}
