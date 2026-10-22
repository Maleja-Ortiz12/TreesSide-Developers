import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return response.text();
}

for (const path of ['/', '/equipo']) {
  test(`${path} shares the branded header with correctly targeted navigation`, async () => {
    const html = await page(path);
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header);
    assert.ok(header.includes('TreesSide') && header.includes('Developers'), 'Brand is present');
    assert.ok(header.includes('Abrir menú'), 'Mobile menu is available');
    for (const href of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto']) {
      assert.ok(header.includes(`href="${href}"`), href);
    }
    if (path === '/equipo') {
      assert.match(header, /<a[^>]*aria-current="page"[^>]*href="\/equipo"/);
    }
  });
}

test('Jorge profile includes published skills, education and project without pending placeholders', async () => {
  const html = await page('/equipo');
  const article = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)]
    .map(([text]) => text).find(text => text.includes('Jorge Luis Puentes Brochero'));
  assert.ok(article);
  for (const text of ['Desarrollo de software', 'React', 'Laravel', '.NET', 'n8n', 'Universidad de Cundinamarca', 'Floraltech E-Commerce', 'simulada']) {
    assert.ok(article.includes(text), text);
  }
  assert.ok(!article.includes('pendientes de confirmación'));
  assert.ok(!article.includes('Estamos preparando'));
  assert.ok(article.includes('href="https://portafolio-xi-liart-92.vercel.app/"'));
});
