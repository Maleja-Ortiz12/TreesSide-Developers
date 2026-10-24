'use client';

import { useEffect } from 'react';
import { animate } from 'motion/react';

export const MAX_TILT = 9;
/** Cards that lean toward the mouse. 3D tech cards already run their own animation. */
export const TILT_SELECTOR = ':is(.glass-card, #demos article, [data-tilt]):not(.tech-card-3d)';
const SPRING = { type: 'spring', stiffness: 260, damping: 22, mass: 0.6 } as const;
// While tilting, the card's CSS `transition: all` would smooth every spring frame a second time.
const TILT_TRANSITION = 'border-color .3s ease, box-shadow .3s ease, background .3s ease';

type Rect = { left: number; top: number; width: number; height: number };
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Rotation in degrees that leans the card toward the pointer: flat at the center, MAX_TILT at the edges. */
export function tiltFor(rect: Rect, x: number, y: number) {
  const relX = clamp01((x - rect.left) / rect.width);
  const relY = clamp01((y - rect.top) / rect.height);
  return { rotateX: (0.5 - relY) * 2 * MAX_TILT, rotateY: (relX - 0.5) * 2 * MAX_TILT };
}

/** Adds the 3D tilt to every matching card on the page through one delegated pointer listener. */
export function TiltEffect() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !finePointer) return;

    let active: HTMLElement | null = null;
    const savedTransition = new Map<HTMLElement, string>();

    const release = (el: HTMLElement) => {
      animate(el, { rotateX: 0, rotateY: 0, y: 0, scale: 1 }, SPRING).then(() => {
        if (active === el) return;
        el.style.transform = '';
        el.style.transition = savedTransition.get(el) ?? '';
        savedTransition.delete(el);
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      let el = (event.target as Element | null)?.closest?.<HTMLElement>(TILT_SELECTOR) ?? null;
      // Leaning a card while someone types in it is distracting.
      if (el?.querySelector('input, textarea, select')) el = null;
      if (el !== active) {
        if (active) release(active);
        active = el;
        if (el) {
          if (!savedTransition.has(el)) savedTransition.set(el, el.style.transition);
          el.style.transition = TILT_TRANSITION;
        }
      }
      if (!el) return;
      const { rotateX, rotateY } = tiltFor(el.getBoundingClientRect(), event.clientX, event.clientY);
      animate(el, { rotateX, rotateY, y: -6, scale: 1.02, transformPerspective: 900 }, SPRING);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}
