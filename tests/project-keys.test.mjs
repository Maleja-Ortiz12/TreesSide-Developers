import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('spotlight and project grid remount on filter change with distinct sibling keys', async () => {
  const source = await readFile('src/components/ProjectsSection.tsx', 'utf8');
  const keys = [...source.matchAll(/key=\{([^}]*activeFilter[^}]*)\}/g)].map(match => match[1]);
  assert.equal(keys.length, 2, `filter keys: ${keys}`);
  assert.equal(new Set(keys).size, keys.length, `duplicate sibling keys: ${keys}`);
});
