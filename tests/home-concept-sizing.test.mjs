import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// S5 (admin-concepts-visible-collage): "Así podría verse tu negocio" artwork
// was too large; both showcases use a smaller image column beside the copy.
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const split = css => {
  const [base, ...rest] = strip(css).split('@media (max-width: 800px)');
  return { base, narrow: rest.join('') };
};
const rule = (source, selector) => source.match(new RegExp(`(?:^|[\\s}])\\.${selector} \\{([^}]+)\\}`))?.[1] || '';
const fractions = block => block.match(/grid-template-columns: minmax\(0, ([\d.]+)fr\) minmax\((\d+)px, 1fr\)/);

for (const file of ['ConceptShowcase', 'AdminConceptShowcase']) {
  test(`S5 ${file} cards use a smaller image column beside the copy`, () => {
    const { base, narrow } = split(readFileSync(`src/components/home/${file}.module.css`, 'utf8'));
    const card = rule(base, 'card');
    assert.match(card, /display: grid;/, `${file}: two-column card`);
    const columns = fractions(card);
    assert.ok(columns, `${file}: image column then copy column`);
    assert.ok(Number(columns[1]) <= 1.2, `${file}: image column ${columns[1]}fr is no longer dominant`);
    assert.ok(Number(columns[2]) >= 280, `${file}: copy column keeps at least ${columns[2]}px`);
    assert.match(rule(base, 'visual'), /min-width: 0;/, `${file}: image column may shrink`);
    assert.match(rule(narrow, 'card'), /grid-template-columns: minmax\(0, ?1fr\)/, `${file}: single column at <=800px`);
  });
}

test('PRESERVE S5 admin artwork stays complete with its sample-data caption', () => {
  const css = strip(readFileSync('src/components/home/AdminConceptShowcase.module.css', 'utf8'));
  assert.match(rule(css, 'visual img'), /object-fit: contain;/);
  assert.match(rule(css, 'visual img'), /width: 100%; height: auto;/);
  const jsx = readFileSync('src/components/home/AdminConceptShowcase.tsx', 'utf8');
  assert.ok(jsx.includes('<figcaption>Diseño conceptual · Datos de ejemplo</figcaption>'));
});
