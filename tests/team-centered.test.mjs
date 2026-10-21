import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function html(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return response.text();
}

test('team starts as a grid with accessible profile buttons and hidden detail panels', async () => {
  const page = await html('/equipo');
  const cards = [...page.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([card]) => card);
  assert.equal(cards.length, 3);
  const controls = new Set();
  for (const card of cards) {
    assert.ok(!card.startsWith('<article hidden'));
    const button = card.match(/<button\b[^>]*aria-expanded="false"[^>]*>[\s\S]*?<\/button>/)?.[0];
    assert.ok(button, 'Each card has a collapsed profile button');
    assert.ok(button.includes('Ver perfil'));
    const id = button.match(/aria-controls="([^"]+)"/)?.[1];
    assert.ok(id);
    controls.add(id);
    assert.match(card, new RegExp(`<div[^>]*id="${id}"[^>]*hidden=""`));
    assert.ok(card.includes('Proyectos del portafolio'));
    assert.ok(card.includes('rel="noopener noreferrer"'));
  }
  assert.equal(controls.size, 3);
  assert.ok(!page.includes('<details'));
});

test('centered view uses full-width grid placement without a horizontal track', async () => {
  const page = await html('/equipo');
  const urls = [...page.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)]
    .map(([, url]) => url.replaceAll('&amp;', '&'));
  const css = (await Promise.all(urls.map(html))).find(sheet => sheet.includes('TeamGallery'));
  assert.ok(css);
  assert.ok(!/overflow-x:\s*auto/.test(css));
  assert.match(css, /grid-column:\s*1\s*\/\s*-1/);
  assert.match(css, /card[^{}]*\[hidden\][^{]*\{[^}]*display:\s*none/);
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(css.includes('profileEnter'));
  assert.ok(css.includes('portraitFloat'));
});
