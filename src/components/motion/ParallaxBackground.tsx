'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import styles from './ParallaxBackground.module.css';

/** Far to near: deeper layers scroll faster and follow the mouse further. `tile` is the repeat height in px. */
export const LAYERS = [
  { name: 'glow', depth: 0.08, tile: 1100, shift: 14 },
  { name: 'shapes', depth: 0.22, tile: 420, shift: 30 },
  { name: 'particles', depth: 0.45, tile: 180, shift: 52 },
] as const;

/** Background offset for a scroll position, wrapped inside one tile so the pattern repeats forever. */
export function layerOffset(scrollY: number, depth: number, tile: number) {
  return -((scrollY * depth) % tile) || 0;
}

function Layer({ layer, scrollY, pointerX, pointerY, still }: {
  layer: (typeof LAYERS)[number]; scrollY: MotionValue<number>; pointerX: MotionValue<number>; pointerY: MotionValue<number>; still: boolean;
}) {
  const backgroundPositionY = useTransform(scrollY, value => `${still ? 0 : layerOffset(value, layer.depth, layer.tile)}px`);
  const x = useTransform(pointerX, value => (still ? 0 : value * layer.shift));
  const y = useTransform(pointerY, value => (still ? 0 : value * layer.shift));
  return <motion.div className={`${styles.layer} ${styles[layer.name]}`} data-depth={layer.depth} style={{ backgroundPositionY, x, y }} />;
}

/** Decorative depth layers behind every page, moved by scroll and mouse. */
export function ParallaxBackground() {
  const still = Boolean(useReducedMotion());
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 40, damping: 18 });
  const pointerY = useSpring(rawY, { stiffness: 40, damping: 18 });
  useEffect(() => {
    if (still) return;
    const onMove = (event: PointerEvent) => {
      // -1..1 from the center of the window; layers drift opposite to the pointer.
      rawX.set(-((event.clientX / window.innerWidth) * 2 - 1));
      rawY.set(-((event.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still, rawX, rawY]);
  return (
    <div className={styles.root} aria-hidden="true" data-parallax="">
      {LAYERS.map(layer => (
        <Layer key={layer.name} layer={layer} scrollY={scrollY} pointerX={pointerX} pointerY={pointerY} still={still} />
      ))}
    </div>
  );
}
