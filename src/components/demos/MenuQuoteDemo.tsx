'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

// Dishes and prices as published on lalupe.co.
const DISHES: { name: string; price: number }[] = [
  { name: 'Carne a la tampiqueña', price: 42900 },
  { name: 'Nachos grandes', price: 38900 },
  { name: 'Combo "mero mero"', price: 42900 },
  { name: 'Flautas', price: 35900 },
];

const pesos = (value: number) => `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

export function MenuQuoteDemo() {
  const [order, setOrder] = useState<Record<string, number>>({});
  const [quote, setQuote] = useState<string | null>(null);
  const change = (name: string, delta: number) => {
    setQuote(null);
    setOrder(current => ({ ...current, [name]: Math.max(0, (current[name] ?? 0) + delta) }));
  };
  const items = DISHES.filter(dish => (order[dish.name] ?? 0) > 0);
  const total = items.reduce((sum, dish) => sum + dish.price * order[dish.name], 0);
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Menú de ejemplo · Arma tu pedido</p>
      <ul className={styles.list}>
        {DISHES.map(({ name, price }) => {
          const units = order[name] ?? 0;
          return (
            <li key={name} className={styles.row}>
              <span>{name}<small>{`${pesos(price)}${units ? ` · ${units} en el pedido` : ''}`}</small></span>
              <span className={styles.rowActions}>
                <button type="button" className={styles.smallAction} aria-label={`Quitar ${name}`} disabled={units === 0}
                  onClick={() => change(name, -1)}>−</button>
                <button type="button" className={styles.smallAction} aria-label={`Agregar ${name}`}
                  onClick={() => change(name, 1)}>+</button>
              </span>
            </li>
          );
        })}
      </ul>
      <p className={styles.status} role="status">
        {quote ?? `Total: ${pesos(total)}`}
      </p>
      <button type="button" className="btn btn-secondary" disabled={items.length === 0}
        onClick={() => setQuote(`Hola La Lupe, quiero cotizar: ${items.map(dish => `${order[dish.name]} × ${dish.name}`).join(', ')}. Total estimado: ${pesos(total)}`)}>
        Preparar cotización
      </button>
      <button type="button" className={styles.reset} onClick={() => { setOrder({}); setQuote(null); }}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar pedido
      </button>
    </div>
  );
}
