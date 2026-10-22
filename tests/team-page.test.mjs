import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

test('dedicated team route has expanded profiles, large photos and return links', async () => {
  const html = await page('/equipo');
  assert.match(html, /<title>Nuestro equipo/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const [name, slug] of [
    ['Ronaldo Delgado Correa', 'ronaldo-delgado'],
    ['Jorge Luis Puentes Brochero', 'jorge-puentes'],
    ['María Alejandra Ortiz Páez', 'maria-alejandra-ortiz'],
  ]) {
    const image = html.match(new RegExp(`<img[^>]*src="/images/team/${slug}\\.webp"[^>]*>`))?.[0];
    assert.ok(image, name);
    assert.ok(image.includes(`alt="${name}"`));
    assert.ok(image.includes('width="384"'));
    assert.ok(image.includes('height="384"'));
  }
  for (const text of ['Áreas de aporte', 'Proyectos del portafolio', 'Formación', 'Ocho80', 'Dimension Shift', 'Floraltech E-Commerce']) assert.ok(html.includes(text), text);
  assert.ok(html.includes('href="/"'));
  assert.ok(html.includes('href="/#contacto"'));
});

test('home links to the team page and retains existing section navigation and photos', async () => {
  const html = await page('/');
  assert.ok(html.includes('href="/equipo"'));
  for (const id of ['inicio', 'servicios', 'proyectos', 'sobre-nosotros', 'contacto']) {
    assert.ok(html.includes(`href="#${id}"`), `Navigation ${id}`);
    assert.ok(html.includes(`id="${id}"`), `Section ${id}`);
  }
  assert.ok(html.includes('id="equipo"'));
  assert.ok(html.includes('width="112"'));
});
