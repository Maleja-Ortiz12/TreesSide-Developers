import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, path);
  return response;
}

for (const path of ['/nosotros', '/equipo']) {
  const hasTeam = path === '/equipo';
  test(`${path} shows TreesSide with Developers as its own subtitle`, async () => {
    const html = await (await get(path)).text();
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header);
    assert.match(header, /<span[^>]*>TreesSide<\/span>/);
    assert.match(header, /<span[^>]*>Developers<\/span>/);
    assert.ok(header.includes('flex-direction:column'));
    assert.ok(header.includes('src="/images/treesside-logo.jpg"'), 'Updated logo artwork');
    assert.ok(!html.includes('src="/images/logo.jpg"'), 'Do not render old logo artwork');
    assert.match(html, /<title>[^<]*TreesSide Developers/);
    assert.ok(!html.includes('SoftZenkodoDevs'));
    assert.ok(html.includes('href="/equipo"'));
    if (!hasTeam) return;
    const jorge = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)]
      .map(([article]) => article).find(article => article.includes('Jorge Luis Puentes Brochero'));
    const portrait = jorge?.match(/<img\b[^>]*>/)?.[0];
    assert.ok(portrait?.includes('src="/images/team/jorge-puentes.webp"'));
    assert.match(portrait, /style="[^"]*object-fit:contain/);
  });
}

test('Jorge portrait keeps the original vertical composition instead of a square crop', async () => {
  const response = await get('/images/team/jorge-puentes.webp');
  assert.match(response.headers.get('content-type') || '', /image\/webp/);
  const bytes = Buffer.from(await response.arrayBuffer());
  const { width, height } = await sharp(bytes).metadata();
  assert.ok(width && height);
  assert.ok(height > width, 'Portrait must not be cropped square');
  assert.ok(Math.abs(width / height - 354 / 472) < 0.01, 'Keep original aspect ratio');
});

test('contact page keeps the current email contact rather than inventing a replacement', async () => {
  const html = await (await get('/contacto')).text();
  assert.ok(html.includes('correo@softzenkododevs.com'));
});
