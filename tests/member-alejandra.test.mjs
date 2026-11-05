import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Alejandra is a software developer credited for much of the website, not sole authorship or junior', async () => {
  const source = await readFile('src/data/team.ts', 'utf8');
  const profile = source.split("name: 'María Alejandra Ortiz Páez'")[1]?.split("name: 'Jorge Luis Ramírez Trochez'")[0];
  assert.ok(profile);
  assert.match(profile, /role: 'Desarrolladora de Software'/);
  assert.doesNotMatch(profile, /Junior|Creadora de este sitio|Creación y desarrollo del sitio/);
  assert.match(profile, /Desarrollo de gran parte del sitio web de TreesSide Developers\./);
  for (const retained of ['Flutter', 'Unity', 'ciberseguridad', 'portafolio-bay-tau.vercel.app', 'Dimension Shift', 'UptownHair', 'La Lupe']) {
    assert.ok(profile.includes(retained), retained);
  }
});
