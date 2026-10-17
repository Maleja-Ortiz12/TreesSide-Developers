'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Menu, X, Send } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

export function Navbar({ activeSection = 'inicio' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section spy
      const sections = ['inicio', 'servicios', 'proyectos', 'sobre-nosotros', 'contacto'];
      const scrollPos = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio', id: 'inicio' },
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Proyectos', href: '#proyectos', id: 'proyectos' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros', id: 'sobre-nosotros' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(7, 13, 23, 0.92)' : 'rgba(7, 13, 23, 0.75)',
      backdropFilter: 'blur(16px)',
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
        <Link href="#inicio" onClick={() => handleNavClick('#inicio')} style={{ textDecoration: 'none' }}>
          <Logo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }} className="desktop-nav">
          {navLinks.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
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
              </a>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contacto');
            }}
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
          </a>

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
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              style={{
                color: currentSection === item.id ? 'var(--primary-green)' : '#ffffff',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contacto');
            }}
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
          >
            <Send size={18} />
            Contacto
          </a>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 820px) {
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
