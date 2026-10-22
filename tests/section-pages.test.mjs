import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

const ROUTES = [
  { path: '/', title: /<title>TreesSide Developers/, sections: ['inicio'] },
  { path: '/servicios', title: /<title>Servicios \| TreesSide Developers/, sections: ['servicios', 'tecnologias'] },
  { path: '/proyectos', title: /<title>Proyectos \| TreesSide Developers/, sections: ['proyectos'] },
  { path: '/nosotros', title: /<title>Sobre nosotros \| TreesSide Developers/, sections: ['sobre-nosotros', 'equipo', 'proceso'] },
  { path: '/contacto', title: /<title>Contacto \| TreesSide Developers/, sections: ['contacto'] },
];
const ALL_SECTIONS = ['inicio', 'servicios', 'tecnologias', 'proyectos', 'sobre-nosotros', 'equipo', 'proceso', 'contacto'];

for (const route of ROUTES) {
  test(`${route.path} renders only its own sections`, async () => {
    const html = await page(route.path);
    assert.match(html, route.title);
    for (const id of ALL_SECTIONS) {
      const present = new RegExp(`<section[^>]*id="${id}"`).test(html);
      assert.equal(present, route.sections.includes(id), `${route.path} section ${id}`);
    }
  });

  test(`${route.path} header links to every section page and marks the current one`, async () => {
    const html = await page(route.path);
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header);
    for (const href of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto']) {
      assert.ok(header.includes(`href="${href}"`), href);
    }
    assert.ok(!/href="\/?#/.test(header), 'no in-page anchors remain in the header');
    const current = [...header.matchAll(/<a [^>]*aria-current="page"[^>]*>/g)].map(([tag]) => tag);
    assert.equal(current.length, 1, 'exactly one current link');
    assert.ok(current[0].includes(`href="${route.path}"`), current[0]);
  });
}

test('footer quick links and calls to action navigate to section pages', async () => {
  const home = await page('/');
  const footer = home.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer);
  for (const href of ['/', '/servicios', '/proyectos', '/nosotros', '/contacto']) assert.ok(footer.includes(`href="${href}"`), href);
  const hero = home.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero.includes('href="/proyectos"'));
  assert.ok(hero.includes('href="/contacto"'));
  for (const path of ['/servicios', '/proyectos', '/nosotros', '/equipo']) {
    const html = await page(path);
    assert.ok(html.includes('href="/contacto"'), `${path} contact CTA`);
    assert.ok(!html.includes('href="/#contacto"'), `${path} legacy anchor`);
  }
});

test('the mockup view switcher is gone from the home page', async () => {
  const home = await page('/');
  assert.ok(!/Vista|Columna/.test(home.match(/<body[\s\S]*<\/body>/)[0].replace(/<script[\s\S]*?<\/script>/g, '')));
});
