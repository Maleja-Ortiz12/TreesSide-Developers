import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function html(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return response.text();
}

for (const path of ['/', '/equipo']) {
  test(`${path} uses neutral Latin American Spanish`, async () => {
    const page = await html(path);
    assert.match(page, /<html[^>]*lang="es-419"/);
    assert.doesNotMatch(page, /Conocé|conocé|Abrí|Elegí|explorá|podés/);
    assert.ok(page.includes('Conoce'));
    if (path === '/equipo') {
      assert.ok(page.includes('Abre un perfil'));
      assert.ok(page.includes('Elige un integrante'));
      assert.ok(page.includes('explora su perfil'));
    }
  });
}

test('selected gallery cards span the grid without a sliding track', async () => {
  const page = await html('/equipo');
  const urls = [...page.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)]
    .map(([, url]) => url.replaceAll('&amp;', '&'));
  const css = (await Promise.all(urls.map(url => html(url))))
    .find(sheet => sheet.includes('TeamGallery_gallery'));
  assert.ok(css);
  assert.match(css, /data-selected=['"]true['"]\][^{]*\{[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*width:\s*100%/);
  assert.ok(!css.includes('--panel-width'));
  assert.ok(!/overflow-x:\s*auto/.test(css));
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.ok(page.includes('data-team-gallery="true"'));
});
