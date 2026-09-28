import type { CSSProperties } from 'react';
import type { Cell as CellValue } from '../game/types';
import { AI, EMPTY, HUMAN } from '../game/constants';

interface CellProps {
  value: CellValue;
  winning: boolean;
  columnActive: boolean;
  preview: boolean;
  animateDrop: boolean;
  row: number;
  column: number;
  onMouseEnter: () => void;
}

export function Cell({
  value,
  winning,
  columnActive,
  preview,
  animateDrop,
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

  const pieceStyle = animateDrop
    ? ({ '--drop-rows': row + 1 } as CSSProperties)
    : undefined;

  return (
    <div
      className={
        'cell ' +
        (winning ? 'cell-winning ' : '') +
        (columnActive ? 'cell-column-active ' : '') +
        (preview ? 'cell-preview-target' : '')
      }
      aria-label={'Column ' + (column + 1) + ', row ' + (row + 1) + ' from top, ' + stateLabel}
      onMouseEnter={onMouseEnter}
    >
      <span
        className={'piece ' + pieceClass + (animateDrop ? ' piece-drop' : '')}
        style={pieceStyle}
        aria-hidden="true"
      />
    </div>
  );
}
