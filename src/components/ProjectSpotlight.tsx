'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Maximize2, Pause, Play } from 'lucide-react';
import type { Project } from '@/data/content';
import styles from './ProjectSpotlight.module.css';

export function ProjectSpotlight({ projects, onOpen, suspended = false }: { projects: Project[]; onOpen: (project: Project) => void; suspended?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  // Preserve the pointer's intent before focus pauses rotation.
  const pointerIntent = useRef<boolean | null>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotion = () => { if (motion.matches) setPaused(true); };
    const trackVisibility = () => setVisible(!document.hidden);
    respectMotion();
    trackVisibility();
    motion.addEventListener('change', respectMotion);
    document.addEventListener('visibilitychange', trackVisibility);
    return () => {
      motion.removeEventListener('change', respectMotion);
      document.removeEventListener('visibilitychange', trackVisibility);
    };
  }, []);

  const running = !paused && visible && !suspended && projects.length > 1;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % projects.length), 5000);
    return () => window.clearTimeout(timer);
  }, [running, index, projects.length]);
  if (!projects.length) return null;
  const project = projects[index % projects.length];
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const navigate = (step: number) => setIndex(current => (current + step + projects.length) % projects.length);

  return (
    <div className={styles.spotlight} role="region" aria-label="Proyecto en primer plano" aria-roledescription="carrusel"
      onFocusCapture={() => setPaused(true)}>
      <div className={styles.topline}>
        <span>EN PRIMER PLANO</span>
        <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
      </div>
      <div key={project.id} className={styles.scene}>
        <div className={styles.hologram}>
          <span className={styles.halo} aria-hidden="true" />
          <span className={styles.orbit} aria-hidden="true" />
          {projects.length > 1 && <button className={`${styles.preview} ${styles.previousPreview}`} onClick={() => navigate(-1)} aria-label="Vista previa del proyecto anterior">
            <Image src={previous.image} alt="" fill sizes="180px" style={{ objectFit: 'cover' }} />
            <span>{previous.title}</span>
          </button>}
          <div className={styles.depthLayer}>
            <div className={styles.floatLayer}>
              <button className={styles.visual} onClick={() => onOpen(project)} aria-label="Ver detalles del proyecto destacado">
                <Image src={project.image} alt={`Vista de ${project.title}`} fill sizes="(max-width: 850px) 85vw, 48vw" style={{ objectFit: project.imageFit ?? 'contain' }} />
                <span className={styles.zoom}><Maximize2 size={18} aria-hidden="true" /> Explorar</span>
              </button>
            </div>
          </div>
          {projects.length > 2 && <button className={`${styles.preview} ${styles.nextPreview}`} onClick={() => navigate(1)} aria-label="Vista previa del proyecto siguiente">
            <Image src={next.image} alt="" fill sizes="180px" style={{ objectFit: 'cover' }} />
            <span>{next.title}</span>
          </button>}
        </div>
        <div className={styles.info} aria-live={running ? 'off' : 'polite'} aria-atomic="true">
          <span className={styles.category}>{project.category}</span>
          <h2>{project.title}</h2>
          <p className={styles.author}>{`${project.experience ? 'Experiencia laboral' : 'Proyecto del equipo'} · ${project.owner}`}</p>
          <p className={styles.description}>{project.description}</p>
          <p className={styles.stack}>{project.tag}</p>
          {project.imageLabel && <p className={styles.note}>{project.imageLabel}</p>}
          <button className="btn btn-primary" onClick={() => onOpen(project)}>Descubrir proyecto <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={styles.navigation}>
        <p>{paused ? 'Explora a tu ritmo.' : 'Cada 5 segundos, una nueva historia.'}</p>
        <div className={styles.controls}>
          <button
            onPointerDown={() => { pointerIntent.current = !paused; }}
            onPointerCancel={() => { pointerIntent.current = null; }}
            onBlur={() => { pointerIntent.current = null; }}
            onClick={() => {
              setPaused(pointerIntent.current ?? !paused);
              pointerIntent.current = null;
            }} disabled={projects.length < 2}
            aria-label={paused ? 'Reanudar cambio automático' : 'Pausar cambio automático'}>
            {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
          <button onClick={() => navigate(-1)} disabled={projects.length < 2} aria-label="Proyecto anterior"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button onClick={() => navigate(1)} disabled={projects.length < 2} aria-label="Proyecto siguiente"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
