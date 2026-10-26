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

test('the four supplied projects appear once with Jorge Ramírez attribution and their live links', async () => {
  const response = await fetch(new URL('/proyectos', base));
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const cards = section.split(/(?=<div[^>]*data-project=)/).slice(1);
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]);
  const bundles = (await Promise.all(scripts.map(async src => {
    const response = await fetch(new URL(src.replace(/&amp;/g, '&'), base));
    assert.equal(response.status, 200);
    return response.text();
  }))).join('\n');
  for (const [title, url] of projects) {
    const matches = cards.filter(card => card.includes(`>${title}</h3>`));
    assert.equal(matches.length, 1, title);
    const [card] = matches;
    assert.ok(card.includes('Jorge Luis Ramírez Trochez'), `${title} author`);
    // The catalog is imported by the client-side detail modal.
    assert.ok(bundles.includes(url), `${title} live URL in served catalog bundle`);
    assert.ok(!card.includes('Experiencia laboral'), `${title} portfolio work`);
  }
  assert.ok(!section.includes('https://gametroz.online/https://gametroz.online/'));
});

test('the four supplied projects use their local site screenshots as covers', async () => {
  const response = await fetch(new URL('/proyectos', base));
  assert.equal(response.status, 200);
  const section = (await response.text()).match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const cards = section.split(/(?=<div[^>]*data-project=)/).slice(1);
  for (const [title, , slug] of projects) {
    const card = cards.find(item => item.includes(`>${title}</h3>`));
    assert.ok(card, title);
    assert.ok(card.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || card.includes(`/images/projects/${slug}.webp`), `${title} screenshot cover`);
    assert.ok(!card.includes('treesside-logo.jpg'), `${title} brand fallback`);
    assert.ok(!card.includes('Imagen de marca'), `${title} brand notice`);
    assert.ok(!card.includes('Ilustración conceptual'), `${title} conceptual notice`);
  }
});

test('the four screenshot covers are served as real WebP images', async () => {
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
