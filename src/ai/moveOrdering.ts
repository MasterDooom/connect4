import { MOVE_ORDER } from '../game/constants';
import { isValidColumn } from '../game/board';
import type { Board } from '../game/types';

export function getOrderedMoves(board: Board): number[] {
  return MOVE_ORDER.filter((column) => isValidColumn(board, column));
}
