import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('home renders its isolated redesign with the compact preserved footer', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');
  assert.match(source, /<HomeRedesign\s*\/>/);
  assert.match(source, /footer=\{<HomeClosing showClosing=\{false\}\s*\/>\}/);
});
