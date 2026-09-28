import { useCallback, useState } from 'react';
import { createEmptyBoard, dropPiece, getLegalMoves } from '../game/board';
import { HUMAN } from '../game/constants';
import { getTerminalState } from '../game/rules';
import type { Board, GameStatus } from '../game/types';

export interface Connect4State {
  board: Board;
  status: GameStatus;
  winningCells: readonly [number, number][];
  previewColumn: number | null;
  aiThinking: boolean;
  playColumn: (column: number) => void;
  setPreviewColumn: (column: number | null) => void;
  newGame: () => void;
}

export function useConnect4(): Connect4State {
  const [board, setBoard] = useState(createEmptyBoard);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [winningCells, setWinningCells] = useState<readonly [number, number][]>([]);
  const [previewColumn, setPreviewColumn] = useState<number | null>(null);

  const playColumn = useCallback((column: number) => {
    if (status !== 'playing' || !getLegalMoves(board).includes(column)) return;

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
    setPreviewColumn(null);
  }, [board, status]);

  const newGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setStatus('playing');
    setWinningCells([]);
    setPreviewColumn(null);
  }, []);

  return {
    board,
    status,
    winningCells,
    previewColumn,
    aiThinking: false,
    playColumn,
    setPreviewColumn,
    newGame,
  };
}
