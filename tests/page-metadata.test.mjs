import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SITE = 'https://treesside-developers.malejawork12.workers.dev';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const PAGES = [
  '/', '/servicios', '/planes', '/proyectos', '/casos', '/casos/la-lupe', '/casos/emisoras-latinas',
  '/nosotros', '/equipo', '/contacto', '/politica-de-datos',
];

test('S4 every page shares and canonicalizes its own URL, keeping the shared Open Graph data', async () => {
  const sitemap = await page('/sitemap.xml');
  const paths = new Set([...PAGES, '/servicios/streaming-y-redes', ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname)]);
  for (const path of paths) {
    const html = await page(path);
    const url = path === '/' ? SITE : `${SITE}${path}`;
    assert.equal(meta(html, 'property', 'og:url'), url, `${path} og:url`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/\//g, '\\/')}"`), `${path} canonical`);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    assert.match(title, /TreesSet Developers$/, `${path} branded title`);
    const body = html.match(/<body[\s\S]*<\/body>/)?.[0].replace(/<script[\s\S]*?<\/script>/g, '') ?? '';
    assert.match(body, /TreesSet/, `${path} visible brand`);
    assert.match(body, /href="mailto:treessetcorp@gmail.com"/, `${path} email`);
    assert.doesNotMatch(body, /TreesSide|TREESSIDE|correo@softzenkododevs\.com/, `${path} no old human-facing identity`);
    assert.equal(meta(html, 'property', 'og:title'), title, `${path} og:title matches the page title`);
    assert.equal(meta(html, 'property', 'og:site_name'), 'TreesSet Developers', `${path} site name`);
    assert.equal(meta(html, 'property', 'og:locale'), 'es_CO', `${path} locale`);
    assert.equal(meta(html, 'property', 'og:image'), `${SITE}/images/treesside-share.png`, `${path} og:image on the public domain`);
    assert.equal(meta(html, 'name', 'twitter:image'), `${SITE}/images/treesside-share.png`, `${path} twitter:image on the public domain`);
  }
});

test('S4 not-found pages do not canonicalize to the home page', async () => {
  for (const path of ['/casos/no-existe', '/casos/tengoya']) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 404, path);
    const html = await response.text();
    assert.doesNotMatch(html, /<link rel="canonical"/);
    assert.doesNotMatch(html, /<meta property="og:url"/);
  }
});

test('S4 the X card title and description match each page', async () => {
  for (const path of ['/', '/servicios', '/casos/la-lupe']) {
    const html = await page(path);
    assert.equal(meta(html, 'name', 'twitter:title'), html.match(/<title>([^<]*)<\/title>/)?.[1], `${path} twitter:title`);
    assert.equal(meta(html, 'name', 'twitter:description'), meta(html, 'name', 'description'), `${path} twitter:description`);
    assert.equal(meta(html, 'name', 'twitter:card'), 'summary_large_image', `${path} twitter:card`);
  }
});
