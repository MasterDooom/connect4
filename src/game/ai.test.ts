import { AI, HUMAN } from './constants';
import { createEmptyBoard, dropPiece } from './board';
import { getWinningCells } from './rules';

describe('AI-facing game primitives', () => {
  it('rejects a full column', () => {
    let board = createEmptyBoard();
    for (let i = 0; i < 6; i += 1) {
      board = dropPiece(board, 0, i % 2 === 0 ? HUMAN : AI)!.board;
    }
    expect(dropPiece(board, 0, AI)).toBeNull();
  });

  it('detects a diagonal down-left win', () => {
    let board = createEmptyBoard();
    const moves: [number, 1 | 2][] = [
      [3, HUMAN],
      [2, AI], [2, HUMAN],
      [1, AI], [1, AI], [1, HUMAN],
      [0, AI], [0, AI], [0, AI], [0, HUMAN],
    ];

    for (const [column, player] of moves) {
      board = dropPiece(board, column, player)!.board;
    }

    expect(getWinningCells(board, 2, 3, HUMAN)).toHaveLength(4);
  });
});
