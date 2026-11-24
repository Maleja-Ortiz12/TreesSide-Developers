import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Cloudflare's Next.js build derives the WORKER_SELF_REFERENCE service binding from the package
// name; it must name the deployed Worker (treesside-developers), not the public brand (TreesSet).
test('package name matches the deployed Cloudflare Worker for its self-reference binding', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  assert.equal(pkg.name, 'treesside-developers');
  assert.equal(lock.name, 'treesside-developers');
  assert.equal(lock.packages[''].name, 'treesside-developers');
});
