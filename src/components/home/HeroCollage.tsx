'use client';

import { useState, type ReactNode } from 'react';
import styles from './HomeRedesign.module.css';

// Keep artwork server-rendered; only the persistent motion control needs client state.
export function HeroCollage({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <div className={styles.collageScene}>
    <div id="hero-collage" className={styles.collage} data-motion={paused ? 'paused' : 'running'} aria-label="Una web real y dos propuestas visuales">
      {children}
    </div>
    <button type="button" className={styles.motionControl} aria-controls="hero-collage" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? 'Reanudar animación' : 'Pausar animación'}
    </button>
  </div>;
}
