import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MotionShell } from './motion/MotionShell';
import { Reveal } from './motion/Reveal';

export function SitePage({ children, offsetHeader = true }: { children: React.ReactNode; offsetHeader?: boolean }) {
  return (
    <MotionShell>
      {/* `clip` trims decorative glows that stick out sideways without creating a scroll container. */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
        <Navbar />
        <main style={{ flexGrow: 1, paddingTop: offsetHeader ? '76px' : 0 }}>
          {React.Children.map(children, (child, index) => <Reveal first={index === 0}>{child}</Reveal>)}
        </main>
        <Footer />
      </div>
    </MotionShell>
  );
}
