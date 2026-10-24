'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

const INITIAL_STOCK: Record<string, number> = {
  'Ovillo de lana merino': 3,
  'Fragancia de lavanda': 2,
  'Agujas de tejer': 6,
};
const LOW_STOCK = 2;

export function InventoryDemo() {
  const [stock, setStock] = useState<Record<string, number>>(INITIAL_STOCK);
  const change = (name: string, delta: number) =>
    setStock(current => ({ ...current, [name]: Math.max(0, current[name] + delta) }));
  const low = Object.values(stock).filter(units => units <= LOW_STOCK).length;
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Tienda de ejemplo · Lanas y fragancias</p>
      <ul className={styles.list}>
        {Object.entries(stock).map(([name, units]) => (
          <li key={name} className={styles.row}>
            <span>{name}
              <small data-tone={units === 0 ? 'out' : units <= LOW_STOCK ? 'low' : undefined}>
                {`${units} ${units === 1 ? 'unidad' : 'unidades'} · ${units === 0 ? 'Sin existencias' : units <= LOW_STOCK ? 'Stock bajo' : 'Disponible'}`}
              </small>
            </span>
            <span className={styles.rowActions}>
              <button type="button" className={styles.smallAction} aria-label={`Vender ${name}`} disabled={units === 0}
                onClick={() => change(name, -1)}>−</button>
              <button type="button" className={styles.smallAction} aria-label={`Reponer ${name}`}
                onClick={() => change(name, 1)}>+</button>
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.status} role="status">
        {low === 0 ? 'Todo el inventario está disponible.' : `${low} ${low === 1 ? 'producto' : 'productos'} con stock bajo`}
      </p>
      <button type="button" className={styles.reset} onClick={() => setStock(INITIAL_STOCK)}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar inventario
      </button>
    </div>
  );
}
