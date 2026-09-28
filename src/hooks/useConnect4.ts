import { useCallback, useEffect, useRef, useState } from 'react';
import { findBestMove } from '../ai/minimax';
import { createEmptyBoard, dropPiece, getLegalMoves } from '../game/board';
import { AI, HUMAN } from '../game/constants';
import { getTerminalState } from '../game/rules';
import type { Board, GameStatus, Player } from '../game/types';

export interface Connect4State {
  board: Board;
  status: GameStatus;
  winningCells: readonly [number, number][];
  lastMove: { row: number; column: number; player: Player } | null;
  previewColumn: number | null;
  aiThinking: boolean;
  aiNodes: number | null;
  moveCount: number;
  difficulty: number;
  setDifficulty: (depth: number) => void;
  playColumn: (column: number) => void;
  setPreviewColumn: (column: number | null) => void;
  newGame: () => void;
}

export function useConnect4(): Connect4State {
  const [board, setBoard] = useState(createEmptyBoard);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [winningCells, setWinningCells] = useState<readonly [number, number][]>([]);
  const [lastMove, setLastMove] = useState<Connect4State['lastMove']>(null);
  const [previewColumn, setPreviewColumn] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiNodes, setAiNodes] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [difficulty, setDifficulty] = useState(6);
  const generation = useRef(0);
  const aiTimeout = useRef<number | null>(null);

  useEffect(() => () => {
    generation.current += 1;
    if (aiTimeout.current !== null) {
      window.clearTimeout(aiTimeout.current);
      aiTimeout.current = null;
    }
  }, []);

  const newGame = useCallback(() => {
    generation.current += 1;
    if (aiTimeout.current !== null) {
      window.clearTimeout(aiTimeout.current);
      aiTimeout.current = null;
    }
    setBoard(createEmptyBoard());
    setStatus('playing');
    setWinningCells([]);
    setLastMove(null);
    setPreviewColumn(null);
    setAiThinking(false);
    setAiNodes(null);
    setMoveCount(0);
  }, []);

  const playColumn = useCallback((column: number) => {
    if (status !== 'playing' || aiThinking || !getLegalMoves(board).includes(column)) return;

    const result = dropPiece(board, column, HUMAN);
    if (!result) return;

    const terminal = getTerminalState(result.board, {
      row: result.row,
      column: result.column,
      player: HUMAN,
    });

    setBoard(result.board);
    setStatus(terminal.status);
    setWinningCells(terminal.winningCells);
    setLastMove({
      row: result.row,
      column: result.column,
      player: HUMAN,
    });
    setMoveCount((count) => count + 1);
    setPreviewColumn(null);

    if (terminal.status !== 'playing') return;

    const currentGeneration = generation.current;
    setAiThinking(true);
    setAiNodes(null);

    aiTimeout.current = window.setTimeout(() => {
      if (generation.current !== currentGeneration) return;

      try {
        const search = findBestMove(result.board, difficulty);
        if (generation.current !== currentGeneration) return;

        const aiMove = dropPiece(result.board, search.column, AI);
        if (!aiMove) return;

        const aiTerminal = getTerminalState(aiMove.board, {
          row: aiMove.row,
          column: aiMove.column,
          player: AI,
        });

        setBoard(aiMove.board);
        setStatus(aiTerminal.status);
        setWinningCells(aiTerminal.winningCells);
        setLastMove({
          row: aiMove.row,
          column: aiMove.column,
          player: AI,
        });
        setMoveCount((count) => count + 1);
        setAiNodes(search.nodes);
      } finally {
        aiTimeout.current = null;
        if (generation.current === currentGeneration) {
          setAiThinking(false);
        }
      }
    }, 140);
  }, [aiThinking, board, difficulty, status]);

  return {
    board,
    status,
    winningCells,
    lastMove,
    previewColumn,
    aiThinking,
    aiNodes,
    moveCount,
    difficulty,
    setDifficulty,
    playColumn,
    setPreviewColumn,
    newGame,
  };
}