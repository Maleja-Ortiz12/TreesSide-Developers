import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const hash = data => createHash('sha256').update(data).digest('hex');
const patches = [
  { file: 'calculadora-contenedores-concept.webp', regions: [[110,124,124,23], [1285,290,106,21]], outside: '3afa3b9cd1080a9065df71e4f382be1b7dfc8f3ac295f51dc451b7a3ada812cd', old: ['237ad83d19d0080f6dea738e13f59e6a9cd0d1423dfe70b9069015670740ba3e', '43cab67ba869294a2e99866ec02687e475421c855e805c7ad3908697b2a8d37d'] },
  { file: 'dashboard-superstore-concept.webp', regions: [[104,106,119,24], [1267,327,90,20]], outside: 'fd607d03587ef8d683b9dfe41eaab7db3d02f5255fa8cf81a5f30ac2a757e1c1', old: ['8db86007afaeacb8215e0cc224ad668513853aee3f155858817084466819cb99', '50c5a390ad123397096545e7bb2ab61af81af8cd474e398c7fbb39245bef8da7'] },
  { file: 'eda-renta-ciudadana-concept.webp', regions: [[80,88,179,31], [1301,349,117,24]], outside: 'a38f7b0410fbe5cae7353e5ab7fbb25ec751b8130c4faf669d5270e5f9927a5b', old: ['06b8c8a305ba0aa699c5e2c0ab4ff72cc2bc14792f1646afe750b36c972cbc80', '152381ab741357bad1c7d33c42c284c5ae8301797dc2412ad809b54f3b0930b1'] },
  { file: 'ventas-cafeteria-concept.webp', regions: [[74,127,156,30], [1274,335,115,24]], outside: 'c64b42053239074b82412849cd18aa9428c8c039bdc225d0b77995525b582b3d', old: ['4b8885f56281cc1955a0c257b2fd4d3d3d6252bd905e2c577abba9a13c474320', 'e57d524b625f64ccde2a687614e021eeadc8837e94909fa51a51b288d8f7a179'] },
  { file: 'tienda-api-concept.webp', regions: [[86,141,138,24], [1362,411,90,20]], outside: 'f69ce6ef57fe199b03ced17159a23492c9955a1f6d2ebea2e85b513e60c3c56a', old: ['bd679abc77b1dcfa274841d08a60bee4fe3a79cbf9e4a1e027843a6e920b999f', 'f0db1af1cd7cbfe824c4895159e303b9aaf5d955553bebc819dfb726534bceec'] },
  { file: 'gestion-inventarios-concept.webp', regions: [[132,96,110,23]], outside: '7b4a7d1ff40ff3be116f13fea69ad19addac5a9728b527ec686ca9bff3a28de0', old: ['7f95c927efc95ad7f6d56ecc176f5261a0eaa09059a048c2113a1aaeccf848fb'] },
];

test('static share is a fresh 1200x630 TreesSet card rendered from self-contained SVG', async () => {
  const bytes = await readFile('public/images/treesside-share.png');
  const info = await sharp(bytes).metadata();
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
  const { shareSvg } = await import('../scripts/render-treesset-share.mjs');
  const svg = await shareSvg();
  assert.match(svg, /TreesSet/);
  assert.match(svg, /Developers/);
  assert.match(svg, /Software a medida para hacer crecer tu negocio/);
  assert.doesNotMatch(svg, /TreesSide|https?:\/\/(?!www\.w3\.org)/i);
  assert.match(svg, /data:image\/png;base64,/);
  const rendered = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer();
  assert.equal(hash(await sharp(bytes).removeAlpha().raw().toBuffer()), hash(rendered), 'published share pixels match the TreesSet design');
});

