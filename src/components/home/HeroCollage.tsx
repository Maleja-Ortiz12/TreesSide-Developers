'use client';

import { useEffect, useState, type ReactNode } from 'react';
import styles from './HomeRedesign.module.css';

// Bounded artwork frames are composed on the server, not from a client-side catalog.
export function HeroCollage({ children, frames }: { children: ReactNode; frames: ReactNode[] }) {
  const [paused, setPaused] = useState(false);
  // Start static until the browser's preference is known (including during hydration).
  const [reduced, setReduced] = useState(true);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || reduced || frames.length < 2) return;
    const timer = setInterval(() => setIndex(value => (value + 1) % frames.length), 6000);
    return () => clearInterval(timer);
  }, [paused, reduced, frames.length]);
  const move = (step: number) => setIndex(value => (value + step + frames.length) % frames.length);
  return <div className={styles.collageScene}>
    <div id="hero-collage" className={styles.collage} data-motion={paused || reduced ? 'paused' : 'running'} data-frame={index} aria-label="Proyectos del portafolio y propuestas visuales">
      {children}
      {frames[index]}
    </div>
    <div className={styles.artworkControls}>
      <button type="button" className={styles.artworkControl} aria-label="Composición anterior" onClick={() => move(-1)}>Anterior</button>
      <button type="button" className={styles.motionControl} aria-controls="hero-collage" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        {paused ? 'Reanudar animación' : 'Pausar animación'}
      </button>
      <button type="button" className={styles.artworkControl} aria-label="Siguiente composición" onClick={() => move(1)}>Siguiente</button>
    </div>
  </div>;
}
