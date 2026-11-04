import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page() { const response = await fetch(`${base}/contacto`); assert.equal(response.status, 200); return response.text(); }
const text = html => html.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
async function load() {
  const code = ts.transpileModule(await readFile('src/lib/contact.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {}; vm.runInNewContext(code, { exports, JSON, Date, Promise }); return exports;
}
const DATA = { nombre: 'Ana', correo: 'ana@example.com', mensaje: 'Quiero una app', consent: true, gotcha: '' };

test('S22 contact uses the mockup hero, sprout art, WhatsApp call and location', async () => {
  const html = await page();
  assert.equal(text(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] || ''), 'Toda gran solución empieza con una conversación.');
  assert.ok(html.includes('/images/mockup/contact-tree.webp'));
  assert.ok(text(html).includes('Cuéntanos tu idea.'));
  assert.match(html, /<a[^>]*href="https:\/\/wa\.me\/573057173986[^"]*"[^>]*>[\s\S]*?Prefiero hablar por WhatsApp/);
  for (const value of ['+57 305 717 3986', 'correo@softzenkododevs.com', 'Colombia']) assert.ok(text(html).includes(value), value);
});

test('S22 the form keeps real fields, consent and honeypot and adds an optional need from real services', async () => {
  const html = await page();
  const form = html.match(/<form\b[\s\S]*?<\/form>/)?.[0] || '';
  assert.ok(text(html).includes('Envíanos un mensaje'));
  for (const label of ['Nombre', 'Correo electrónico', '¿Qué necesitas construir?', 'Cuéntanos sobre tu proyecto']) assert.ok(text(form).includes(label), label);
  const select = form.match(/<select\b[\s\S]*?<\/select>/)?.[0] || '';
  assert.ok(select && !/<select[^>]*required/.test(select), 'optional select');
  for (const option of ['Selecciona una opción', 'Desarrollo Web', 'Aplicaciones Móviles', 'Automatización con n8n', 'Otro']) assert.ok(text(select).includes(option), option);
  for (const control of [/<input[^>]*type="text"[^>]*required/, /<input[^>]*type="email"[^>]*required/, /<textarea[^>]*required/, /<input[^>]*name="_gotcha"/]) assert.match(form, control);
  assert.match(form, /Autorizo[\s\S]*?href="\/politica-de-datos"/);
  for (const id of ['contact-name', 'contact-email', 'contact-need', 'contact-message']) assert.match(form, new RegExp(`<label[^>]*for="${id}"`), `label for ${id}`);
});

test('S22 the optional need is sent only when chosen', async () => {
  const { sendContact } = await load();
  const calls = []; const impl = async (url, init) => { calls.push(JSON.parse(init.body)); return { ok: true }; };
  assert.equal(await sendContact({ ...DATA, necesidad: 'Desarrollo Web' }, 'abc123', impl), 'sent');
  assert.equal(await sendContact(DATA, 'abc123', impl), 'sent');
  assert.equal(calls[0].necesidad, 'Desarrollo Web');
  assert.equal('necesidad' in calls[1], false);
  assert.equal(calls[1].mensaje, 'Quiero una app');
});

test('S22 three topics, preserved FAQ and one integrated closing', async () => {
  const html = await page();
  assert.ok(text(html).includes('Puedes escribirnos si quieres hablar sobre:'));
  for (const topic of ['Tu idea', 'El proceso que quieres mejorar', 'Lo que esperas lograr']) assert.ok(text(html).includes(topic), topic);
  assert.ok(html.includes('id="preguntas-frecuentes"'));
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer]) => footer);
  assert.equal(footers.length, 1);
  for (const copy of ['Lo que sigue,', 'Hablemos', 'Política de datos']) assert.ok(footers[0].includes(copy), copy);
});
