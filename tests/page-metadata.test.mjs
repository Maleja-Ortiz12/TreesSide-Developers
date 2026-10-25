import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SITE = 'https://softzenkododevs.com';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];

test('S4 every page shares and canonicalizes its own URL, keeping the shared Open Graph data', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto', '/politica-de-datos']) {
    const html = await page(path);
    const url = path === '/' ? SITE : `${SITE}${path}`;
    assert.equal(meta(html, 'property', 'og:url'), url, `${path} og:url`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/\//g, '\\/')}"`), `${path} canonical`);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    assert.equal(meta(html, 'property', 'og:title'), title, `${path} og:title matches the page title`);
    assert.equal(meta(html, 'property', 'og:site_name'), 'TreesSide Developers', `${path} site name`);
    assert.equal(meta(html, 'property', 'og:locale'), 'es_CO', `${path} locale`);
    assert.ok(meta(html, 'property', 'og:image'), `${path} share image`);
  }
});

test('S4 not-found pages do not canonicalize to the home page', async () => {
  const response = await fetch(new URL('/casos/no-existe', base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.doesNotMatch(html, /<link rel="canonical"/);
  assert.doesNotMatch(html, /<meta property="og:url"/);
});

test('S4 the X card title and description match each page', async () => {
  for (const path of ['/', '/servicios', '/casos/la-lupe']) {
    const html = await page(path);
    assert.equal(meta(html, 'name', 'twitter:title'), html.match(/<title>([^<]*)<\/title>/)?.[1], `${path} twitter:title`);
    assert.equal(meta(html, 'name', 'twitter:description'), meta(html, 'name', 'description'), `${path} twitter:description`);
    assert.equal(meta(html, 'name', 'twitter:card'), 'summary_large_image', `${path} twitter:card`);
  }
});
