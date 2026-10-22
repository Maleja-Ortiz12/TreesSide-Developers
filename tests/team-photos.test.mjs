import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const members = [
  ['Ronaldo Delgado Correa', 'ronaldo-delgado'],
  ['Jorge Luis Puentes Brochero', 'jorge-puentes'],
  ['María Alejandra Ortiz Páez', 'maria-alejandra-ortiz'],
];

async function get(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
}

test('team renders all three local portraits alongside existing portfolio links', async () => {
  const response = await get('/nosotros');
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section id="equipo"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'Team section remains present');
  for (const [name, slug] of members) {
    const image = section.match(new RegExp(`<img[^>]*src="/images/team/${slug}\\.webp"[^>]*>`))?.[0];
    assert.ok(image, `Missing portrait: ${name}`);
    assert.ok(image.includes(`alt="${name}"`));
    assert.ok(image.includes('width="112"'));
    assert.ok(image.includes('height="112"'));
    assert.ok(image.includes('loading="lazy"'));
  }
  for (const url of [
    'https://ronaldo-delgado.vercel.app/',
    'https://portafolio-xi-liart-92.vercel.app/',
    'https://portafolio-bay-tau.vercel.app/',
  ]) assert.ok(section.includes(`href="${url}" target="_blank" rel="noopener noreferrer"`));
});

test('all portrait assets are served as nonempty WebP images', async () => {
  for (const [, slug] of members) {
    const response = await get(`/images/team/${slug}.webp`);
    assert.equal(response.status, 200, slug);
    assert.match(response.headers.get('content-type') || '', /image\/webp/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length > 100, slug);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  }
});
