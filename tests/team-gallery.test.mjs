import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function html(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return response.text();
}

test('team gallery preserves profile content behind accessible selection buttons', async () => {
  const page = await html('/equipo');
  const heading = page.match(/<h1\b[\s\S]*?<\/h1>/)?.[0];
  assert.ok(heading?.includes('Talento que crece'));
  assert.ok(!heading.includes('Tres miradas'));
  const articles = [...page.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([article]) => article);
  assert.equal(articles.length, 3);
  const ids = [];
  for (const article of articles) {
    const button = article.match(/<button\b[^>]*aria-expanded="false"[^>]*>[\s\S]*?<\/button>/)?.[0];
    assert.ok(button, 'Each person has a selection button');
    const id = button.match(/aria-controls="([^"]+)"/)?.[1];
    assert.ok(id);
    ids.push(id);
    assert.ok(button.includes('Ver perfil'));
    assert.ok(article.indexOf('<img') < article.indexOf('<h2'));
    const intro = article.slice(0, article.indexOf('<button'));
    assert.match(intro, /<h2\b/);
    assert.match(intro, /<p[^>]*>[\s\S]*?<\/p>/);
    assert.ok(article.includes('Áreas de aporte'));
    assert.ok(article.includes('Formación'));
    assert.ok(article.includes('Proyectos del portafolio'));
  }
  assert.equal(new Set(ids).size, 3);
});

test('gallery uses a scalable grid and a full-width centered profile', async () => {
  const page = await html('/equipo');
  const urls = [...page.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)]
    .map(([, url]) => url.replaceAll('&amp;', '&'));
  assert.ok(urls.length > 0, 'Page exposes its stylesheets');
  const sheets = await Promise.all(urls.map(url => html(url)));
  const css = sheets.find(sheet => sheet.includes('TeamGallery_gallery'));
  assert.ok(css, 'Gallery styles are served');
  assert.match(css, /repeat\(auto-fit,/);
  assert.match(css, /grid-column:\s*1\s*\/\s*-1/);
  assert.ok(!/overflow-x:\s*auto/.test(css));
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.ok(css.includes('preserve-3d'));
  assert.ok(css.includes('translateZ(24px)'));
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
});
