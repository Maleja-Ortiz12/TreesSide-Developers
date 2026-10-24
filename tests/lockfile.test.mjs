import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Without `libc`, npm on Linux (Netlify) cannot tell glibc and musl builds apart and may install both.
test('S4 Linux native sharp and swc packages declare their libc in package-lock.json', async () => {
  const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  const native = Object.entries(lock.packages).filter(([key]) => /(sharp|swc)[^/]*linux/.test(key) || /linux[^/]*(gnu|musl)/.test(key));
  assert.ok(native.length >= 10, `native Linux packages found: ${native.length}`);
  for (const [key, entry] of native) {
    const expected = key.includes('musl') ? 'musl' : 'glibc';
    assert.deepEqual(entry.libc, [expected], `${key} libc`);
  }
  assert.ok(lock.packages['node_modules/motion'], 'motion stays locked');
});
