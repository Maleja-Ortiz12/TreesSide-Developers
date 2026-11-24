import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
test('additive admin concepts: labels, scope, service discovery and full artwork', async () => {
  const component = await read('src/components/home/AdminConceptShowcase.tsx');
  for (const text of ['salon-admin', 'restaurant-admin', 'ALBA', 'BRASA', 'Diseño conceptual · Datos de ejemplo', 'No son funcionalidades entregadas a La Lupe', 'sistemas-de-gestion', 'restaurantes', 'Panel administrativo y reservas', 'App para restaurantes']) assert.ok(component.includes(text), text);
  assert.match(component, /width=\{1600\} height=\{1200\}/);
  assert.match(await read('src/components/home/AdminConceptShowcase.module.css'), /object-fit: contain/);
  const home = await read('src/components/home/HomeRedesign.tsx');
  assert.match(home, /<ConceptShowcase \/>\s*<AdminConceptShowcase \/>/);
  // S7: both admin concepts join the single promotion list after the portfolio.
  assert.match(home, /\.\.\.remaining\.map\(real\),\s*admin\('salon-admin', [^)]*\), admin\('restaurant-admin', /);
  assert.ok(!component.includes('data-home-project'));
});
test('real La Lupe claims, public concepts and project coverage remain', async () => {
  const home = await read('src/components/home/HomeRedesign.tsx');
  for (const text of ['Captura real de la web de La Lupe', "['Presentación del restaurante', 'Menú', 'Platos destacados', 'Contacto por WhatsApp']", '/images/projects/la-lupe.webp', '/images/home-concepts/salon.webp', '/images/home-concepts/shop.webp', '[real(lupe), salon, shop, ...remaining.map(real)']) assert.ok(home.includes(text), text);
});
test('locally rendered optimized admin assets have desktop and mobile detail', async () => {
  for (const id of ['salon-admin', 'restaurant-admin']) {
    const bytes = await readFile(new URL(`../public/images/home-concepts/${id}.webp`, import.meta.url));
    const image = await sharp(bytes).metadata();
    assert.equal(image.width, 1600); assert.equal(image.height, 1200); assert.equal(image.format, 'webp');
    assert.ok(bytes.length > 25000 && bytes.length < 400000, `${id}: ${bytes.length} bytes`);
  }
  const template = await read('scripts/admin-concepts/template.mjs');
  for (const text of ['Empleados', 'Turno', 'Disponible', 'Agenda', 'Pedidos', 'Caja', 'Cocina', 'Equipo', 'Datos de ejemplo', 'mobile']) assert.ok(template.includes(text), text);
});
