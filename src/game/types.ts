import { AI, EMPTY, HUMAN } from './constants';

export type Cell = typeof EMPTY | typeof HUMAN | typeof AI;
export type Board = Cell[][];
export type Player = typeof HUMAN | typeof AI;
export type GameStatus = 'playing' | 'human-won' | 'ai-won' | 'draw';

export interface MoveResult {
  board: Board;
  row: number;
  column: number;
}

export interface TerminalState {
  status: GameStatus;
  winningCells: readonly [number, number][];
}
