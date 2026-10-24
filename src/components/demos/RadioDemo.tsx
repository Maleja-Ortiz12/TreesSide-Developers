'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

// Sample genre stations; no audio is streamed.
const STATIONS: { name: string; country: string }[] = [
  { name: 'Salsa Clásica', country: 'Colombia' },
  { name: 'Vallenato', country: 'Colombia' },
  { name: 'Rock en Español', country: 'México' },
  { name: 'Regional Mexicana', country: 'México' },
  { name: 'Bachata', country: 'República Dominicana' },
];
const COUNTRIES = ['Todas', ...Array.from(new Set(STATIONS.map(station => station.country)))];

export function RadioDemo() {
  const [country, setCountry] = useState('Todas');
  const [current, setCurrent] = useState<(typeof STATIONS)[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const visible = STATIONS.filter(station => country === 'Todas' || station.country === country);
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Directorio de ejemplo · Emisoras por país</p>
      <div className={styles.choices} role="group" aria-label="Filtrar por país">
        {COUNTRIES.map(name => (
          <button type="button" key={name} aria-pressed={country === name} onClick={() => setCountry(name)}>{name}</button>
        ))}
      </div>
      <ul className={styles.list}>
        {visible.map(station => (
          <li key={station.name}>
            <button type="button" className={styles.station} aria-label={`Escuchar ${station.name}`}
              aria-pressed={current?.name === station.name} onClick={() => { setCurrent(station); setPlaying(true); }}>
              <span>{station.name}</span><small>{station.country}</small>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.nowPlaying}>
        <span className={styles.equalizer} data-playing={playing} aria-hidden="true"><i /><i /><i /><i /></span>
        <p className={styles.status} role="status">
          {!current ? 'Elige una emisora para empezar.'
            : playing ? `En vivo (simulado): ${current.name} · ${current.country}` : `En pausa: ${current.name}`}
        </p>
      </div>
      <button type="button" className="btn btn-secondary" disabled={!current} onClick={() => setPlaying(value => !value)}>
        {playing || !current ? 'Pausar' : 'Reanudar'}
      </button>
      <button type="button" className={styles.reset} onClick={() => { setCountry('Todas'); setCurrent(null); setPlaying(false); }}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar radio
      </button>
    </div>
  );
}
