import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Production modules and event handlers, with local hook state and an intercepted transport.
function harness(search = '', response = { ok: true }) {
  const cache = new Map(), hooks = [], effects = [], calls = [];
  let cursor = 0, dirty = false, query = search;
  const jsx = (type, props) => ({ type, props });
  const react = {
    Suspense: 'Suspense',
    useState(initial) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: initial, set: value => {
        const next = typeof value === 'function' ? value(hooks[index].value) : value;
        if (next !== hooks[index].value) { hooks[index].value = next; dirty = true; }
      } };
      return [hooks[index].value, hooks[index].set];
    },
    useEffect(effect, deps) {
      const index = cursor++, old = hooks[index];
      if (!old || !deps || deps.some((dep, i) => dep !== old.deps[i])) {
        hooks[index] = { deps }; effects.push(effect);
      }
    },
  };
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} }; cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, URL, URLSearchParams, JSON, Date, Promise,
      process: { env: { NEXT_PUBLIC_FORMSPREE_FORM_ID: 'test123' } },
      fetch: async (url, init) => { calls.push({ url, init }); return response; },
      require: spec => {
        if (spec === 'react') return { ...react, default: react };
        if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        if (spec === 'next/navigation') return { useSearchParams: () => new URLSearchParams(query) };
        if (spec === 'next/link' || spec === 'next/image') return { default: spec };
        if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
        if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
        const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
        const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(file => existsSync(file) && statSync(file).isFile());
        assert.ok(resolved, `module ${spec}`);
        return load(resolved);
      },
    });
    return module.exports;
  }
  function expand(tree) {
    if (!tree || typeof tree !== 'object') return tree;
    if (Array.isArray(tree)) return tree.map(expand);
    if (typeof tree.type === 'function') return expand(tree.type(tree.props));
    return { ...tree, props: { ...tree.props, children: [tree.props?.children].flat(Infinity).map(expand) } };
  }
  return {
    load: file => load(path.resolve(file)), calls,
    navigate: value => { query = value; },
    render(file = 'src/components/ContactSection.tsx', name = 'ContactSection') {
      let tree;
      for (let i = 0; i < 5; i++) {
        cursor = 0; dirty = false;
        tree = expand(load(path.resolve(file))[name]());
        while (effects.length) effects.shift()();
        if (!dirty) return tree;
      }
      throw new Error('unstable render');
    },
  };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');
const field = (tree, id) => nodes(tree).find(node => node.props?.id === id);
const links = tree => nodes(tree).filter(node => ['a', 'next/link'].includes(node.type));
const change = (tree, id, value) => field(tree, id).props.onChange({ target: { value } });
const consent = tree => nodes(tree).find(node => node.props?.type === 'checkbox');
const submit = tree => nodes(tree).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
const needs = ['Necesito una página web.', 'Quiero vender por internet.', 'Quiero organizar mi negocio.', 'Quiero automatizar tareas.', 'Necesito orientación.'];
const allQuery = '?servicio=restaurantes&plan=vende-online&demo=restaurante&proyecto=equipo-bendita-gracia';

test('S6 query context validates every catalog and ignores unknown keys and values', () => {
  const h = harness();
  const { readEnquiryContext } = h.load('src/lib/enquiry.ts');
  const { SERVICE_CATEGORIES } = h.load('src/data/serviceCategories/index.ts');
  const { COMMERCIAL_PLANS } = h.load('src/data/plans.ts');
  const { FEATURED_PROJECTS } = h.load('src/data/content.ts');
  for (const [key, catalog, id, label] of [
    ['servicio', SERVICE_CATEGORIES, 'slug', 'label'], ['plan', COMMERCIAL_PLANS, 'id', 'name'], ['proyecto', FEATURED_PROJECTS, 'id', 'title'],
  ]) {
    for (const item of catalog) {
      const context = readEnquiryContext(`?${key}=${encodeURIComponent(item[id])}`);
      assert.equal(context.length, 1);
      assert.equal(context[0].id, item[id]);
      assert.equal(context[0].label, item[label]);
    }
  }
  for (const [slug, title] of [['restaurante', 'La Lupe'], ['radio', 'Emisoras Latinas'], ['logistica', 'Calculadora de contenedores']]) {
    assert.equal(readEnquiryContext(`?demo=${slug}`)[0].label, title);
  }
  for (const search of ['', '?servicio=unknown&plan=unknown&demo=unknown&proyecto=unknown', '?mensaje=injected&consent=true', '?plan=%3Cscript%3E']) {
    assert.equal(readEnquiryContext(search).length, 0);
  }
  assert.equal(readEnquiryContext('?servicio=ecommerce&plan=unknown').length, 1);
});

