import { AI, COLS, HUMAN, ROWS } from '../game/constants';
import type { Board, Cell } from '../game/types';

const WINDOW_SCORES = {
  three: 100,
  two: 10,
  center: 3,
} as const;

function scoreWindow(window: Cell[]): number {
  const ai = window.filter((cell) => cell === AI).length;
  const human = window.filter((cell) => cell === HUMAN).length;
  const empty = window.filter((cell) => cell === 0).length;

  if (ai > 0 && human > 0) return 0;
  if (ai === 3 && empty === 1) return WINDOW_SCORES.three;
  if (ai === 2 && empty === 2) return WINDOW_SCORES.two;
  if (human === 3 && empty === 1) return -WINDOW_SCORES.three;
  if (human === 2 && empty === 2) return -WINDOW_SCORES.two;

  return 0;
}

export function evaluateBoard(board: Board): number {
  let score = 0;

  for (let row = 0; row < ROWS; row += 1) {
    if (board[row][Math.floor(COLS / 2)] === AI) score += WINDOW_SCORES.center;
    if (board[row][Math.floor(COLS / 2)] === HUMAN) score -= WINDOW_SCORES.center;
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLS - 3; column += 1) {
      score += scoreWindow(board[row].slice(column, column + 4));
    }
  }

  for (let row = 0; row < ROWS - 3; row += 1) {
    for (let column = 0; column < COLS; column += 1) {
      score += scoreWindow([
        board[row][column],
        board[row + 1][column],
        board[row + 2][column],
        board[row + 3][column],
      ]);
    }
  }

  for (let row = 0; row < ROWS - 3; row += 1) {
    for (let column = 0; column < COLS - 3; column += 1) {
      score += scoreWindow([
        board[row][column],
        board[row + 1][column + 1],
        board[row + 2][column + 2],
        board[row + 3][column + 3],
      ]);
    }
  }

  for (let row = 0; row < ROWS - 3; row += 1) {
    for (let column = 3; column < COLS; column += 1) {
      score += scoreWindow([
        board[row][column],
        board[row + 1][column - 1],
        board[row + 2][column - 2],
        board[row + 3][column - 3],
      ]);
    }
  }

  return score;
}