test('owned vector labels and regeneration source no longer carry the old identity', async () => {
  const names = (await readdir('public/images/projects')).filter(name => name.endsWith('.svg'));
  assert.equal(names.length, 6);
  for (const name of [...names.map(name => `public/images/projects/${name}`), 'scripts/generate-project-covers.mjs']) {
    const source = await readFile(name, 'utf8');
    assert.doesNotMatch(source, /TREESSIDE/);
    assert.match(source, /TREESSET  \/  PORTAFOLIO/);
  }
});

const originals = {
  'calculadora-contenedores-concept.webp': 'Planificador de carga en contenedores.png',
  'dashboard-superstore-concept.webp': 'Panel BI premium con vista móvil.png',
  'eda-renta-ciudadana-concept.webp': 'Renta Ciudadana_ análisis territorial de Boyacá.png',
  'ventas-cafeteria-concept.webp': 'Analítica de ventas de cafetería.png',
  'tienda-api-concept.webp': 'Catálogo de tienda con asistente IA.png',
  'gestion-inventarios-concept.webp': 'sistema de gestion de inventarios.png',
};

for (const patch of patches) test(`${patch.file}: owned text retouch with bounded exterior encoding error`, async () => {
  const bytes = await readFile(`public/images/projects/${patch.file}`);
  const { data, info } = await sharp(bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1536);
  assert.equal(info.height, 1024);
  assert.ok(bytes.length <= 200 * 1024, `${patch.file}: ${bytes.length} bytes exceeds existing mobile image budget`);
  const original = await sharp(`Images/${originals[patch.file]}`).resize({ width:1600, withoutEnlargement:true }).webp({ quality:88 }).toBuffer();
  const baseline = await sharp(original).removeAlpha().raw().toBuffer({ resolveWithObject:true });
  assert.equal(info.width, baseline.info.width);
  assert.equal(info.height, baseline.info.height);
  for (const [i, [x,y,w,h]] of patch.regions.entries()) {
    const crop = await sharp(bytes).extract({ left:x, top:y, width:w, height:h }).removeAlpha().raw().toBuffer();
    assert.notEqual(hash(crop), patch.old[i], 'original TreesSide logo region must change');
    for (let row=y; row<y+h; row++) {
      data.fill(0, (row*info.width+x)*3, (row*info.width+x+w)*3);
      baseline.data.fill(0, (row*info.width+x)*3, (row*info.width+x+w)*3);
    }
  }
  // Pin original exterior provenance, then bound final lossy encoding rather than claiming pixel identity.
  assert.equal(hash(baseline.data), patch.outside, 'original transform exterior baseline identity');
  const excluded = patch.regions.reduce((sum, [,,w,h]) => sum+w*h*3, 0);
  const histogram = new Uint32Array(256);
  let total = 0;
  for (let i=0; i<data.length; i++) {
    const error = Math.abs(data[i]-baseline.data[i]);
    histogram[error]++;
    total += error;
  }
  histogram[0] -= excluded;
  const samples = data.length-excluded;
  const percentile = q => {
    let count = 0;
    for (let error=0; error<256; error++) {
      count += histogram[error];
      if (count >= samples*q) return error;
    }
  };
  // Measured before assertions: MAE .506–.683, P99 4–7, P99.9 8–16 on a 0–255 scale.
  assert.ok(total/samples <= .8, 'exterior mean absolute RGB error <= .8/255');
  assert.ok(percentile(.99) <= 8, 'exterior RGB P99 <= 8/255');
  assert.ok(percentile(.999) <= 18, 'exterior RGB P99.9 <= 18/255');
});

test('existing logo and deployment references remain stable', async () => {
  const logo = await readFile('src/components/Logo.tsx', 'utf8');
  const metadata = await readFile('src/lib/metadata.ts', 'utf8');
  const content = await readFile('src/data/content.ts', 'utf8');
  assert.match(logo, /treesside-logo\.webp/);
  assert.match(metadata, /\/images\/treesside-share\.png/);
  assert.match(content, /export const SITE_URL = 'https:\/\/treesset\.com';/);
});
