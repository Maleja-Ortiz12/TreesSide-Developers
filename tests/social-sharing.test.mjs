import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
// Where src/app/opengraph-image.tsx draws the company logo inside the 1200×630 card.
const LOGO = { left: 780, top: 145, size: 340 };
// Compare only the inner part so rounded corners and the border do not count.
const INSET = 30;

async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, path);
  return response;
}

async function region(input, size) {
  const inner = size - INSET * 2;
  return sharp(input)
    .extract({ left: INSET, top: INSET, width: inner, height: inner })
    .removeAlpha()
    .raw()
    .toBuffer();
}

test('S5 the shared link preview shows the TreesSide Developers logo', async () => {
  const html = await (await get('/')).text();
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(image, 'og:image');
  const url = new URL(image);
  const png = Buffer.from(await (await get(url.pathname + url.search)).arrayBuffer());
  const { width, height, format } = await sharp(png).metadata();
  assert.deepEqual({ width, height, format }, { width: 1200, height: 630, format: 'png' });

  const crop = await sharp(png).extract({ left: LOGO.left, top: LOGO.top, width: LOGO.size, height: LOGO.size }).png().toBuffer();
  const logo = await sharp('public/images/treesside-logo.jpg').resize(LOGO.size, LOGO.size).png().toBuffer();
  const [served, expected] = await Promise.all([region(crop, LOGO.size), region(logo, LOGO.size)]);
  let difference = 0;
  for (let i = 0; i < served.length; i++) difference += Math.abs(served[i] - expected[i]);
  const average = difference / served.length;
  assert.ok(average < 12, `logo region differs from public/images/treesside-logo.jpg by ${average.toFixed(1)} per channel`);
});
