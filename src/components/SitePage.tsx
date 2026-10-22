import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function SitePage({ children, offsetHeader = true }: { children: React.ReactNode; offsetHeader?: boolean }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1, paddingTop: offsetHeader ? '76px' : 0 }}>{children}</main>
      <Footer />
    </div>
  );
}
