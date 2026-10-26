import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/data/content';

export const alt = 'TreesSide Developers · Transformamos ideas en soluciones digitales';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// tests/social-sharing.test.mjs compares this area of the card with the logo file.
const LOGO_BOX = { left: 780, top: 145, size: 340 };

/** Share card used by WhatsApp, LinkedIn and other networks when a page link is posted. */
export default async function OpengraphImage() {
  // Embedded as a data URI so the card is built at compile time without fetching from the network.
  const logo = await readFile(join(process.cwd(), 'public/images/treesside-logo.jpg'));
  const logoSrc = `data:image/jpeg;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '72px 80px', color: '#e2e8f0', fontFamily: 'sans-serif',
        backgroundColor: '#050b14',
        // Satori only accepts gradients in backgroundImage; the base color goes separately.
        backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(0,245,160,.22), transparent 45%), radial-gradient(circle at 85% 75%, rgba(0,210,255,.25), transparent 45%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, color: '#00f5a0', letterSpacing: 4 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#00f5a0' }} />
          TREESSIDE DEVELOPERS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 640 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, color: '#ffffff' }}>Transformamos ideas</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, color: '#00d2ff' }}>en soluciones digitales</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 24, color: '#94a3b8', width: 660 }}>
          <span>Desarrollo web · Apps · Bases de datos · Cloud</span>
          <span style={{ color: '#00f5a0' }}>{new URL(SITE_URL).host}</span>
        </div>
        <img
          src={logoSrc}
          alt=""
          width={LOGO_BOX.size}
          height={LOGO_BOX.size}
          style={{
            position: 'absolute', left: LOGO_BOX.left, top: LOGO_BOX.top, borderRadius: 32,
            boxShadow: '0 0 60px rgba(0,245,160,.35)',
          }}
        />
      </div>
    ),
    size,
  );
}
