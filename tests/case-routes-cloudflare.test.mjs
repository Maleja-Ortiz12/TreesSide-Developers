import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

// On Cloudflare (OpenNext without an incremental cache) a prerendered page cannot be read back, so
// `dynamicParams = false` turns every case page into "Internal: NoFallbackError" and a 404.
test('S28 case pages may render on demand, so they do not depend on a prerender cache', async () => {
  const source = await readFile('src/app/casos/[slug]/page.tsx', 'utf8');
  assert.doesNotMatch(source, /dynamicParams\s*=\s*false/);
  assert.match(source, /notFound\(\)/, 'unknown slugs still answer 404');
});

test('S28 the three case pages answer 200, also for client navigation, and unknown ones 404', async () => {
  for (const slug of ['la-lupe', 'emisoras-latinas', 'tengoya']) {
    const html = await fetch(`${base}/casos/${slug}`);
    assert.equal(html.status, 200, slug);
    const rsc = await fetch(`${base}/casos/${slug}?_rsc=test`, { headers: { RSC: '1' } });
    assert.equal(rsc.status, 200, `${slug} RSC`);
  }
  const missing = await fetch(`${base}/casos/no-existe`);
  assert.equal(missing.status, 404);
});
