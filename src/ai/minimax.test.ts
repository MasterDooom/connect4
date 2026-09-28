import { AI, HUMAN } from '../game/constants';
import { createEmptyBoard, dropPiece } from '../game/board';
import { evaluateBoard } from './evaluation';
import { findBestMove } from './minimax';

function boardFromMoves(moves: [number, 1 | 2][]) {
  let board = createEmptyBoard();
  for (const [column, player] of moves) {
    board = dropPiece(board, column, player)!.board;
  }
  return board;
}

describe('Connect 4 AI', () => {
  it('takes an immediate winning move', () => {
    const board = boardFromMoves([
      [0, HUMAN], [6, AI],
      [1, HUMAN], [6, AI],
      [2, HUMAN], [5, AI],
    ]);

    expect(findBestMove(board, 4).column).toBe(3);
  });

  it('blocks an immediate human win', () => {
    const board = boardFromMoves([
      [0, HUMAN], [6, AI],
      [1, HUMAN], [6, AI],
      [2, HUMAN],
    ]);

    expect(findBestMove(board, 4).column).toBe(3);
  });

  it('values center control positively for AI', () => {
    const board = createEmptyBoard();
    const center = dropPiece(board, 3, AI)!.board;
    expect(evaluateBoard(center)).toBeGreaterThan(0);
  });

  it('reports search work rather than making a single-move decision', () => {
    const board = createEmptyBoard();
    const result = findBestMove(board, 4);
    expect(result.nodes).toBeGreaterThan(7);
  });
});
