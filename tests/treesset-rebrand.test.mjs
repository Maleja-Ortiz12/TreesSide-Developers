import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Production JSX/data harness: no server, network, provider sends or generated files.
const cache = new Map();
const jsx = (type, props) => typeof type === 'function' ? type(props) : { type, props };
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, URL, URLSearchParams, Date, fetch: () => { throw Error('No network'); }, require: spec => {
    if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
    if (spec === 'react') return { default: {} };
    if (spec === 'next/navigation') return { usePathname: () => '/', notFound: () => { throw Error('404'); } };
    if (spec === 'next/image' || spec === 'next/link') return { default: spec === 'next/image' ? 'img' : 'a' };
    if (spec === 'lucide-react') return new Proxy({}, { get: () => 'svg' });
    const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(file), spec);
    const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(p => existsSync(p) && statSync(p).isFile());
    assert.ok(resolved, spec); return load(resolved);
  } });
  return module.exports;
}
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const source = file => readFileSync(file, 'utf8');
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]); }

test('S1-S2 central contact uses requested email; actual domain and phone stay unchanged', () => {
  const { CONTACT_INFO, SITE_URL } = load('src/data/content.ts');
  assert.equal(CONTACT_INFO.email, 'treessetcorp@gmail.com');
  assert.equal(SITE_URL, 'https://treesside-developers.malejawork12.workers.dev');
  assert.equal(CONTACT_INFO.phone, '+57 305 717 3986');
  assert.equal(new URL(CONTACT_INFO.whatsappUrl).searchParams.get('text'), 'Hola TreesSet Developers, me gustaría cotizar un proyecto');
});

test('S1-S2 rendered shared footer/logo expose new wordmark, alt and working contact destinations', () => {
  const tree = load('src/components/Footer.tsx').Footer();
  assert.match(text(tree), /TreesSetDevelopers/);
  assert.match(text(tree), /© 2025 TreesSet Developers/);
  assert.match(text(tree), /treessetcorp@gmail.com/);
  assert.ok(nodes(tree).some(n => n.props?.href === 'mailto:treessetcorp@gmail.com'));
  assert.ok(nodes(tree).some(n => n.props?.src === '/images/treesside-logo.webp' && n.props.alt === 'TreesSet Developers Logo'));
  assert.ok(nodes(tree).some(n => n.props?.href === '/politica-de-datos'));
  assert.doesNotMatch(text(tree), /TreesSide|softzenkodo/i);
});

test('S1 shared metadata preserves canonical/share contract and updates accessible branding', () => {
  const { pageMetadata, SHARE_IMAGE } = load('src/lib/metadata.ts');
  const data = pageMetadata('/contacto', { title: 'Contacto | TreesSet Developers', description: 'Descripción existente' });
  assert.equal(data.openGraph.siteName, 'TreesSet Developers');
  assert.equal(data.openGraph.title, data.title);
  assert.equal(data.twitter.title, data.title);
  assert.equal(data.alternates.canonical, '/contacto');
  assert.equal(data.openGraph.url, '/contacto');
  assert.equal(data.description, 'Descripción existente');
  assert.equal(SHARE_IMAGE.url, '/images/treesside-share.png');
  assert.match(SHARE_IMAGE.alt, /^TreesSet Developers/);
  const layout = source('src/app/layout.tsx');
  assert.match(layout, /name: 'TreesSet Developers'/);
  assert.match(layout, /email: CONTACT_INFO.email/);
  assert.doesNotMatch(layout, /TreesSide/);
});

test('S1 every route title and service metadata plus visible source use TreesSet, not TreesSide', () => {
  for (const file of files('src/app').filter(p => p.endsWith('/page.tsx') && !p.includes('[categoria]'))) {
    assert.match(source(file), /TreesSet Developers/, file);
  }
  const { SERVICE_CATEGORIES, LEGACY_SERVICE_CATEGORIES } = load('src/data/serviceCategories/index.ts');
  for (const category of [...SERVICE_CATEGORIES, ...LEGACY_SERVICE_CATEGORIES]) assert.match(category.metaTitle, /\| TreesSet Developers$/, category.slug);
  for (const file of files('src').filter(p => /\.(tsx?|css)$/.test(p))) assert.doesNotMatch(source(file), /TreesSide|TREESSIDE|correo@softzenkododevs\.com/, file);
  assert.match(source('src/app/opengraph-image.tsx'), /TREESSET DEVELOPERS/);
});

test('S1 contact provider subject migrates without changing consent, recipient config or payload', async () => {
  const { sendContact } = load('src/lib/contact.ts');
  const data = { nombre: 'Ana', correo: 'visitor@example.test', mensaje: 'Consulta', consent: true, gotcha: '' };
  const calls = [];
  const transport = async (...args) => { calls.push(args); return { ok: true }; };
  assert.equal(await sendContact(data, 'form123', transport), 'sent');
  assert.equal(calls[0][0], 'https://formspree.io/f/form123');
  const payload = JSON.parse(calls[0][1].body);
  assert.equal(payload._subject, 'Nuevo mensaje de Ana desde el sitio de TreesSet Developers');
  assert.equal(payload.email, data.correo);
  assert.equal(payload.mensaje, data.mensaje);
  assert.equal(await sendContact(data, undefined, transport), 'not-configured');
  assert.equal(await sendContact({ ...data, consent: false }, 'form123', transport), 'consent-required');
  assert.equal(calls.length, 1);
});
