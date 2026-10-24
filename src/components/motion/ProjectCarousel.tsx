'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { FEATURED_PROJECTS, type Project } from '@/data/content';
import { caseHref } from '@/data/cases';
import styles from './ProjectCarousel.module.css';

const PLACEHOLDER = '/images/treesside-logo.jpg';
const SPEED = 42; // px per second
// 14 cards of 300px + 20px gap ≈ 4480px per copy, wider than a 4K screen, so the loop never shows a gap.
const MIN_CARDS_PER_COPY = 14;

/** Repeats the whole list until it has at least `min` items, keeping the same order on every lap. */
export function repeatToMinimum<T>(list: T[], min: number): T[] {
  if (list.length === 0) return [];
  const laps = Math.max(1, Math.ceil(min / list.length));
  return Array.from({ length: laps }, () => list).flat();
}

/** Keeps the strip offset inside (-width, 0] so the duplicated half loops without a visible jump. */
export function wrapOffset(x: number, width: number) {
  if (width <= 0) return 0;
  return (((x % width) - width) % width) || 0;
}

function Item({ project, copy }: { project: Project; copy?: boolean }) {
  return (
    <Link href={caseHref(project.title) ?? '/proyectos'} className={styles.item} data-carousel-item="" tabIndex={copy ? -1 : undefined} aria-hidden={copy || undefined}>
      <Image src={project.image} alt={copy ? '' : project.title} fill sizes="300px" className={styles.image}
        style={{ objectFit: project.imageFit ?? 'cover' }} />
      <span className={styles.caption}><strong>{project.title}</strong><small>{project.owner}</small></span>
    </Link>
  );
}

function Row({ projects, direction, paused }: { projects: Project[]; direction: 1 | -1; paused: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  // Only the first lap is announced and focusable; the extra laps just fill very wide screens.
  const cards = repeatToMinimum(projects, MIN_CARDS_PER_COPY);
  // Starts at rest and eases to full speed, so reduced-motion visitors never see it drift; stops the same way.
  const speed = useSpring(0, { stiffness: 70, damping: 18 });
  useEffect(() => { speed.set(paused || reduce ? 0 : 1); }, [paused, reduce, speed]);
  useAnimationFrame((_, delta) => {
    const half = (track.current?.scrollWidth ?? 0) / 2;
    const step = (SPEED * delta / 1000) * speed.get();
    if (step) x.set(wrapOffset(x.get() - direction * step, half));
  });
  return (
    <div className={styles.viewport} data-reduced={reduce || undefined}>
      <motion.div ref={track} className={styles.track} style={{ x }}>
        <div className={styles.set}>
          {cards.map((project, index) => <Item key={`${project.id}-${index}`} project={project} copy={index >= projects.length} />)}
        </div>
        <div className={styles.set} aria-hidden="true" data-carousel-copy="">
          {cards.map((project, index) => <Item key={`${project.id}-${index}`} project={project} copy />)}
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectCarousel() {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const projects = FEATURED_PROJECTS.filter(project => !project.experience && project.image !== PLACEHOLDER);
  const rows = [projects.filter((_, index) => index % 2 === 0), projects.filter((_, index) => index % 2 === 1)];
  const stopped = paused || hovered || focused;
  return (
    <section id="carrusel" className={styles.section} aria-labelledby="carrusel-title">
      <div className={`container ${styles.heading}`}>
        <div>
          <span className="kicker">PORTAFOLIO EN MOVIMIENTO</span>
          <h2 id="carrusel-title" className="section-title">Proyectos que ya construimos</h2>
          <p className="section-subtitle">Sitios, plataformas y aplicaciones reales del equipo. Pasa el mouse para detener la cinta.</p>
        </div>
        <button type="button" className={styles.toggle} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          {paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
        </button>
      </div>
      <div className={styles.stage}
        onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        <div className={styles.plane}>
          <Row projects={rows[0]} direction={1} paused={stopped} />
          <Row projects={rows[1]} direction={-1} paused={stopped} />
        </div>
      </div>
    </section>
  );
}
