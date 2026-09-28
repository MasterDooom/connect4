import { AI, HUMAN } from './constants';
import { createEmptyBoard, dropPiece, getLegalMoves } from './board';
import { getWinningCells, getTerminalState } from './rules';

function boardFromMoves(moves: [number, number][]) {
  let board = createEmptyBoard();
  for (const [column, player] of moves) {
    const result = dropPiece(board, column, player as 1 | 2);
    if (!result) throw new Error('Invalid test move');
    board = result.board;
  }
  return board;
}

describe('Connect 4 rules', () => {
  it('starts with seven legal moves', () => {
    expect(getLegalMoves(createEmptyBoard())).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('stacks pieces from the bottom', () => {
    let board = createEmptyBoard();
    board = dropPiece(board, 3, HUMAN)!.board;
    board = dropPiece(board, 3, AI)!.board;

    expect(board[5][3]).toBe(HUMAN);
    expect(board[4][3]).toBe(AI);
  });

  it('detects a horizontal win', () => {
    const board = boardFromMoves([
      [0, HUMAN], [0, AI],
      [1, HUMAN], [1, AI],
      [2, HUMAN], [2, AI],
      [3, HUMAN],
    ]);
    expect(getWinningCells(board, 5, 3, HUMAN)).toHaveLength(4);
  });

  it('detects a vertical win', () => {
    const board = boardFromMoves([
      [0, HUMAN], [1, AI],
      [0, HUMAN], [1, AI],
      [0, HUMAN], [1, AI],
      [0, HUMAN],
    ]);
    expect(getWinningCells(board, 2, 0, HUMAN)).toHaveLength(4);
  });

  it('detects a down-right diagonal win', () => {
    const board = boardFromMoves([
      [0, HUMAN], [1, AI], [1, HUMAN], [2, AI],
      [2, HUMAN], [3, AI], [2, HUMAN], [3, AI],
      [3, HUMAN], [4, AI], [3, HUMAN],
    ]);
    expect(getWinningCells(board, 2, 2, HUMAN)).toHaveLength(4);
  });

  it('does not treat three pieces as a win', () => {
    const board = boardFromMoves([
      [0, HUMAN], [1, AI],
      [1, HUMAN], [2, AI],
      [2, HUMAN],
    ]);
    expect(getWinningCells(board, 5, 2, HUMAN)).toHaveLength(0);
  });

  it('reports a terminal win state', () => {
    const board = boardFromMoves([
      [0, HUMAN], [0, AI],
      [1, HUMAN], [1, AI],
      [2, HUMAN], [2, AI],
      [3, HUMAN],
    ]);
    const state = getTerminalState(board, { row: 5, column: 3, player: HUMAN });
    expect(state.status).toBe('human-won');
    expect(state.winningCells).toHaveLength(4);
  });
});
