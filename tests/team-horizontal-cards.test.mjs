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

test('S21 compact tree cards center native initials and retain portraits for the selected profile', async () => {
  const css = await galleryCss();
  assert.match(css, /\.TeamGallery_overview__[\w-]+ ?\{[^}]*display: ?grid;[^}]*grid-template-columns: ?minmax\(0, ?1fr\)/);
  assert.match(css, /\.TeamGallery_photoFrame__[\w-]+[^{}]*\{display:none/);
  assert.ok(css.includes('TeamGallery_avatar'));
  const page = await html('/equipo');
  assert.equal((page.match(/data-team-avatar=/g) || []).length, 4);
});

test('S21 tree positions become a two-column grid and then one column on phones', async () => {
  const css = await galleryCss();
  assert.match(css, /\.TeamGallery_gallery__[\w-]+\[data-focused=['"]?false['"]?\] ?\{[^}]*grid-template-columns: ?repeat\(2, ?minmax\(0, ?1fr\)\)/);
  assert.match(css, /@media ?\(min-width: ?1360px\)/);
  assert.match(css, /@media ?\(max-width: ?640px\) ?\{[^@]*\.TeamGallery_gallery__[\w-]+\[data-focused=['"]?false['"]?\] ?\{[^}]*grid-template-columns: ?minmax\(0, ?1fr\)/);
});
