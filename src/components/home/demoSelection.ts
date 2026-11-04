'use client';
import { useSyncExternalStore } from 'react';
let selected = 'la-lupe';
const listeners = new Set<() => void>();
export function selectDemo(id: string) { selected = id; listeners.forEach(listener => listener()); }
export function useDemoSelection() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => selected, () => 'la-lupe');
}
