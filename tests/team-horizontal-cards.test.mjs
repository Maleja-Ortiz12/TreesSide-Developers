import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function html(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
async function galleryCss() {
  const page = await html('/equipo');
  const urls = [...page.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)].map(([, url]) => url.replaceAll('&amp;', '&'));
  const css = (await Promise.all(urls.map(url => html(url)))).find(sheet => sheet.includes('TeamGallery_gallery'));
  assert.ok(css);
  return css.replace(/\s+/g, ' ');
}

test('closed team cards lay out horizontally: photo on the left, text on the right', async () => {
  const css = await galleryCss();
  assert.match(css, /\.TeamGallery_card__[\w-]+:not\(\[data-selected=['"]?true['"]?\]\) \.TeamGallery_overview__[\w-]+ ?\{[^}]*display: ?grid;[^}]*grid-template-columns: ?minmax\(0, ?180px\) minmax\(0, ?1fr\)/);
  assert.match(css, /\.TeamGallery_card__[\w-]+:not\(\[data-selected=['"]?true['"]?\]\) \.TeamGallery_photoFrame__[\w-]+ ?\{[^}]*grid-row: ?1 ?\/ ?-1/);
});

test('two horizontal cards fit per row and stack vertically on phones', async () => {
  const css = await galleryCss();
  assert.match(css, /\.TeamGallery_gallery__[\w-]+ ?\{[^}]*repeat\(auto-fit, ?minmax\(min\(100%, ?460px\), ?1fr\)\)/);
  assert.match(css, /@media \(max-width: ?640px\) ?\{[^@]*\.TeamGallery_card__[\w-]+:not\(\[data-selected=['"]?true['"]?\]\) \.TeamGallery_overview__[\w-]+ ?\{[^}]*grid-template-columns: ?minmax\(0, ?1fr\)/);
});
