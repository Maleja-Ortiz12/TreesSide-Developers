import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Reproducible conceptual illustrations, NOT screenshots of the applications.
// Public portfolios were checked before creating these because no usable capture was available.
// No client data, real dashboard measurements or working QR codes are embedded.
const OUTPUT = 'public/images/projects';
const C = { cyan: '#55dfff', green: '#72edba', white: '#eef6ff', muted: '#a6bad3', line: '#28435e', ink: '#0c1c30', gold: '#ffce81' };
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const text = (x, y, value, size = 22, color = C.white, weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${escape(value)}</text>`;
const rect = (x, y, w, h, fill = C.ink, stroke = C.line, radius = 18) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const line = (x1, y1, x2, y2, color = C.cyan, dash = '') => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
const circle = (x, y, r, fill, stroke = 'none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const chip = (x, y, title) => rect(x, y, 210, 40, '#102d42', '#2e526a', 20) + text(x + 16, y + 27, title, 17, C.cyan, 600);
const arrow = (x, y, width = 65) => line(x, y, x + width, y) + `<path d="M${x + width - 12} ${y - 8}l12 8-12 8" fill="none" stroke="${C.cyan}" stroke-width="3"/>`;
const isoBox = (x, y, fill = '#3e91ad') => `<g transform="translate(${x} ${y})"><path d="M0 0l66-32 66 32-66 32Z" fill="${fill}" stroke="#7ce4ff"/><path d="M0 0v60l66 32V32Z" fill="#23546e" stroke="#7ce4ff"/><path d="M66 32l66-32v60l-66 32Z" fill="#14364f" stroke="#7ce4ff"/><path d="M33-16l66 32" stroke="#bcf2ff" stroke-width="3"/></g>`;

const covers = [
  {
    slug: 'calculadora-contenedores', title: 'Calculadora de contenedores', subtitle: 'Orientación, capas y distribución de carga',
    tags: ['EXPO · REACT NATIVE', 'LOGÍSTICA'],
    scene: () => rect(80, 255, 1040, 335, '#0b1e31') +
      `<path d="M170 490l290-140 290 140-290 140Z" fill="#203344" stroke="#6d8da3" stroke-width="3"/>` +
      isoBox(240, 390) + isoBox(374, 390) + isoBox(307, 325, '#57b5cb') +
      line(180, 545, 458, 678, C.gold, '8 8') + line(458, 678, 738, 545, C.gold, '8 8') +
      text(795, 330, 'PLAN DE CARGA', 18, C.cyan, 700) +
      text(795, 380, 'Cajas por capa', 25) + text(795, 430, 'Altura disponible', 25) +
      text(795, 480, 'Orientación óptima', 25) + text(795, 537, 'Distribución ilustrada', 18, C.muted),
  },
  {
    slug: 'libres-en-cristo', title: 'Libres en Cristo Jesús', subtitle: 'Gestión congregacional y asistencia mediante QR',
    tags: ['NESTJS · NEXT.JS', 'POSTGRESQL'],
    scene: () => rect(80, 255, 600, 345) + text(110, 297, 'PERSONAS Y ASISTENCIA', 19, C.cyan, 700) +
      [0, 1, 2].map(i => rect(110, 320 + i * 78, 540, 62, '#122a40', '#28435e', 12) +
        circle(144, 351 + i * 78, 17, '#244c64') + line(179, 341 + i * 78, 370, 341 + i * 78, '#8ca8bd') +
        line(179, 360 + i * 78, 300, 360 + i * 78, '#446682') +
        `<path d="M587 ${350 + i * 78}l9 9 18-19" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('') +
      rect(760, 255, 350, 345, '#10263c') + text(800, 297, 'QR ILUSTRATIVO', 19, C.green, 700) +
      [0, 1, 2].map(i => {
        const [x, y] = [[814, 332], [990, 332], [814, 488]][i];
        return rect(x, y, 62, 62, 'none', C.white, 6) + rect(x + 15, y + 15, 32, 32, C.white, 'none', 3);
      }).join('') + rect(913, 422, 30, 30, C.green, 'none', 2) + rect(974, 454, 30, 30, C.white, 'none', 2) +
      text(801, 579, 'No es un código escaneable', 16, C.muted),
  },
  {
    slug: 'tienda-api', title: 'API de Tienda + Asistente IA', subtitle: 'Catálogo conectado a un asistente que consulta datos',
    tags: ['.NET · EF CORE', 'POSTGRESQL · RAG'],
    scene: () => ['productos', 'categorías', 'clientes'].map((label, i) =>
      rect(80, 273 + i * 100, 290, 76) + text(106, 320 + i * 100, label, 27) +
      line(370, 311 + i * 100, 515, 409, C.cyan, '6 5')).join('') +
      `<path d="M590 307l90 51v102l-90 51-90-51V358Z" fill="#143b52" stroke="${C.cyan}" stroke-width="3"/>` +
      text(546, 424, 'API', 46, C.white, 700) + arrow(686, 410, 80) +
      rect(788, 273, 322, 307, '#102d39', '#3e6e67') + text(815, 315, 'ASISTENTE IA', 20, C.green, 700) +
      rect(815, 340, 265, 70, '#173e49', 'none', 12) + text(833, 370, 'Consulta el catálogo', 18) +
      text(833, 395, 'con lenguaje natural', 18) +
      line(815, 448, 1050, 448, '#72b6ad') + line(815, 479, 1020, 479, '#72b6ad') +
      text(815, 542, 'Datos → contexto → respuesta', 16, C.muted),
  },
  {
    slug: 'gestion-inventarios', title: 'Sistema de gestión de inventarios', subtitle: 'Existencias organizadas para pequeños negocios',
    tags: ['PHP · LARAVEL', 'CONTROL DE STOCK'],
    scene: () => rect(80, 255, 530, 345) + [0, 1].map(row => {
      const y = 325 + row * 128;
      return line(120, y + 84, 570, y + 84, '#658198') +
        [0, 1, 2].map(col => rect(140 + col * 140, y, 105, 77, col === 2 ? '#57452d' : '#17445b', col === 2 ? C.gold : C.cyan, 8) +
          line(174 + col * 140, y, 174 + col * 140, y + 77, '#7aa6bb')).join('');
    }).join('') + rect(660, 255, 450, 345) + text(694, 299, 'EXISTENCIAS', 20, C.cyan, 700) +
      [0, 1, 2].map(i => text(694, 350 + i * 78, ['Entradas', 'Salidas', 'Stock disponible'][i], 23) +
        rect(694, 367 + i * 78, 370, 12, '#17354a', 'none', 6) +
        rect(694, 367 + i * 78, [285, 150, 220][i], 12, i === 1 ? C.gold : C.green, 'none', 6)).join(''),
  },
  {
    slug: 'gestion-agropecuaria', title: 'Aplicación de gestión agropecuaria', subtitle: 'Ganadería, cultivos, gastos y finanzas agrícolas',
    tags: ['FLUTTER · DART', 'APLICACIÓN MÓVIL'],
    scene: () => rect(80, 255, 1040, 345, '#102d30', '#2d5658') + circle(880, 322, 42, '#ffce81') +
      `<path d="M82 476Q280 325 522 463T1118 438V598H82Z" fill="#286051"/><path d="M82 530Q340 412 650 512T1118 486V598H82Z" fill="#397e5d"/>` +
      [0, 1, 2, 3, 4].map(i => `<path d="M${160 + i * 155} 598Q${200 + i * 145} 510 ${250 + i * 140} 483" fill="none" stroke="#78bc6c" stroke-width="9"/>`).join('') +
      rect(150, 280, 240, 310, '#0c2133', '#89d7cf', 28) + rect(220, 292, 100, 8, '#42646b', 'none', 4) +
      text(177, 337, 'GESTIÓN DEL CAMPO', 16, C.green, 700) +
      ['Ganadería', 'Cultivos', 'Gastos', 'Finanzas'].map((s, i) => rect(174, 356 + i * 49, 190, 36, '#183b42', 'none', 8) + text(188, 380 + i * 49, s, 17)).join('') +
      text(505, 355, 'Del campo a los datos', 31, C.white, 600),
  },
  {
    slug: 'migracion-pega-uipath', title: 'Migración Pega → UiPath', subtitle: 'Evolución de procesos automatizados en banca',
    tags: ['UIPATH · REFRAMEWORK', 'EXPERIENCIA LABORAL'],
    scene: () => rect(80, 275, 290, 240, '#202a43', '#756ca3') + text(115, 325, 'ORIGEN', 19, '#b7a6ec', 700) +
      text(115, 393, 'Pega', 44, C.white, 700) + text(115, 464, 'Procesos legados', 21, C.muted) + arrow(390, 393, 78) +
      rect(490, 300, 235, 190, '#163943', '#529d9a') + text(518, 348, 'MIGRACIÓN', 20, C.green, 700) +
      text(518, 396, 'Mapeo de flujos', 20) + text(518, 438, 'Validación', 20) + arrow(745, 393, 65) +
      rect(832, 275, 290, 240, '#382d26', '#b77b50') + text(867, 325, 'DESTINO', 19, C.gold, 700) +
      text(867, 393, 'UiPath', 44, C.white, 700) + text(867, 464, 'Automatización RPA', 21, C.muted) +
      line(150, 556, 1050, 556, '#46796e', '8 8') + text(350, 590, 'Diagrama conceptual · sin datos de clientes', 20, C.muted),
  },
];

await mkdir(OUTPUT, { recursive: true });
for (const item of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#102b40"/><stop offset="1" stop-color="#060e1c"/></linearGradient><radialGradient id="light"><stop stop-color="#1e6070" stop-opacity=".42"/><stop offset="1" stop-color="#102236" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="750" fill="url(#bg)"/><circle cx="1000" cy="100" r="490" fill="url(#light)"/>
  <g font-family="Segoe UI, Arial, sans-serif">
  ${text(64, 57, 'TREESSIDE  /  PORTAFOLIO', 18, C.green, 700)}
  ${text(64, 121, item.title, item.title.length > 33 ? 39 : 43, C.white, 700)}
  ${text(64, 164, item.subtitle, 23, C.muted)}
  ${chip(64, 188, item.tags[0])}${chip(294, 188, item.tags[1])}
  ${item.scene()}
  ${rect(64, 674, 1072, 42, '#102b37', '#42616c', 12)}
  ${text(86, 702, 'ILUSTRACIÓN CONCEPTUAL · NO ES UNA CAPTURA REAL DEL PRODUCTO', 18, '#d5e6ed', 600)}
  </g></svg>`;
  const file = `${OUTPUT}/${item.slug}.webp`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(file);
  console.log(file);
}
