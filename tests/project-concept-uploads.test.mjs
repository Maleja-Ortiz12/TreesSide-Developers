import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import sharp from 'sharp';

const source = await readFile('src/data/team.ts', 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });
const projects = exports.TEAM_MEMBERS.flatMap(member => member.projects);
const uploads = [
  ['Calculadora de contenedores', 'Planificador de carga en contenedores.png', 'calculadora-contenedores'],
  ['API de Tienda + Asistente IA', 'Catálogo de tienda con asistente IA.png', 'tienda-api'],
  ['Libres en Cristo Jesús', 'libres en cristo Jesus.png', 'libres-en-cristo'],
  ['Aplicación de gestión agropecuaria', 'AgroGestión_ gestión agropecuaria en tres pantallas.png', 'gestion-agropecuaria'],
  ['Sistema de gestión de inventarios', 'sistema de gestion de inventarios.png', 'gestion-inventarios'],
];

const analyticsUploads = [
  ['EDA · Renta Ciudadana', 'Renta Ciudadana_ análisis territorial de Boyacá.png', 'eda-renta-ciudadana'],
  ['Dashboard BI · Superstore', 'Panel BI premium con vista móvil.png', 'dashboard-superstore'],
  ['Análisis de Ventas de Cafetería', 'Analítica de ventas de cafetería.png', 'ventas-cafeteria'],
];

// Only site-owned wordmarks are retouched; final quality-88 encoding adds bounded RGB error elsewhere.
// Coordinates are [x, y, width, height] in the original optimized 1536×1024 image.
const retouches = {
  'tienda-api': [[86,141,138,24], [1362,411,90,20]],
  'gestion-inventarios': [[132,96,110,23]],
  'calculadora-contenedores': [[110,124,124,23], [1285,290,106,21]],
  'dashboard-superstore': [[104,106,119,24], [1267,327,90,20]],
  'eda-renta-ciudadana': [[80,88,179,31], [1301,349,117,24]],
  'ventas-cafeteria': [[74,127,156,30], [1274,335,115,24]],
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

for (const [name, upload, slug] of [...uploads, ...analyticsUploads]) {
  test(`${name} uses the complete optimized upload with conceptual provenance`, async t => {
    const project = projects.find(project => project.name === name);
    assert.equal(project.image, `/images/projects/${slug}-concept.webp`);
    assert.equal(project.imageFit, 'contain');
    assert.equal(project.imageLabel, analyticsUploads.some(item => item[0] === name) ? 'Vista conceptual' : 'Ilustración conceptual · No es una captura real');
    const bytes = await readFile(`public${project.image}`);
    const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    assert.equal((await sharp(bytes).metadata()).format, 'webp');
    assert.ok(info.width > 0 && info.height > 0 && info.width <= 1600);
    assert.equal(data.length, info.width * info.height * info.channels, 'fully decoded image');
    assert.ok((await sharp(bytes).stats()).channels.some(channel => channel.stdev > 0), 'nonempty artwork');
    // Pin the complete original transform except for explicitly bounded own-brand text.
    const expected = await sharp(`Images/${upload}`).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
    const baseline = await sharp(expected).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const candidate = await sharp(bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(candidate.info.width, baseline.info.width, 'original width');
    assert.equal(candidate.info.height, baseline.info.height, 'original height');
    for (const [x,y,width,height] of retouches[slug] || []) {
      const region = { left:x, top:y, width, height };
      const before = await sharp(expected).extract(region).removeAlpha().raw().toBuffer();
      const after = await sharp(bytes).extract(region).removeAlpha().raw().toBuffer();
      assert.notEqual(hash(after), hash(before), 'own-brand logo text intentionally retouched');
      for (let row=y; row<y+height; row++) {
        const start = (row*baseline.info.width+x)*3;
        const end = start+width*3;
        baseline.data.fill(0, start, end);
        candidate.data.fill(0, start, end);
      }
    }
    if (retouches[slug]) {
      const excluded = retouches[slug].reduce((sum, [,,w,h]) => sum+w*h*3, 0);
      const histogram = new Uint32Array(256);
      let total = 0;
      for (let i=0; i<candidate.data.length; i++) {
        const error = Math.abs(candidate.data[i]-baseline.data[i]);
        histogram[error]++;
        total += error;
      }
      histogram[0] -= excluded; // Zeroed logo samples do not dilute the exterior metric.
      const samples = candidate.data.length-excluded;
      const percentile = q => {
        let count = 0;
        for (let error=0; error<256; error++) {
          count += histogram[error];
          if (count >= samples*q) return error;
        }
      };
      const mae = total/samples, p99 = percentile(.99), p999 = percentile(.999);
      t.diagnostic(`${slug}: ${bytes.length} bytes; exterior RGB MAE=${mae.toFixed(6)}, P99=${p99}, P99.9=${p999} (0–255)`);
      // Measured q88 exterior ranges: MAE .506–.683, P99 4–7, P99.9 8–16.
      assert.ok(bytes.length <= 200*1024, 'existing mobile byte budget');
      assert.ok(mae <= .8, 'exterior RGB mean absolute error <= 0.8/255');
      assert.ok(p99 <= 8, '99% of exterior RGB samples differ by <= 8/255');
      assert.ok(p999 <= 18, '99.9% of exterior RGB samples differ by <= 18/255');
    } else {
      assert.equal(hash(candidate.data), hash(baseline.data), 'untouched pixels remain exact');
      assert.equal(hash(bytes), hash(expected), 'untouched concepts keep exact encoded transform');
    }
    if (analyticsUploads.some(item => item[0] === name)) {
      assert.equal((await sharp(`public/images/projects/${slug}.webp`).metadata()).format, 'webp', 'previous real capture retained');
      assert.equal(project.category, 'Análisis de datos');
      assert.ok(project.description.length > 80, 'full project description retained');
    } else {
      assert.ok((await readFile(`public/images/projects/${slug}.svg`, 'utf8')).includes('ILUSTRACIÓN CONCEPTUAL'), 'legacy SVG retained');
    }
  });
}

test('both La Lupe credits retain the real homepage screenshot and full-frame fit', async () => {
  const credits = projects.filter(project => project.name === 'La Lupe');
  assert.equal(credits.length, 2);
  for (const project of credits) {
    assert.equal(project.image, '/images/projects/la-lupe.webp');
    assert.equal(project.imageFit, 'contain');
    assert.equal(project.imageLabel, undefined);
    assert.equal(project.link, 'https://lalupe.co/');
  }
  const image = await sharp('public/images/projects/la-lupe.webp').metadata();
  assert.equal(image.width, 1200);
  assert.equal(image.height, 833);
});
