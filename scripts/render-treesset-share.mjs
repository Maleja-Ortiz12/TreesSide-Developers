import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

// Static graphic composed from our existing tree-only logo, not an application screenshot.
// Embed the logo so SVG rendering needs no network or external image references.
export async function shareSvg() {
  const logo = await sharp(await readFile('public/images/treesside-logo.webp')).png().toBuffer();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#061b17"/><stop offset="1" stop-color="#0c342a"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="#26dba3" stop-opacity=".17"/><stop offset="1" stop-color="#26dba3" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1010" cy="230" r="380" fill="url(#glow)"/>
  <rect x="28" y="28" width="1144" height="574" rx="28" fill="none" stroke="#2d6654"/>
  <path d="M84 110h48" stroke="#57efbb" stroke-width="5" stroke-linecap="round"/>
  <g font-family="Arial, sans-serif">
    <text x="150" y="117" fill="#b0d9c9" font-size="18" letter-spacing="3">ESTUDIO DE SOFTWARE · COLOMBIA</text>
    <text x="80" y="253" fill="#f2fff9" font-size="100" font-weight="700" letter-spacing="-4">TreesSet</text>
    <text x="86" y="309" fill="#6af0bf" font-size="35" font-weight="600" letter-spacing="7">Developers</text>
    <text x="84" y="391" fill="#d4e9df" font-size="25">Software a medida para hacer crecer tu negocio</text>
    <path d="M84 452h1032" stroke="#2d6654"/>
    <text x="84" y="516" fill="#94baa9" font-size="19" letter-spacing="2">DESARROLLO WEB   /   AUTOMATIZACIÓN   /   SOLUCIONES DIGITALES</text>
  </g>
  <image x="847" y="153" width="260" height="260" href="data:image/png;base64,${logo.toString('base64')}"/>
</svg>`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await sharp(Buffer.from(await shareSvg())).png().toFile('public/images/treesside-share.png');
  console.log('public/images/treesside-share.png · 1200×630');
}
