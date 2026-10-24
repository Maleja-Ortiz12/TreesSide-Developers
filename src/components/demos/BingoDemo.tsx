'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

const CARD = [
  [4, 11, 23],
  [8, 16, 27],
  [2, 19, 30],
];
// Fixed draw order for 1-30 so every visitor sees the same game.
const DRAW_ORDER = [16, 5, 11, 21, 19, 14, 4, 26, 23, 1, 8, 13, 27, 6, 2, 28, 30, 3, 7, 9, 10, 12, 15, 17, 18, 20, 22, 24, 25, 29];
const LINES = [
  ...CARD,
  ...CARD.map((_, column) => CARD.map(row => row[column])),
  CARD.map((row, index) => row[index]),
  CARD.map((row, index) => row[row.length - 1 - index]),
];

export function BingoDemo() {
  const [drawn, setDrawn] = useState(0);
  const balls = DRAW_ORDER.slice(0, drawn);
  const isMarked = (number: number) => balls.includes(number);
  const line = LINES.some(numbers => numbers.every(isMarked));
  const bingo = CARD.every(row => row.every(isMarked));
  const last = balls[balls.length - 1];
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Cartón de ejemplo · Bingo del 1 al 30</p>
      <div className={styles.bingoCard} role="grid" aria-label="Cartón de bingo">
        {CARD.map(row => (
          <div role="row" key={row.join('-')}>
            {row.map(number => (
              <span role="gridcell" key={number} data-marked={isMarked(number)} aria-label={`${number}${isMarked(number) ? ', marcado' : ''}`}>{number}</span>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.ballInfo}>
        <span>{`Balotas: ${drawn} de ${DRAW_ORDER.length}`}</span>
        <strong className={styles.ball} aria-hidden="true">{last ?? '–'}</strong>
      </p>
      <p className={styles.status} role="status">
        {bingo ? `¡Bingo! Cartón completo con ${drawn} balotas.`
          : line ? `¡Línea! Salió el ${last}; sigue jugando por el cartón completo.`
          : last ? `Salió el ${last}.` : 'Saca una balota para empezar.'}
      </p>
      <button type="button" className="btn btn-secondary" disabled={bingo || drawn === DRAW_ORDER.length}
        onClick={() => setDrawn(count => Math.min(count + 1, DRAW_ORDER.length))}>
        Sacar balota
      </button>
      <button type="button" className={styles.reset} onClick={() => setDrawn(0)}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar bingo
      </button>
    </div>
  );
}
