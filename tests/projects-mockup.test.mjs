import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page() {
  const response = await fetch(new URL('/proyectos', base));
  assert.equal(response.status, 200);
  return response.text();
}
const text = html => html.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

test('S17 projects uses the new mockup hero without changing the requested filters', async () => {
  const html = await page();
  assert.equal(text(html.match(/<h1\b[\s\S]*?<\/h1>/)?.[0] ?? ''), 'Ideas que ya están funcionando.');
  assert.ok(html.includes('projects-hero-tree.webp'));
  assert.ok(text(html).includes('Cada proyecto del equipo conserva su autoría y su fuente.'));
  const group = html.match(/<div[^>]*aria-label="Filtrar proyectos"[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.deepEqual([...group.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g)].map(([button]) => text(button)), ['Todos', 'Restaurantes', 'Juegos', 'Datos', 'E-commerce']);
});

test('S17 every project keeps its canonical anchor and image inside a laptop', async () => {
  const html = await page();
  const cards = html.split(/(?=<div[^>]*data-project=)/).slice(1);
  assert.equal(cards.length, 31);
  assert.equal((html.match(/data-project-laptop/g) ?? []).length, 31);
  for (const card of cards) {
    const id = card.match(/data-project="([^"]+)"/)?.[1];
    assert.ok(card.includes(`id="${id}"`), id);
    assert.match(card, /data-project-laptop[^>]*>[\s\S]*?<img/);
    assert.match(card, /aria-label="Ver proyecto [^"]+"/);
  }
  for (const [id, image] of [['equipo-la-lupe', 'la-lupe'], ['equipo-floraltech-e-commerce', 'floraltech']]) {
    const card = cards.find(value => value.includes(`data-project="${id}"`));
    assert.ok(card.includes(`/images/projects/${image}.webp`) || card.includes(`%2Fimages%2Fprojects%2F${image}.webp`));
    assert.ok(!card.includes('Ilustración conceptual'), `${id} retains real screenshot`);
  }
  assert.ok(html.includes('aria-label="Proyecto en primer plano"'), 'rotating spotlight retained');
});

test('S17 new project layout ends in a single integrated closing rather than the old CTA/footer pair', async () => {
  const html = await page();
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer]) => footer);
  assert.equal(footers.length, 1);
  for (const copy of ['Lo que sigue,', 'Hablemos', 'Política de datos']) assert.ok(footers[0].includes(copy));
  assert.ok(!footers[0].includes('site-footer'));
  assert.ok(!html.includes('¿Tienes un proyecto'));
});

test('S17 native project fragments are not measured through an animated perspective ancestor', async () => {
  const html = await page();
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(([, value]) => value).join(' ');
  assert.match(css, /\[data-reveal=["']?first["']?\]:has\(\s*>\s*#proyectos\)\s*\{\s*animation:\s*none[;}]/);
});
