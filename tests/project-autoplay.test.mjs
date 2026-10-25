import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('spotlight offers an accessible autoplay pause control', async () => {
  const response = await fetch(new URL('/proyectos', process.env.TEST_BASE_URL || 'http://localhost:3000'), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('aria-label="Pausar cambio automático"'));
  assert.ok(html.includes('aria-label="Proyecto siguiente"'));
});

test('autoplay cleans up its timer, pauses during interaction, and respects reduced motion', async () => {
  const source = await readFile('src/components/ProjectSpotlight.tsx', 'utf8');
  for (const token of ['setTimeout(', '5000', 'clearTimeout(', 'visibilitychange', 'prefers-reduced-motion', 'onFocusCapture', 'suspended']) assert.ok(source.includes(token), token);
  const css = await readFile('src/components/ProjectSpotlight.module.css', 'utf8');
  assert.ok(css.includes('@keyframes hologramFloat'));
  assert.ok(css.includes('perspective: 800px'));
  assert.ok(css.includes('rotateZ(1.4deg)'));
  assert.ok(css.includes('translateZ(34px)'));
  assert.ok(source.includes('styles.floatLayer'));
  assert.ok(source.includes('Vista previa del proyecto siguiente'));
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
});
