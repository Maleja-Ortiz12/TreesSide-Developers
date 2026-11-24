import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('admin service titles precede the demonstration and span both columns', () => {
  const jsx = readFileSync('src/components/home/AdminConceptShowcase.tsx', 'utf8');
  const css = readFileSync('src/components/home/AdminConceptShowcase.module.css', 'utf8');
  assert.match(jsx, /serviceTitle: 'Sistemas de gestión'/);
  assert.match(jsx, /serviceTitle: 'App para restaurantes'/);
  assert.match(jsx, /<h4 className=\{styles.serviceTitle\}>\{concept.serviceTitle\}<\/h4>\s*<figure/);
  assert.match(css, /\.serviceTitle\s*\{[^}]*grid-column: 1 \/ -1/);
  assert.match(jsx, /<figcaption>Diseño conceptual · Datos de ejemplo<\/figcaption>/);
  assert.match(jsx, /href=\{`\/servicios\/\$\{concept.service\}`\}/);
});
