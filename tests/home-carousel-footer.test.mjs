import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  return response.text();
}
// The original controllable strip lives on /proyectos; admin-concepts-visible-collage S10 removed the Home demos.
test('Home renders the six requested sections in order without a carousel or demos', async () => {
  const html = await home();
  const ids = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids, ['inicio', 'soluciones', 'trabajo', 'propuestas', 'proceso-home', 'siguiente-paso']);
  assert.ok(!html.includes('data-demo-tab'));
});

test('home has one integrated footer retaining the new closing and all previous useful links', async () => {
  const html = await home();
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(match => match[0]);
  assert.equal(footers.length, 1);
  const footer = footers[0];
  for (const copy of ['TreesSet Developers', 'Colombia', 'Todos los derechos reservados.', 'Código que construye futuro', 'treessetcorp@gmail.com', '+57 305 717 3986']) assert.ok(footer.includes(copy), copy);
  for (const href of ['/', '/servicios', '/planes', '/proyectos', '/casos', '/nosotros', '/equipo', '/contacto', '/politica-de-datos', 'mailto:treessetcorp@gmail.com']) assert.ok(footer.includes(`href="${href}"`), href);
  assert.ok(footer.includes('https://wa.me/573057173986'));
  assert.ok(!footer.includes('site-footer'), 'the former separate footer is not appended');
});
