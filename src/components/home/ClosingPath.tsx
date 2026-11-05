'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Layers, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';
import styles from './Home.module.css';

const HEIGHT = 220; // viewBox height of the desktop line
const START = 'M0 200 C250 200 500 20 780 90';
const pathTo = (endY: number) => `${START} S930 ${endY.toFixed(1)} 1000 ${endY.toFixed(1)}`;

/**
 * The contact line and its three stops. On wide screens the line is stretched until it meets the
 * sphere's leftmost point and arrives horizontally, so it stays attached while the sphere floats up and down.
 */
export function ClosingPath() {
  const stage = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    const node = stage.current;
    const inner = node?.parentElement;
    const sphere = inner?.querySelector<HTMLElement>('[data-talk-sphere]');
    if (!node || !inner || !sphere) return;
    const desktop = window.matchMedia('(min-width: 761px)');
    const fit = () => {
      if (!desktop.matches) {
        node.style.removeProperty('width');
        node.style.removeProperty('--join-y');
        line.current?.setAttribute('d', pathTo(20));
        return;
      }
      // The sphere's own float is a transform on the sphere, so its offset box is the resting position.
      const box = inner.getBoundingClientRect();
      const holder = (sphere.offsetParent as HTMLElement).getBoundingClientRect();
      const radius = sphere.offsetWidth / 2;
      const left = holder.left - box.left + sphere.offsetLeft;
      const centerY = holder.top - box.top + sphere.offsetTop + radius;
      const width = left - node.offsetLeft;
      if (width <= 0) return;
      node.style.width = `${width}px`;
      const endY = ((centerY - node.offsetTop) / node.offsetHeight) * HEIGHT;
      line.current?.setAttribute('d', pathTo(endY));
      node.style.setProperty('--join-y', `${centerY - node.offsetTop}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(inner);
    desktop.addEventListener('change', fit);
    return () => { observer.disconnect(); desktop.removeEventListener('change', fit); };
  }, []);

  return (
    <div ref={stage} className={styles.pathStage}>
      <svg className={styles.path} data-closing-path="" viewBox={`0 0 1000 ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
        <path ref={line} d={pathTo(20)} fill="none" stroke="#62ffd0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className={styles.pathMobile} data-closing-path="" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 95 Q500 -10 1000 95" fill="none" stroke="#62ffd0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={styles.pathJoin} aria-hidden="true" />
      <nav className={styles.contactPath} aria-label="Construyamos juntos">
        <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.stopWhatsapp}><MessageCircle />WhatsApp</a>
        <a href={`mailto:${CONTACT_INFO.email}`} className={styles.stopMail}><Mail />Correo</a>
        <Link href="/proyectos" className={styles.stopProjects}><Layers />Proyectos</Link>
      </nav>
    </div>
  );
}
