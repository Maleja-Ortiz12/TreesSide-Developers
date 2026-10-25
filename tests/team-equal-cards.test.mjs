import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function html(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

test('closed team cards all share the same size with actions aligned at the bottom', async () => {
  const page = await html('/equipo');
  assert.match(page, /<div[^>]*data-team-gallery="true"[^>]*data-focused="false"/);
  const urls = [...page.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)].map(([, url]) => url.replaceAll('&amp;', '&'));
  const css = (await Promise.all(urls.map(url => html(url)))).find(sheet => sheet.includes('TeamGallery_gallery'))?.replace(/\s+/g, ' ');
  assert.ok(css);
  // Equal rows across the whole grid, only while no profile is open.
  assert.match(css, /\.TeamGallery_gallery__[\w-]+\[data-focused=['"]?false['"]?\] ?\{[^}]*grid-auto-rows: ?1fr;[^}]*align-items: ?stretch/);
  assert.match(css, /\.TeamGallery_card__[\w-]+:not\(\[data-selected=['"]?true['"]?\]\) \.TeamGallery_overview__[\w-]+ ?\{[^}]*height: ?100%/);
  assert.match(css, /\.TeamGallery_card__[\w-]+:not\(\[data-selected=['"]?true['"]?\]\) \.TeamGallery_overview__[\w-]+ ?\{[^}]*grid-template-rows: ?1fr auto auto/);
});
