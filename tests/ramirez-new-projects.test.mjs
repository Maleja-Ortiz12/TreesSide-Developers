import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const projects = [
  ['Gametroz', 'https://gametroz.online/'],
  ['Fundación Propósito Posible', 'https://fundacionproppositoposible.com/'],
  ['ALTiora Inmobiliaria', 'https://altioraimobiliaria.online/es-CO'],
  ['CV Automatic', 'https://cvautomatic.online'],
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
