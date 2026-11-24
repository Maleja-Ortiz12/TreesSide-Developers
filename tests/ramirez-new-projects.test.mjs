import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const projects = [
  ['Gametroz', 'https://gametroz.online/', 'gametroz'],
  ['Fundación Propósito Posible', 'https://fundacionproppositoposible.com/', 'fundacion-proposito-posible'],
  ['ALTiora Inmobiliaria', 'https://altioraimobiliaria.online/es-CO', 'altiora-inmobiliaria'],
  ['CV Automatic', 'https://cvautomatic.online', 'cv-automatic'],
];

test('S3-S6 the four exclusive projects no longer publish cards or live links', async () => {
  const response = await fetch(new URL('/proyectos', base));
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]);
  const bundles = (await Promise.all(scripts.map(async src => {
    const response = await fetch(new URL(src.replace(/&amp;/g, '&'), base));
    assert.equal(response.status, 200);
    return response.text();
  }))).join('\n');
  for (const [title, url, slug] of projects) {
    assert.ok(!section.includes(`>${title}</h3>`), title);
    assert.ok(!section.includes(`data-project="equipo-${slug}"`), slug);
    assert.ok(!bundles.includes(url), `${title} live URL no longer in served catalog bundle`);
  }
});

test('unpublished screenshot assets remain available as real WebP images', async () => {
  for (const [title, , slug] of projects) {
    const response = await fetch(new URL(`/images/projects/${slug}.webp`, base));
    assert.equal(response.status, 200, title);
    assert.match(response.headers.get('content-type') || '', /image\/webp/, title);
    const body = Buffer.from(await response.arrayBuffer());
    assert.ok(body.byteLength > 10000, `${title} bytes`);
    const info = await sharp(body).metadata();
    assert.equal(info.format, 'webp', title);
    assert.ok(info.width >= 1000 && info.height >= 600, `${title} dimensions`);
    const { channels } = await sharp(body).stats();
    assert.ok(channels.some(channel => channel.stdev > 10), `${title} is not a blank capture`);
  }
});
