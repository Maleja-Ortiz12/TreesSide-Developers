import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('Bendita Gracia appears once with its real home screenshot and home carousel anchor', async () => {
  const response = await fetch(`${base}/proyectos`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/data-project="equipo-bendita-gracia"/g) || []).length, 1);
  assert.ok(html.includes('bendita-gracia.webp'), 'the card uses its own screenshot');
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.ok((await home.text()).includes('/proyectos#equipo-bendita-gracia'));
  const image = await fetch(`${base}/images/projects/bendita-gracia.webp`);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/webp/);
  const bytes = Buffer.from(await image.arrayBuffer());
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1440);
  assert.equal(metadata.height, 900);
  assert.ok(bytes.length < 200000, 'screenshot remains lightweight');
  const stats = await sharp(bytes).stats();
  assert.ok(stats.channels.some(channel => channel.stdev > 20), 'screenshot is not blank');
});
