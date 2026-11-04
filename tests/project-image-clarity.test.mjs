import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page() {
  const response = await fetch(new URL('/proyectos', base));
  assert.equal(response.status, 200);
  return response.text();
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];

test('S18 project detail shows the complete flat image without a gradient or glass badge on top', async () => {
  const source = await readFile('src/components/ProjectModal.tsx', 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const exports = {};
  const jsx = (type, props) => ({type, props});
  vm.runInNewContext(code, {exports, require: name => {
    if (name === 'react/jsx-runtime') return {jsx, jsxs: jsx};
    if (name === './ProjectImage') return {ProjectImage: 'Image'};
    if (name === 'next/link') return {default: 'Link'};
    if (name === '@/data/cases') return {caseHref: () => null};
    return {};
  }});
  const tree = exports.ProjectModal({project: {id: 'test', title: 'Ejemplo', image: '/images/projects/example.webp', category: 'Sitios web', tag: 'React'}, onClose() {}, onContactClick() {}});
  const media = nodes(tree).find(node => node.props?.['data-project-detail-media'] !== undefined);
  assert.ok(media, 'dedicated unobscured image area');
  const image = nodes(media).find(node => node.type === 'Image');
  assert.equal(image.props.src, '/images/projects/example.webp');
  assert.equal(image.props.style.objectFit, 'contain');
  assert.ok(image.props.sizes.includes('720px'));
  assert.equal(nodes(media).filter(node => node !== media && node.type !== 'Image').length, 0, 'no overlay or badge above image');
});

test('S18 Libres en Cristo uses a local vector of the existing illustration, preserving provenance', async () => {
  const html = await page();
  const card = html.split(/(?=<div[^>]*data-project=)/).find(value => value.includes('data-project="equipo-libres-en-cristo-jesus"'));
  assert.ok(card);
  assert.ok(card.includes('/images/projects/libres-en-cristo.svg'));
  assert.ok(card.includes('Ilustración conceptual'));
  const response = await fetch(new URL('/images/projects/libres-en-cristo.svg', base));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/svg\+xml/);
  const svg = await response.text();
  assert.match(svg, /viewBox="0 0 1200 750"/);
  assert.ok(svg.includes('Libres en Cristo Jesús'));
  assert.ok(svg.includes('No es un código escaneable'));
  assert.ok(svg.includes('ILUSTRACIÓN CONCEPTUAL'));
  assert.doesNotMatch(svg, /<image\b|<script\b|feGaussianBlur/);
});

test('S18 the featured carousel has an explicit connection into the catalog branch', async () => {
  const html = await page();
  assert.match(html, /data-featured-connector=""[^>]*aria-hidden="true"/);
  assert.ok(html.includes('catalog-tree'));
  assert.equal((html.match(/data-project="/g) || []).length, 31);
});
