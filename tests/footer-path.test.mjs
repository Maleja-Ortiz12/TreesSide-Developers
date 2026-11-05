import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('S24 the footer contact line has a desktop curve, a mobile arc and a joint on the sphere', async () => {
  const response = await fetch(base); assert.equal(response.status, 200);
  const footer = (await response.text()).match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || '';
  assert.equal((footer.match(/data-closing-path=""/g) || []).length, 2, 'desktop curve and mobile arc');
  assert.match(footer, /class="[^"]*pathJoin[^"]*"/, 'joint where the line meets the sphere');
  const nav = footer.match(/<nav[^>]*aria-label="Construyamos juntos"[\s\S]*?<\/nav>/)?.[0] || '';
  for (const [stop, label] of [['stopWhatsapp', 'WhatsApp'], ['stopMail', 'Correo'], ['stopProjects', 'Proyectos']]) {
    assert.match(nav, new RegExp(`class="[^"]*${stop}[^"]*"[^>]*>[^]*?${label}`), `${label} anchored to its stop on the line`);
  }
});

test('S24 the line is stretched to the sphere rim and the mobile footer is scaled down', async () => {
  const source = await readFile('src/components/home/ClosingPath.tsx', 'utf8');
  assert.match(source, /ResizeObserver/);
  assert.match(source, /\[data-talk-sphere\]/);
  const css = await readFile('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /@media\(max-width:760px\) \{[^@]*\.sphereStage \{ width: 220px;/);
  assert.match(css, /@media\(max-width:760px\) \{[^@]*\.closing h2 \{ font-size: 2\.2rem; \}/);
});
