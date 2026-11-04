'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, Search, ShoppingCart, Radio, Heart, SkipBack, SkipForward, Play, Box } from 'lucide-react';
import styles from './Home.module.css';

const MENU = [
  { name: 'Hamburguesa', price: '$28.000', image: '/images/mockup/hero-food-1.webp' },
  { name: 'Pizza', price: '$35.000', image: '/images/mockup/hero-food-2.webp' },
  { name: 'Bebidas', price: '$7.000', image: '/images/mockup/hero-food-3.webp' },
];
const PALLETS = [['Pallets', '124'], ['En tránsito', '36'], ['Entregados', '88']];
// Fixed heights keep server and client markup identical.
const WAVE = [18, 34, 52, 30, 70, 44, 88, 60, 96, 72, 50, 84, 64, 40, 76, 56, 30, 48, 22, 36, 16, 28, 12, 20];
const BARS = [22, 30, 38, 52, 64, 78, 92];

/** The mockup tree with its three demo cards as real HTML, so they stay sharp and move in depth. */
export function HeroScene() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 900px)');
    const hero = node.closest('section') ?? node;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (!allowed.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = node.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2));
        node.style.setProperty('--px', x.toFixed(3));
        node.style.setProperty('--py', y.toFixed(3));
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      node.style.setProperty('--px', '0');
      node.style.setProperty('--py', '0');
    };
    hero.addEventListener('pointermove', onMove as EventListener, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', onMove as EventListener);
      hero.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div ref={scene} className={styles.heroScene} data-hero-scene="">
      <Image src="/images/mockup/home-hero.webp" alt="" aria-hidden="true" width={1316} height={872} priority className={styles.heroArt} />
      <div className={styles.heroCards} aria-hidden="true">
        <div className={`${styles.heroCard} ${styles.cardRestaurant}`} data-hero-card="restaurante">
          <div className={styles.cardTop}><UtensilsCrossed /><strong>Restaurante</strong><span className={styles.cardIcons}><Search /><ShoppingCart /></span></div>
          <div className={styles.restaurantBody}>
            <Image src="/images/mockup/hero-burger.webp" alt="" width={190} height={185} className={styles.burger} />
            <ul className={styles.menu}>
              {MENU.map(item => <li key={item.name}><Image src={item.image} alt="" width={40} height={38} /><span>{item.name}</span><b>{item.price}</b></li>)}
            </ul>
          </div>
        </div>
        <div className={`${styles.heroCard} ${styles.cardRadio}`} data-hero-card="radio">
          <div className={styles.cardTop}><Radio /><strong>Radio Online</strong><span className={styles.cardIcons}><Heart /></span></div>
          <div className={styles.wave}>{WAVE.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${-index * 90}ms` }} />)}</div>
          <div className={styles.player}><SkipBack /><span className={styles.play}><Play /></span><SkipForward /></div>
        </div>
        <div className={`${styles.heroCard} ${styles.cardLogistics}`} data-hero-card="logistica">
          <div className={styles.cardTop}><Box /><strong>Logística de pallets</strong></div>
          <div className={styles.logisticsBody}>
            <Image src="/images/mockup/hero-pallets.webp" alt="" width={205} height={178} className={styles.pallets} />
            <div className={styles.stock}>
              <ul>{PALLETS.map(([label, value]) => <li key={label}><i />{label}<b>{value}</b></li>)}</ul>
              <div className={styles.bars}>{BARS.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
