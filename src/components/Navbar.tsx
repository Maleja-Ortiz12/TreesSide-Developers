'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Menu, X, Send, House, Layers, Tag, Monitor, Sprout, Users, Mail, MessageCircle, type LucideIcon } from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Planes', href: '/planes' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Sobre Nosotros', href: '/nosotros' },
  { label: 'Equipo', href: '/equipo' },
];

// The mockup's vertical rail: one icon over a short label per page, Contacto last.
const RAIL_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Inicio', href: '/', icon: House },
  { label: 'Servicios', href: '/servicios', icon: Layers },
  { label: 'Planes', href: '/planes', icon: Tag },
  { label: 'Proyectos', href: '/proyectos', icon: Monitor },
  { label: 'Nosotros', href: '/nosotros', icon: Sprout },
  { label: 'Equipo', href: '/equipo', icon: Users },
  { label: 'Contacto', href: '/contacto', icon: Mail },
];

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
      <div className="header-row">
        <Link href="/" aria-label="TreesSide Developers, ir al inicio" style={{ textDecoration: 'none' }}>
          <Logo size="md" showText={true} />
        </Link>

        <p className="studio-tag">Estudio de software <span aria-hidden="true">•</span> Colombia</p>

        <div className="header-actions">
          <Link href="/contacto" className="talk-button">
            <span className="talk-icon"><MessageCircle size={18} aria-hidden="true" /></span>
            Hablemos
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} color="var(--primary-green)" /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <nav className="desktop-nav" aria-label="Principal">
        {RAIL_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isCurrent(href) ? 'page' : undefined}
            className={`rail-link${isCurrent(href) ? ' is-active' : ''}`}
          >
            <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

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
          background: linear-gradient(180deg, rgba(5, 17, 15, 0.85), rgba(5, 17, 15, 0));
        }
        .site-header.is-scrolled {
          background: rgba(5, 17, 15, 0.92);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }
        .header-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          height: 76px;
          padding: 0 28px;
        }
        .studio-tag {
          color: #dcebe6;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .studio-tag span {
          color: var(--primary-green);
          margin: 0 0.3em;
        }
        .header-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }
        .header-actions :global(.talk-button) {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
        }
        .talk-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-green);
          color: #03140f;
          box-shadow: 0 0 18px rgba(62, 240, 168, 0.5);
        }
        .desktop-nav {
          position: fixed;
          top: 104px;
          left: 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 8px;
          border-radius: 28px;
          border: 1px solid rgba(62, 240, 168, 0.22);
          background: rgba(8, 24, 21, 0.78);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 18px 40px -20px rgba(0, 0, 0, 0.9);
        }
        .desktop-nav :global(.rail-link) {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 72px;
          padding: 9px 4px;
          border-radius: 16px;
          color: #e6f5ef;
          font-size: 0.74rem;
          text-decoration: none;
        }
        .desktop-nav :global(.rail-link:hover) {
          color: var(--primary-green);
        }
        .desktop-nav :global(.rail-link.is-active) {
          color: var(--primary-green);
          background: rgba(62, 240, 168, 0.08);
        }
        /* Glowing dot beside the current page, as in the mockup. */
        .desktop-nav :global(.rail-link.is-active)::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 6px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--primary-green);
          box-shadow: 0 0 8px var(--primary-green);
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
          .desktop-nav, .studio-tag {
            display: none !important;
          }
          .header-row {
            grid-template-columns: 1fr auto;
            padding: 0 18px;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        @media (max-width: 480px) {
          .header-actions :global(.talk-button) {
            font-size: 0;
            gap: 0;
          }
        }
      `}</style>
    </header>
  );
}