test('S5/S6 context is visible and carried in mensaje without overwriting fields or prechecking consent', async () => {
  const h = harness(allQuery);
  let tree = h.render();
  for (const label of ['Servicio: Restaurantes', 'Plan: Vende Online', 'Demo conceptual: La Lupe', 'Proyecto: Bendita Gracia']) assert.ok(text(tree).includes(label), label);
  assert.equal(consent(tree).props.checked, false);
  assert.equal(field(tree, 'contact-message').props.value, '');
  for (const [id, value] of [['contact-name', 'Ana'], ['contact-email', 'ana@example.com'], ['contact-message', 'Ya tengo una idea propia'], ['contact-need', needs[2]]]) {
    change(tree, id, value); tree = h.render();
  }
  await submit(tree); assert.equal(h.calls.length, 0, 'no consent, no send');
  consent(tree).props.onChange({ target: { checked: true } }); tree = h.render();
  await submit(tree);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, 'https://formspree.io/f/test123');
  const body = JSON.parse(h.calls[0].init.body);
  assert.equal(body.mensaje, 'Ya tengo una idea propia\n\nConsulta sobre:\nServicio: Restaurantes\nPlan: Vende Online\nDemo conceptual: La Lupe\nProyecto: Bendita Gracia');
  assert.equal(body.necesidad, needs[2]);
  assert.equal(body.nombre, 'Ana'); assert.equal(body.email, 'ana@example.com');
  assert.match(body.consentimiento, /Acepta la política/);
  assert.equal('_gotcha' in body, false);
  assert.match(text(h.render()), /revisará.*contactará/i);
  assert.doesNotMatch(text(h.render()), /brevedad|24 horas|48 horas/i);
});

test('S6 same-page query navigation changes context only; unknown context and plain enquiries stay unchanged', async () => {
  const h = harness('?servicio=ecommerce');
  let tree = h.render();
  change(tree, 'contact-message', 'Mi texto'); tree = h.render();
  change(tree, 'contact-need', needs[4]); tree = h.render();
  h.navigate('?servicio=automatizacion&demo=radio'); tree = h.render();
  assert.ok(text(tree).includes('Demo conceptual: Emisoras Latinas'));
  assert.ok(!text(tree).includes('Servicio: E-commerce'));
  assert.equal(field(tree, 'contact-message').props.value, 'Mi texto');
  assert.equal(field(tree, 'contact-need').props.value, needs[4]);
  assert.equal(consent(tree).props.checked, false);
  h.navigate('?servicio=unknown&plan=unknown'); tree = h.render();
  assert.ok(!text(tree).includes('Consulta sobre:'));
  assert.equal(field(tree, 'contact-message').props.value, 'Mi texto');
  const { enquiryMessage } = h.load('src/lib/enquiry.ts');
  assert.equal(enquiryMessage('Texto sin contexto', []), 'Texto sin contexto');
  const source = readFileSync('src/components/ContactSection.tsx', 'utf8');
  assert.match(source, /Suspense/); // Query consumer must not force a static page to bail out.
});

test('S6 exactly five optional plain needs, next steps, labels, required fields and honeypot remain', () => {
  const h = harness('?consent=true'); const tree = h.render();
  const select = field(tree, 'contact-need');
  assert.deepEqual(nodes(select).filter(node => node.type === 'option').slice(1).map(text), needs);
  assert.ok(!select.props.required);
  for (const id of ['contact-name', 'contact-email', 'contact-message']) assert.equal(field(tree, id).props.required, true);
  assert.equal(field(tree, 'contact-email').props.type, 'email');
  assert.equal(consent(tree).props.required, true); assert.equal(consent(tree).props.checked, false);
  const trap = nodes(tree).find(node => node.props?.name === '_gotcha');
  assert.equal(trap.props.tabIndex, -1); assert.equal(String(trap.props['aria-hidden']), 'true');
  assert.ok(links(tree).some(node => node.props.href === '/politica-de-datos'));
  assert.match(text(tree), /revisamos.*necesidad/i); assert.match(text(tree), /alcance.*propuesta/i);
  assert.doesNotMatch(text(tree), /brevedad|24 horas|48 horas/i);
});

