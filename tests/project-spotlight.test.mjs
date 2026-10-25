import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
test('projects present a navigable spotlight without replacing the project catalog or filters', async () => {
  const response = await fetch(new URL('/proyectos', base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('aria-label="Proyecto en primer plano"'));
  for (const label of ['Proyecto anterior', 'Proyecto siguiente', 'Ver detalles del proyecto destacado']) assert.ok(html.includes(`aria-label="${label}"`), label);
  assert.ok(html.includes('data-project="equipo-ocho80"'));
  assert.ok(html.includes('aria-pressed="true"'));
  assert.ok(html.includes('Ver portafolio del autor'));
});

test('spotlight handles navigation limits, filter changes and reduced motion', async () => {
  const component = await readFile('src/components/ProjectSpotlight.tsx', 'utf8');
  const page = await readFile('src/components/ProjectsSection.tsx', 'utf8');
  const css = await readFile('src/components/ProjectSpotlight.module.css', 'utf8');
  assert.ok(component.includes('% projects.length'));
  assert.ok(component.includes('onOpen(project)'));
  assert.ok(page.includes('<ProjectSpotlight key={`spotlight-${activeFilter}`} projects={filteredProjects}'));
  assert.ok(css.includes('@keyframes'));
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
});
