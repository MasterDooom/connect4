import { AI, HUMAN } from '../game/constants';
import { dropPiece, getLegalMoves } from '../game/board';
import { getTerminalState } from '../game/rules';
import type { Board, Player } from '../game/types';
import { evaluateBoard } from './evaluation';
import { getOrderedMoves } from './moveOrdering';

const WIN_SCORE = 100_000;
const NEG_INF = Number.NEGATIVE_INFINITY;
const POS_INF = Number.POSITIVE_INFINITY;

export interface SearchResult {
  column: number;
  score: number;
  nodes: number;
}

interface SearchContext {
  nodes: number;
}

function terminalScore(
  status: ReturnType<typeof getTerminalState>['status'],
  depth: number,
): number | null {
  if (status === 'ai-won') return WIN_SCORE + depth;
  if (status === 'human-won') return -WIN_SCORE - depth;
  if (status === 'draw') return 0;
  return null;
}

function minimax(
  board: Board,
  depth: number,
  maximizing: boolean,
  alpha: number,
  beta: number,
  lastMove: { row: number; column: number; player: Player } | null,
  context: SearchContext,
): number {
  context.nodes += 1;

  const terminal = getTerminalState(board, lastMove);
  const terminalValue = terminalScore(terminal.status, depth);
  if (terminalValue !== null) return terminalValue;

  if (depth === 0) return evaluateBoard(board);

  const moves = getOrderedMoves(board);
  if (moves.length === 0) return 0;

  if (maximizing) {
    let best = NEG_INF;

    for (const column of moves) {
      const result = dropPiece(board, column, AI);
      if (!result) continue;

      const value = minimax(
        result.board,
        depth - 1,
        false,
        alpha,
        beta,
        { row: result.row, column: result.column, player: AI },
        context,
      );

      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }

    return best;
  }

  let best = POS_INF;

  for (const column of moves) {
    const result = dropPiece(board, column, HUMAN);
    if (!result) continue;

    const value = minimax(
      result.board,
      depth - 1,
      true,
      alpha,
      beta,
      { row: result.row, column: result.column, player: HUMAN },
      context,
    );

    best = Math.min(best, value);
    beta = Math.min(beta, best);
    if (alpha >= beta) break;
  }

  return best;
}

export function findBestMove(board: Board, depth: number): SearchResult {
  const legalMoves = getLegalMoves(board);
  if (legalMoves.length === 0) {
    throw new Error('Cannot search a board with no legal moves.');
  }

  const context: SearchContext = { nodes: 0 };
  let bestColumn = legalMoves[0];
  let bestScore = NEG_INF;
  let alpha = NEG_INF;

  for (const column of getOrderedMoves(board)) {
    const result = dropPiece(board, column, AI);
    if (!result) continue;

    const score = minimax(
      result.board,
      Math.max(0, depth - 1),
      false,
      alpha,
      POS_INF,
      { row: result.row, column: result.column, player: AI },
      context,
    );

    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }

    alpha = Math.max(alpha, bestScore);
  }

  return { column: bestColumn, score: bestScore, nodes: context.nodes };
}
