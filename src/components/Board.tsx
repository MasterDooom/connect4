import type { Board as BoardType } from '../game/types';
import { isValidColumn } from '../game/board';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  winningCells: readonly [number, number][];
  disabled: boolean;
  previewColumn: number | null;
  onColumnClick: (column: number) => void;
  onColumnHover: (column: number | null) => void;
}

export function Board({
  board,
  winningCells,
  disabled,
  previewColumn,
  onColumnClick,
  onColumnHover,
}: BoardProps) {
  const winning = new Set(winningCells.map(([row, column]) => row + ',' + column));

  return (
    <div
      className="board"
      role="group"
      aria-label="Connect 4 board. Use the column buttons above to make a move."
      onMouseLeave={() => onColumnHover(null)}
    >
      {board.map((row, rowIndex) =>
        row.map((value, columnIndex) => {
          const playable = isValidColumn(board, columnIndex);
          return (
            <Cell
              key={rowIndex + '-' + columnIndex}
              value={value}
              row={rowIndex}
              column={columnIndex}
              winning={winning.has(rowIndex + ',' + columnIndex)}
              preview={previewColumn === columnIndex && rowIndex === getPreviewRow(board, columnIndex)}
              disabled={disabled || !playable}
              onClick={() => onColumnClick(columnIndex)}
              onMouseEnter={() => !disabled && playable && onColumnHover(columnIndex)}
            />
          );
        }),
      )}
    </div>
  );
}

function getPreviewRow(board: BoardType, column: number): number {
  for (let row = board.length - 1; row >= 0; row -= 1) {
    if (board[row][column] === 0) return row;
  }
  return -1;
}
