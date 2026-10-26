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
    <header className="site-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(7, 13, 23, 0.92)' : 'rgba(7, 13, 23, 0.75)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <Link href="/" aria-label="TreesSide Developers, ir al inicio" style={{ textDecoration: 'none' }}>
          <Logo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }} className="desktop-nav">
          {NAV_LINKS.map((item) => {
            const isActive = isCurrent(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  position: 'relative',
                  padding: '8px 0',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {item.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, var(--primary-green), var(--primary-cyan))',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px var(--primary-green)'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/contacto"
            aria-current={isCurrent('/contacto') ? 'page' : undefined}
            className="btn-outline-pill desktop-nav-btn"
            style={{
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Contacto
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={26} color="var(--primary-green)" /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(7, 13, 23, 0.98)',
          borderBottom: '1px solid var(--border-card)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              style={{
                color: isCurrent(item.href) ? 'var(--primary-green)' : '#ffffff',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
          >
            <Send size={18} />
            Contacto
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1060px) {
          .desktop-nav,
          .desktop-nav-btn {
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
