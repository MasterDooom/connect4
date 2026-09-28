import type { Board as BoardType } from '../game/types';
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
  const winning = new Set(winningCells.map(([row, column]) => `${row},${column}`));

  return (
    <div
      className="board"
      role="grid"
      aria-label="Connect 4 board"
      onMouseLeave={() => onColumnHover(null)}
    >
      {board.map((row, rowIndex) =>
        row.map((value, columnIndex) => (
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            value={value}
            row={rowIndex}
            column={columnIndex}
            winning={winning.has(`${rowIndex},${columnIndex}`)}
            preview={previewColumn === columnIndex && rowIndex === getPreviewRow(board, columnIndex)}
            disabled={disabled}
            onClick={() => onColumnClick(columnIndex)}
          />
        )),
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
