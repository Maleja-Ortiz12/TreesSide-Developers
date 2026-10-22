import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(new URL('/servicios', base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return response.text();
}
async function technologyNames() {
  const source = await readFile('src/data/content.ts', 'utf8');
  const block = source.match(/export const TECHNOLOGIES[\s\S]*?\];/)?.[0];
  assert.ok(block);
  return [...block.matchAll(/name: '([^']+)'/g)].map(m => m[1]);
}
function card(html, name) {
  const escaped = name.replace(/&/g, '&amp;').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<div[^>]*data-tech="${escaped}"[\\s\\S]*?</svg>|<div[^>]*data-tech="${escaped}"[\\s\\S]*?data-tech-fallback`))?.[0];
}

test('every technology card renders its own SVG logo instead of initials', async () => {
  const html = await home();
  const names = await technologyNames();
  assert.equal(names.length, 26);
  for (const name of names) {
    const markup = card(html, name);
    assert.ok(markup, `missing card: ${name}`);
    assert.ok(markup.includes('<svg'), `missing logo: ${name}`);
    assert.ok(!markup.includes('data-tech-fallback'), `fallback initials shown: ${name}`);
  }
});

test('technology cards use a 3D animation that respects reduced motion', async () => {
  const html = await home();
  assert.equal((html.match(/class="[^"]*tech-card-3d/g) || []).length, 26);
  // styled-jsx is injected on the client in this app, so the CSS is checked at its source.
  const css = await readFile('src/components/TechStackSection.tsx', 'utf8');
  assert.ok(css.includes('transform-style: preserve-3d'));
  assert.ok(/@keyframes tech-orbit/.test(css));
  assert.ok(/animation: tech-orbit/.test(css));
  assert.ok(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/.test(css));
});
