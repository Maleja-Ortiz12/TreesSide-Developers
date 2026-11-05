import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('home keeps the hero first, carousel next and demos last before the closing footer', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');
  assert.match(source, /<Hero\s*\/>\s*<ProjectCarousel\s*\/>\s*<HomeDemos\s*\/>/);
  assert.match(source, /footer=\{<HomeClosing\s*\/>\}/);
});
