import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PAGES = ['/', '/servicios', '/proyectos', '/nosotros', '/contacto', '/equipo'];
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

test('S7 the first section of every page is visible in the server HTML without waiting for JavaScript', async () => {
  for (const path of PAGES) {
    const html = await page(path);
    const first = html.match(/<main[^>]*>\s*(<div[^>]*>)/)?.[1] ?? '';
    assert.ok(first.includes('data-reveal="first"'), `${path} first section uses the CSS entrance`);
    assert.ok(!/opacity:\s*0/.test(first), `${path} first section not hidden inline`);
  }
});

test('S7 scroll reveals that start hidden have a no-JavaScript fallback', async () => {
  for (const path of PAGES) {
    const html = await page(path);
    const hidden = [...html.matchAll(/<div data-reveal=""[^>]*style="[^"]*opacity:0/g)];
    const fallback = /<noscript>[\s\S]*?\[data-reveal\][\s\S]*?opacity:\s*1\s*!important[\s\S]*?<\/noscript>/.test(html);
    assert.ok(hidden.length === 0 || fallback, `${path}: ${hidden.length} reveals start invisible with no no-JS fallback`);
  }
});