test('S6 contextual WhatsApp and rejected-send fallback retain selection, edits and configured number', async () => {
  const h = harness(allQuery, { ok: false }); let tree = h.render();
  const initial = links(tree).find(node => text(node).includes('Prefiero hablar por WhatsApp'));
  const configured = new URL(h.load('src/data/content.ts').CONTACT_INFO.whatsappUrl);
  assert.equal(new URL(initial.props.href).pathname, configured.pathname);
  assert.match(new URL(initial.props.href).searchParams.get('text'), /Plan: Vende Online/);
  for (const [id, value] of [['contact-name', 'Ana'], ['contact-email', 'ana@example.com'], ['contact-message', 'Conservar detalles'], ['contact-need', needs[1]]]) {
    change(tree, id, value); tree = h.render();
  }
  consent(tree).props.onChange({ target: { checked: true } }); tree = h.render();
  await submit(tree); tree = h.render();
  assert.equal(field(tree, 'contact-message').props.value, 'Conservar detalles');
  assert.equal(field(tree, 'contact-need').props.value, needs[1]);
  assert.equal(consent(tree).props.checked, true);
  const alert = nodes(tree).find(node => node.props?.role === 'alert'); assert.ok(alert);
  const fallback = links(alert).find(node => text(node) === 'WhatsApp');
  const url = new URL(fallback.props.href);
  assert.equal(url.origin, configured.origin); assert.equal(url.pathname, configured.pathname);
  for (const expected of ['Conservar detalles', needs[1], 'Servicio: Restaurantes', 'Plan: Vende Online', 'Demo conceptual: La Lupe', 'Proyecto: Bendita Gracia']) assert.ok(url.searchParams.get('text').includes(expected), expected);
  assert.equal(h.calls.length, 1);
});

test('S5 every overview, preview and detail card offers a contextual form enquiry while preserving catalog content', () => {
  const h = harness(); const plans = h.load('src/data/plans.ts').COMMERCIAL_PLANS;
  for (const [file, name, marker] of [
    ['src/components/plans/PlansMockup.tsx', 'PlansOverview', 'data-plan-preview'],
    ['src/components/PlansSection.tsx', 'PlansPreview', 'data-plan-preview'],
    ['src/components/PlansSection.tsx', 'PlansSection', 'data-plan'],
  ]) {
    const tree = h.render(file, name);
    const cards = nodes(tree).filter(node => node.type === 'article' && node.props[marker]);
    assert.equal(cards.length, plans.length, name);
    for (const plan of plans) {
      const card = cards.find(node => node.props[marker] === plan.id); assert.ok(card, plan.id);
      const cta = links(card).find(node => text(node).trim() === 'Consultar este plan');
      assert.equal(cta?.props.href, `/contacto?plan=${plan.id}`);
      assert.ok(text(card).includes(h.load('src/data/plans.ts').formatPlanPrice(plan.price)));
      if (name === 'PlansSection') {
        for (const value of [plan.audience, plan.outcome, plan.delivery, ...plan.includes, ...plan.excludes, ...plan.recurring, ...plan.requirements]) assert.ok(text(card).includes(value), value);
        const whatsapp = links(card).find(node => text(node).includes('Cotizar este plan'));
        assert.ok(new URL(whatsapp.props.href).searchParams.get('text').includes(plan.name));
      }
    }
  }
});

test('S8 contextual notice contains readable Spanish', () => {
  const copy = text(harness('?plan=impulso-web').render());
  assert.doesNotMatch(copy, /�/);
  assert.ok(copy.includes('Esta selección no implica una contratación.'));
});

test('S5 every service-plan option survives its validated enquiry link', () => {
  const h = harness(), e = h.load('src/lib/enquiry.ts');
  const { SERVICE_CATEGORIES, LEGACY_SERVICE_CATEGORIES } = h.load('src/data/serviceCategories/index.ts');
  for (const category of [...SERVICE_CATEGORIES, ...LEGACY_SERVICE_CATEGORIES]) {
    for (const plan of category.plans.items) {
      const href = e.enquiryHref({ servicio: category.slug, opcion: plan.name });
      const context = e.readEnquiryContext(new URL(href, 'http://test').search);
      assert.equal(context.length, 2); assert.equal(context[1].label, plan.name);
    }
  }
});
