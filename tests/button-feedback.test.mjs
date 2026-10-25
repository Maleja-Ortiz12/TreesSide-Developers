import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('project autoplay and its displayed interval use five seconds', async () => {
  const source = await readFile('src/components/ProjectSpotlight.tsx', 'utf8');
  assert.ok(source.includes('% projects.length), 5000)'));
  assert.ok(source.includes('Cada 5 segundos, una nueva historia.'));
});

test('shared button feedback includes hover, press, selection, keyboard focus and reduced motion', async () => {
  const css = await readFile('src/app/globals.css', 'utf8');
  const feedback = css.split('/* Shared interactive feedback */')[1];
  assert.ok(feedback, 'shared button styles');
  for (const token of [':where(button, a.btn, a.btn-outline-pill, nav a)', ':not(:disabled)', ':not([aria-disabled="true"])', '@media (hover: hover) and (pointer: fine)', ':hover', ':active', ':focus-visible', '[aria-pressed="true"]', '[aria-expanded="true"]', '[aria-current="page"]', 'prefers-reduced-motion: reduce']) assert.ok(feedback.includes(token), token);
  assert.ok(feedback.includes('transition: none'));
});
