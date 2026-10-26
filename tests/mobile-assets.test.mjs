import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PAGES = ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto'];
const MAX_IMAGE_KB = 200;
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response;
}

test('S1 no image a page shows weighs more than 200 KB', async () => {
  const sources = new Set();
  for (const path of PAGES) {
    const html = await (await get(path)).text();
    for (const [, src] of html.matchAll(/<img\b[^>]*\ssrc="(\/[^"]+)"/g)) sources.add(src.replace(/&amp;/g, '&'));
  }
  assert.ok(sources.size > 0, 'pages render images');
  const heavy = [];
  for (const src of sources) {
    const kb = (await (await get(src)).arrayBuffer()).byteLength / 1024;
    if (kb > MAX_IMAGE_KB) heavy.push(`${src} ${Math.round(kb)} KB`);
  }
  assert.deepEqual(heavy, []);
});

test('S1 fonts are served by the site, not chained through a Google Fonts @import', async () => {
  const html = await (await get('/')).text();
  const sheets = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"/g)].map(match => match[1]);
  assert.ok(sheets.length > 0, 'stylesheets linked');
  const fonts = new Set();
  for (const sheet of sheets) {
    const css = await (await get(sheet)).text();
    assert.ok(!css.includes('fonts.googleapis.com'), `${sheet} does not import Google Fonts`);
    for (const [, url] of css.matchAll(/url\(([^)]+\.woff2)\)/g)) fonts.add(url.replace(/["']/g, ''));
  }
  assert.ok(fonts.size > 0, 'stylesheets include locally served font faces');
  for (const url of fonts) {
    assert.ok(url.startsWith('/_next/static/media/'), 'fonts served from this site');
    const response = await get(url);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), 'wOF2', `${url} serves a real WOFF2 font`);
  }
});
