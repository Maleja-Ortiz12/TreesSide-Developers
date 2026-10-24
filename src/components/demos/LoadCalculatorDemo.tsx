'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

const PALLET = { length: 120, width: 100 };
const BOXES = [
  { name: 'Pequeña', length: 30, width: 20, height: 20, kg: 4 },
  { name: 'Mediana', length: 40, width: 30, height: 25, kg: 8 },
  { name: 'Grande', length: 60, width: 40, height: 40, kg: 15 },
];
const HEIGHT = { initial: 150, min: 50, max: 200, step: 10 };

/** Tries both box orientations on the pallet footprint and keeps the one that fits more boxes per layer. */
export function calculateLoad(box: (typeof BOXES)[number], maxHeight: number) {
  const fit = (length: number, width: number) => ({
    length, width,
    columns: Math.floor(PALLET.length / length),
    rows: Math.floor(PALLET.width / width),
  });
  const [best] = [fit(box.length, box.width), fit(box.width, box.length)]
    .sort((a, b) => b.columns * b.rows - a.columns * a.rows);
  const perLayer = best.columns * best.rows;
  const layers = Math.floor(maxHeight / box.height);
  const total = perLayer * layers;
  return { ...best, perLayer, layers, total, kg: total * box.kg };
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export function LoadCalculatorDemo() {
  const [boxName, setBoxName] = useState('Mediana');
  const [maxHeight, setMaxHeight] = useState(HEIGHT.initial);
  const box = BOXES.find(item => item.name === boxName) ?? BOXES[1];
  const load = calculateLoad(box, maxHeight);
  const cells = Array.from({ length: load.perLayer }, (_, index) => ({
    x: (index % load.columns) * load.length,
    y: Math.floor(index / load.columns) * load.width,
  }));
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Palé de ejemplo · 120 × 100 cm</p>
      <div className={styles.choices} role="group" aria-label="Tipo de caja">
        {BOXES.map(item => (
          <button type="button" key={item.name} aria-label={item.name} aria-pressed={boxName === item.name} onClick={() => setBoxName(item.name)}>
            {item.name}<small className={styles.dims}>{`${item.length}×${item.width}×${item.height}`}</small>
          </button>
        ))}
      </div>
      <div className={styles.stepper}>
        <button type="button" className={styles.smallAction} aria-label="Bajar altura" disabled={maxHeight <= HEIGHT.min}
          onClick={() => setMaxHeight(value => Math.max(HEIGHT.min, value - HEIGHT.step))}>−</button>
        <span>{`Altura máxima: ${maxHeight} cm`}</span>
        <button type="button" className={styles.smallAction} aria-label="Subir altura" disabled={maxHeight >= HEIGHT.max}
          onClick={() => setMaxHeight(value => Math.min(HEIGHT.max, value + HEIGHT.step))}>+</button>
      </div>
      <svg className={styles.layer} viewBox={`0 0 ${PALLET.length} ${PALLET.width}`} role="img"
        aria-label={`Distribución de una capa: ${load.columns} por ${load.rows} cajas de ${load.length}×${load.width} cm`}>
        <rect width={PALLET.length} height={PALLET.width} className={styles.pallet} />
        {cells.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-box="true" x={x + 0.8} y={y + 0.8} width={load.length - 1.6} height={load.width - 1.6} rx="1.5" className={styles.box} />
        ))}
      </svg>
      <p className={styles.status} role="status">
        {`${plural(load.perLayer, 'caja', 'cajas')} por capa · ${plural(load.layers, 'capa', 'capas')} · ${plural(load.total, 'caja', 'cajas')} · ${load.kg} kg`}
      </p>
      <button type="button" className={styles.reset} onClick={() => { setBoxName('Mediana'); setMaxHeight(HEIGHT.initial); }}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar cálculo
      </button>
    </div>
  );
}
