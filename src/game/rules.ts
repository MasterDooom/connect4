import { HUMAN, ROWS, COLS } from './constants';
import { isBoardFull } from './board';
import type { Board, GameStatus, Player, TerminalState } from './types';

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const;

function inBounds(row: number, column: number): boolean {
  return row >= 0 && row < ROWS && column >= 0 && column < COLS;
}

export function getWinningCells(
  board: Board,
  row: number,
  column: number,
  player: Player,
): [number, number][] {
  for (const [dr, dc] of DIRECTIONS) {
    const cells: [number, number][] = [[row, column]];

    for (const direction of [-1, 1] as const) {
      let r = row + dr * direction;
      let c = column + dc * direction;

      while (inBounds(r, c) && board[r][c] === player) {
        cells.push([r, c]);
        r += dr * direction;
        c += dc * direction;
      }
    }

    if (cells.length >= 4) return cells;
  }

  return [];
}

export function hasWon(board: Board, row: number, column: number, player: Player): boolean {
  return getWinningCells(board, row, column, player).length >= 4;
}

export function getTerminalState(
  board: Board,
  lastMove: { row: number; column: number; player: Player } | null,
): TerminalState {
  if (lastMove && hasWon(board, lastMove.row, lastMove.column, lastMove.player)) {
    return {
      status: lastMove.player === HUMAN ? 'human-won' : 'ai-won',
      winningCells: getWinningCells(board, lastMove.row, lastMove.column, lastMove.player),
    };
  }

  if (isBoardFull(board)) return { status: 'draw', winningCells: [] };

  return { status: 'playing', winningCells: [] };
}

export function isTerminal(status: GameStatus): boolean {
  return status !== 'playing';
}
