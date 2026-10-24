'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

/** Site-wide motion settings: visitors who ask their system to reduce motion get fades without movement. */
export function MotionShell({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
