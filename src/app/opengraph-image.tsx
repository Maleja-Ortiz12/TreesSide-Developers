import { ImageResponse } from 'next/og';

export const alt = 'TreesSide Developers · Transformamos ideas en soluciones digitales';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share card used by WhatsApp, LinkedIn and other networks when a page link is posted. */
export default function OpengraphImage() {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: '#ffffff' }}>Transformamos ideas</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: '#00d2ff' }}>en soluciones digitales</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#94a3b8' }}>
          <span>Desarrollo web · Apps · Bases de datos · Cloud</span>
          <span>softzenkododevs.com</span>
        </div>
      </div>
    ),
    size,
  );
}
