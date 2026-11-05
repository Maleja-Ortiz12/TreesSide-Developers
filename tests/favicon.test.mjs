import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

test('favicon uses new PNG URLs instead of the previously cached JPG', async () => {
  const layout = await readFile('src/app/layout.tsx', 'utf8');
  assert.match(layout, /icon: '\/images\/treesside-icon-v2\.png'/);
  assert.match(layout, /apple: '\/images\/treesside-apple-v2\.png'/);
  assert.doesNotMatch(layout, /<link rel="icon"/);
  for (const [file, size] of [['treesside-icon-v2.png', 48], ['treesside-apple-v2.png', 180]]) {
    const metadata = await sharp(`public/images/${file}`).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
  }
  const ico = await readFile('public/favicon.ico');
  assert.deepEqual([...ico.subarray(0, 4)], [0, 0, 1, 0]);
  assert.equal(ico.readUInt16LE(4), 3, '16, 32 and 48 pixel entries');
});
