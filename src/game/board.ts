import { COLS, EMPTY, ROWS } from './constants';
import type { Board, Cell, MoveResult, Player } from './types';

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array<Cell>(COLS).fill(EMPTY),
  );
}

export function isValidColumn(board: Board, column: number): boolean {
  return Number.isInteger(column) && column >= 0 && column < COLS && board[0][column] === EMPTY;
}

export function getLegalMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let column = 0; column < COLS; column += 1) {
    if (isValidColumn(board, column)) moves.push(column);
  }
  return moves;
}

export function isBoardFull(board: Board): boolean {
  return getLegalMoves(board).length === 0;
}

export function dropPiece(board: Board, column: number, player: Player): MoveResult | null {
  if (!isValidColumn(board, column)) return null;

  const nextBoard = board.map((row) => [...row]);

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (nextBoard[row][column] === EMPTY) {
      nextBoard[row][column] = player;
      return { board: nextBoard, row, column };
    }
  }

  return null;
}
