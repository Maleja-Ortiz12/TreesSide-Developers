import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const vectors = ['calculadora-contenedores', 'libres-en-cristo', 'tienda-api', 'gestion-inventarios', 'gestion-agropecuaria', 'migracion-pega-uipath'];

test('S19 all 31 cards use complete original media rather than small mockup crops', async () => {
  const response = await fetch(`${base}/proyectos`); assert.equal(response.status, 200);
  const html = await response.text();
  const cards = html.split(/(?=<div[^>]*data-project=)/).slice(1);
  assert.equal(cards.length, 31);
  for (const card of cards) {
    const image = card.match(/<img\b[^>]*>/)?.[0] || '';
    assert.ok(image.includes('/images/projects/'), 'canonical local image');
    assert.ok(image.includes('object-fit:contain'), 'complete image, without cover zoom');
  }
});

test('S19 all six existing conceptual illustrations are sharp safe vectors with provenance', async () => {
  for (const slug of vectors) {
    const response = await fetch(`${base}/images/projects/${slug}.svg`);
    assert.equal(response.status, 200, slug);
    assert.match(response.headers.get('content-type'), /image\/svg\+xml/);
    const svg = await response.text();
    assert.match(svg, /viewBox="0 0 1200 750"/);
    assert.ok(svg.includes('ILUSTRACIÓN CONCEPTUAL'));
    assert.doesNotMatch(svg, /<image\b|<script\b|feGaussianBlur/);
    const legacy = await fetch(`${base}/images/projects/${slug}.webp`);
    assert.equal(legacy.status, 200, 'previous WebP remains available');
  }
});

test('S19 real screenshots retain their available native resolution within the asset budget', async () => {
  const widths = {'eda-renta-ciudadana':989,'entre-lanas-y-fragancias':1365,'floraltech':1600,'gudfy':1632,'luhos':1913,'ocho80':1918,'otaku-portal':1600,'portfolio-cms':1600,'tanku':1905,'uptownhair':1169,'carweb':1054,'radio-navidad':1821,'emisoras-latinas-cover':1033,'histech':972,'robot-alejo':1536,'tengoya':1083};
  for (const [slug, width] of Object.entries(widths)) {
    const bytes = await readFile(`public/images/projects/${slug}.webp`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, width, slug);
    assert.ok(bytes.length <= 200_000, `${slug}: bounded asset size`);
  }
});

test('S19 visible carousel and laptop image planes do not tilt, float or zoom the artwork', async () => {
  for (const [file, selectors] of [
    ['src/components/motion/ProjectCarousel.module.css', ['stage','plane','item','image']],
    ['src/components/ProjectSpotlight.module.css', ['scene','visual','hologram','depthLayer','floatLayer']],
    ['src/components/ProjectsSection.tsx', ['card-laptop','project-thumb']],
  ]) {
    const css = await readFile(file, 'utf8');
    for (const selector of selectors) {
      for (const [,rule] of css.matchAll(new RegExp(`\\.${selector}(?:[^{}]*)\\{([^}]+)\\}`, 'g'))) {
        assert.doesNotMatch(rule, /perspective\s*:|(?:rotate|scale|translateZ)\(|animation:\s*hologramFloat/, `${file}: ${selector}`);
      }
    }
  }
});
