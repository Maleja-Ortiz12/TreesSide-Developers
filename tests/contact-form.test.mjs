import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

async function load() {
  const code = ts.transpileModule(await readFile('src/lib/contact.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, JSON, Date, Promise });
  return exports;
}
const DATA = { nombre: 'Ana', correo: 'ana@example.com', mensaje: 'Quiero una app', consent: true, gotcha: '' };
function fakeFetch(response) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    if (response instanceof Error) throw response;
    return response;
  };
  return { calls, impl };
}

test('S2 without a configured Formspree form ID nothing is sent and the visitor is told so', async () => {
  const { sendContact } = await load();
  for (const formId of [undefined, '', 'abc/../evil', 'id?x=1']) {
    const { calls, impl } = fakeFetch({ ok: true });
    assert.equal(await sendContact(DATA, formId, impl), 'not-configured', String(formId));
    assert.equal(calls.length, 0);
  }
});

test('S3 the message is not sent without consent to the data policy', async () => {
  const { sendContact } = await load();
  const { calls, impl } = fakeFetch({ ok: true });
  assert.equal(await sendContact({ ...DATA, consent: false }, 'xyzabc', impl), 'consent-required');
  assert.equal(calls.length, 0);
});

test('S2 a filled honeypot is dropped silently', async () => {
  const { sendContact } = await load();
  const { calls, impl } = fakeFetch({ ok: true });
  assert.equal(await sendContact({ ...DATA, gotcha: 'http://spam' }, 'xyzabc', impl), 'sent');
  assert.equal(calls.length, 0);
});

test('S2 only an accepted Formspree response counts as sent', async () => {
  const { sendContact } = await load();
  const ok = fakeFetch({ ok: true });
  assert.equal(await sendContact(DATA, 'xyzabc', ok.impl), 'sent');
  assert.equal(ok.calls.length, 1);
  const [{ url, init }] = ok.calls;
  assert.equal(url, 'https://formspree.io/f/xyzabc');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers.Accept, 'application/json');
  const body = JSON.parse(init.body);
  assert.equal(body.email, 'ana@example.com');
  assert.equal(body.nombre, 'Ana');
  assert.equal(body.mensaje, 'Quiero una app');
  assert.match(body.consentimiento, /Acepta la política de tratamiento de datos personales/);
  assert.equal((await sendContact(DATA, 'xyzabc', fakeFetch({ ok: false, status: 422 }).impl)), 'error');
  assert.equal((await sendContact(DATA, 'xyzabc', fakeFetch(new Error('offline')).impl)), 'error');
});

test('S3 the contact form requires an unchecked consent box linked to the policy and has a honeypot', async () => {
  const response = await fetch(new URL('/contacto', process.env.TEST_BASE_URL || 'http://localhost:3000'), { signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  const box = html.match(/<input[^>]*type="checkbox"[^>]*>/)?.[0] ?? '';
  assert.ok(box.includes('required'), 'consent required');
  assert.ok(!/\schecked/.test(box), 'consent starts unchecked');
  assert.match(html, /<label[^>]*>[\s\S]*?Autorizo[\s\S]*?href="\/politica-de-datos"/);
  assert.match(html, /<input[^>]*name="_gotcha"[^>]*>/);
});

test('S2 the form shows success only for a sent result, never a simulated one', async () => {
  const source = await readFile('src/components/ContactSection.tsx', 'utf8');
  assert.ok(!source.includes('Simulate'), 'no simulated submission');
  assert.ok(source.includes('sendContact('));
  assert.ok(source.includes("process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID"));
  assert.match(source, /status === 'sent'/);
});
