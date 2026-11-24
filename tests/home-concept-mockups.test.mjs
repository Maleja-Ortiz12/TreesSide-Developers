import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const home = await readFile(new URL('../src/components/home/HomeRedesign.tsx', import.meta.url), 'utf8');
test('Home integrates photographic concepts without changing the real project and with S11 service discovery', async () => {
  assert.match(home, /<ConceptShowcase/);
  assert.doesNotMatch(home, /function SalonPreview/);
  assert.match(home, /src="\/images\/projects\/la-lupe.webp"/);
  const showcase = await readFile(new URL('../src/components/home/ConceptShowcase.tsx', import.meta.url), 'utf8');
  for (const text of ['Diseño conceptual', 'Peluquerías y salones de belleza', 'Comercio electrónico', 'Quiero algo similar', 'Quiero una tienda virtual', "href: '/servicios/sitios-web'", "href: '/servicios/marketplaces'", 'ficticias']) assert.ok(showcase.includes(text), text);
});
test('both production compositions are optimized local three-view images', async () => {
  for (const name of ['salon', 'shop']) {
    const bytes = await readFile(new URL(`../public/images/home-concepts/${name}.webp`, import.meta.url));
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, 1600);
    assert.equal(meta.height, 1200);
    assert.ok(bytes.length < 500000, 'composition budget 500KB');
    const html = await readFile(new URL(`../scripts/home-concepts/${name}.html`, import.meta.url), 'utf8');
    for (const label of ['01 / INICIO', '02 /', '03 / MÓVIL', 'Diseño conceptual']) assert.ok(html.includes(label));
    assert.doesNotMatch(html, /src="https?:/);
  }
});
