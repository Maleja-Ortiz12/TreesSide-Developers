'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const DURATION = 0.9;

/**
 * Brings its content in from below with a slight 3D tilt the first time it scrolls into view.
 * Every value ends at its identity so motion writes `transform: none`; a lingering transform would
 * turn this wrapper into the containing block of fixed descendants such as the project modal.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 70, rotateX: 14, scale: 0.96, transformPerspective: 1200 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, transformPerspective: 0 }}
      // amount 0 so very tall sections still trigger; the margin waits until they are slightly inside the screen.
      viewport={{ once: true, amount: 0, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: DURATION, delay, ease: [0.16, 1, 0.3, 1],
        // Keep the depth for the whole entrance, then drop it in one step once the tilt is flat.
        transformPerspective: { duration: 0, delay: delay + DURATION },
      }}
      style={{ transformOrigin: '50% 0%' }}
    >
      {children}
    </motion.div>
  );
}
