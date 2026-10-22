import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
function techCard(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<div[^>]*data-tech="${escaped}"[\\s\\S]*?</svg>`))?.[0];
}

test('technologies include every tool evidenced in the team portfolios, each with its own logo', async () => {
  const html = await page('/servicios');
  for (const name of ['Tailwind CSS', 'Bootstrap', 'WordPress', 'Socket.IO', 'Prisma', 'Pandas', 'Expo', 'GitHub Actions', 'Power Automate', 'HTML y CSS', 'Vite', 'Medusa', 'Framer Motion', 'Firebase', 'Excel']) {
    const card = techCard(html, name);
    assert.ok(card, `missing technology: ${name}`);
    assert.ok(!card.includes('data-tech-fallback'), `fallback initials: ${name}`);
  }
});

test('services describe the work shown in the portfolios', async () => {
  const html = await page('/servicios');
  for (const text of [
    'Sistemas de gestión',
    'APIs REST',
    'Comercio electrónico multivendedor',
    'Sitios y gestores de contenido con WordPress',
    'Análisis exploratorio de datos con Python y Pandas',
    'Dashboards en Power BI con DAX y Power Query',
    'Monitoreo con SIEM y WAF',
    'Autenticación JWT y control por roles',
    'Flujos con n8n y Power Automate',
    'Chat y eventos en tiempo real con Socket.IO',
    'Prisma, TypeORM y Entity Framework Core',
  ]) assert.ok(html.includes(text), text);
});
