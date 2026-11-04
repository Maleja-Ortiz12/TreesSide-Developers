'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Menu, X, Send } from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Planes', href: '/planes' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Sobre Nosotros', href: '/nosotros' },
  { label: 'Equipo', href: '/equipo' },
];

// The mockup keeps Contacto inside the same pill bar as the section links.
const PILL_LINKS = [...NAV_LINKS, { label: 'Contacto', href: '/contacto' }];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const isCurrent = (href: string) => pathname === href;

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-row">
        <Link href="/" aria-label="TreesSide Developers, ir al inicio" style={{ textDecoration: 'none' }}>
          <Logo size="md" showText={true} />
        </Link>

        <nav className="desktop-nav" aria-label="Principal">
          {PILL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className={`pill-link${isCurrent(item.href) ? ' is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
          aria-expanded={mobileMenuOpen}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} color="var(--primary-green)" /> : <Menu size={26} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className={`drawer-link${isCurrent(item.href) ? ' is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary" style={{ marginTop: '10px' }}>
            <Send size={18} />
            Contacto
          </Link>
        </div>
      )}

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: background 0.3s ease, box-shadow 0.3s ease;
          background: linear-gradient(180deg, rgba(5, 17, 15, 0.9), rgba(5, 17, 15, 0.55));
        }
        .site-header.is-scrolled {
          background: rgba(5, 17, 15, 0.92);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }
        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          height: 76px;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          border: 1px solid rgba(62, 240, 168, 0.22);
          background: rgba(8, 24, 21, 0.72);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 30px -18px rgba(0, 0, 0, 0.8);
        }
        .desktop-nav :global(.pill-link) {
          color: #e6f5ef;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .desktop-nav :global(.pill-link:hover) {
          color: var(--primary-green);
        }
        .desktop-nav :global(.pill-link.is-active) {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(62, 240, 168, 0.3), rgba(20, 120, 90, 0.35));
          border-color: rgba(62, 240, 168, 0.75);
          box-shadow: 0 0 14px rgba(62, 240, 168, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 6px;
        }
        .mobile-drawer {
          background: rgba(5, 17, 15, 0.98);
          border-bottom: 1px solid var(--border-card);
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-drawer :global(.drawer-link) {
          color: #ffffff;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mobile-drawer :global(.drawer-link.is-active) {
          color: var(--primary-green);
        }
        @media (max-width: 1060px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
