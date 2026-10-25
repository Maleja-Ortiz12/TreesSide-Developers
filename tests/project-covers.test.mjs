import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const COVERS = [
  ['Calculadora de contenedores', 'calculadora-contenedores'],
  ['Libres en Cristo Jesús', 'libres-en-cristo'],
  ['API de Tienda + Asistente IA', 'tienda-api'],
  ['Sistema de gestión de inventarios', 'gestion-inventarios'],
  ['Aplicación de gestión agropecuaria', 'gestion-agropecuaria'],
  ['Migración Pega → UiPath', 'migracion-pega-uipath'],
];
const LABEL = 'Ilustración conceptual · No es una captura real';
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

test('every previously uncovered project has its own locally served conceptual cover and visible provenance', async () => {
  const html = await page('/proyectos');
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)[0];
  const cards = section.split(/(?=<div[^>]*data-project=)/);
  for (const [title, slug] of COVERS) {
    const card = cards.find(item => item.includes(`>${title}</h3>`));
    assert.ok(card, title);
    assert.ok(card.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || card.includes(`/images/projects/${slug}.webp`), `${title} cover`);
    assert.ok(text(card).includes(LABEL), `${title} must not pretend to be a real screenshot`);
    assert.ok(!card.includes('Imagen de marca'), `${title} no generic brand placeholder`);
    const response = await fetch(new URL(`/images/projects/${slug}.webp`, base));
    assert.equal(response.status, 200, slug);
    assert.match(response.headers.get('content-type'), /image\/webp/);
    const served = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(served, await readFile(`public/images/projects/${slug}.webp`), `${slug} served bytes`);
    const info = await sharp(served).metadata();
    assert.equal(info.width, 1200, slug);
    assert.equal(info.height, 750, slug);
  }
});

test('La Lupe uses a homepage screenshot with its full frame rather than a dish photograph', async () => {
  const html = await page('/casos/la-lupe');
  assert.ok(html.includes('object-fit:contain'), 'homepage capture is not cropped');
  const info = await sharp('public/images/projects/la-lupe.webp').metadata();
  assert.equal(info.width, 1200);
  assert.equal(info.height, 833);
});
