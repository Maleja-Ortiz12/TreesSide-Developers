import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  return response.text();
}
test('home replaces demos and demo tabs with the original controllable project carousel', async () => {
  const html = await home();
  assert.ok(!html.includes('id="demos"'));
  assert.ok(!html.includes('data-demo='));
  assert.ok(!html.includes('data-demo-tab='));
  assert.ok(!html.includes('data-project-card='));
  assert.ok(html.includes('href="#carrusel"'));
  const carousel = html.match(/<section id="carrusel"[\s\S]*?<\/section>/)?.[0];
  assert.ok(carousel);
  assert.ok(carousel.includes('Pausar carrusel'));
  for (const id of ['equipo-la-lupe', 'equipo-emisoras-latinas', 'equipo-ocho80', 'equipo-tengoya']) {
    assert.ok(carousel.includes(`href="/proyectos#${id}"`), id);
  }
});
test('home has one integrated footer retaining the new closing and all previous useful links', async () => {
  const html = await home();
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(match => match[0]);
  assert.equal(footers.length, 1);
  const footer = footers[0];
  for (const copy of ['Lo que sigue,', 'lo construimos', 'contigo.', 'Hablemos', 'TreesSide Developers', 'Colombia', 'Todos los derechos reservados.', 'Código que construye futuro', 'correo@softzenkododevs.com', '+57 305 717 3986']) assert.ok(footer.includes(copy), copy);
  for (const href of ['/', '/servicios', '/planes', '/proyectos', '/casos', '/nosotros', '/equipo', '/contacto', '/politica-de-datos', 'mailto:correo@softzenkododevs.com']) assert.ok(footer.includes(`href="${href}"`), href);
  assert.ok(footer.includes('https://wa.me/573057173986'));
  assert.ok(!footer.includes('site-footer'), 'the former separate footer is not appended');
});
