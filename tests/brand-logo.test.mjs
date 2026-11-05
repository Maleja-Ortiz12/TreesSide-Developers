import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('S27 the header shows the new tree mark with the TreesSide / DEVELOPERS wordmark on every page', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto']) {
    const response = await fetch(`${base}${path}`); assert.equal(response.status, 200);
    const header = (await response.text()).match(/<header\b[\s\S]*?<\/header>/)?.[0] || '';
    assert.ok(header.includes('src="/images/treesside-logo.webp"'), `${path} logo`);
    assert.match(header, /<span[^>]*>TreesSide<\/span>/);
    assert.match(header, /<span[^>]*text-transform:uppercase[^>]*>Developers<\/span>/, `${path} DEVELOPERS styled like the logo`);
    assert.match(header, /<span[^>]*color:#82cb8c[^>]*>Developers<\/span>/i, `${path} DEVELOPERS green`);
  }
});

test('S27 the square logo files are the new tree mark, with a transparent background for the web', async () => {
  const web = await sharp('public/images/treesside-logo.webp').metadata();
  assert.equal(web.hasAlpha, true, 'transparent mark for the header');
  assert.equal(web.width, web.height);
  const { data, info } = await sharp('public/images/treesside-logo.webp').raw().toBuffer({ resolveWithObject: true });
  const corner = data[3];
  const center = data[((info.height >> 1) * info.width + (info.width >> 1)) * 4 + 3];
  assert.ok(corner < 10, 'corners are transparent');
  assert.ok(center > 200, 'the trunk is opaque');
  const jpg = await sharp('public/images/treesside-logo.jpg').metadata();
  assert.equal(jpg.width, jpg.height);
  const source = await readFile('Images/LOGO actualizado.png');
  assert.ok(source.length > 0, 'provided artwork exists');
});
