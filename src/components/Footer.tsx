'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { CONTACT_INFO } from '@/data/content';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Planes', href: '/planes' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Casos de éxito', href: '/casos' },
    { label: 'Sobre Nosotros', href: '/nosotros' },
    { label: 'Equipo', href: '/equipo' },
    { label: 'Contacto', href: '/contacto' }
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Mockup row: brand, a thin divider, then the page links in one line. */}
        <div className="footer-main">
          <Logo size="md" showText={true} />
          <span className="footer-divider" aria-hidden="true" />
          <nav aria-label="Enlaces rápidos" className="footer-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`footer-link${pathname === item.href ? ' is-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-info">
          <p className="footer-mission">
            Desarrollamos soluciones de software a medida con tecnologías modernas y enfoque en calidad y escalabilidad.
          </p>
          <ul className="footer-contact">
            <li>
              <a href={`mailto:${CONTACT_INFO.email}`} className="contact-link">
                <Mail size={16} aria-hidden="true" />{CONTACT_INFO.email}
              </a>
            </li>
            <li>
              <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                <MessageCircle size={16} aria-hidden="true" />WhatsApp {CONTACT_INFO.phone}
              </a>
            </li>
            <li>
              <span className="contact-link"><MapPin size={16} aria-hidden="true" />{CONTACT_INFO.location}</span>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            © 2025 TreesSide Developers. Todos los derechos reservados. ·{' '}
            <Link href="/politica-de-datos" style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'underline' }}>
              Política de datos
            </Link>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--primary-green)', fontWeight: 500, letterSpacing: '0.5px' }}>
            Código que construye futuro
          </p>
        </div>
      </div>

      <style jsx>{`
        footer {
          position: relative;
          padding: 44px 0 28px;
          background: linear-gradient(180deg, rgba(3, 11, 10, 0.6), rgba(3, 11, 10, 0.98));
          border-top: 1px solid rgba(62, 240, 168, 0.14);
          box-shadow: 0 -1px 0 rgba(62, 240, 168, 0.06), 0 -30px 60px -40px rgba(62, 240, 168, 0.25);
        }
        .footer-main {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .footer-divider {
          width: 1px;
          height: 44px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.25), transparent);
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 30px;
          flex: 1;
          justify-content: flex-end;
        }
        .footer-links :global(.footer-link) {
          color: #dcebe6;
          font-size: 0.92rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-links :global(.footer-link:hover),
        .footer-links :global(.footer-link.is-active) {
          color: var(--primary-green);
        }
        .footer-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px 40px;
          flex-wrap: wrap;
          margin: 32px 0 26px;
        }
        .footer-mission {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 380px;
        }
        .footer-contact {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 12px 28px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.9rem;
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: color 0.2s ease;
        }
        a.contact-link:hover, a.contact-link:focus-visible {
          color: var(--primary-green);
        }
        /* Room for the floating WhatsApp button so it never covers the last line. */
        @media (max-width: 600px) {
          footer {
            padding-bottom: 96px !important;
          }
        }
        @media (max-width: 768px) {
          .footer-divider {
            display: none;
          }
          .footer-links {
            justify-content: flex-start;
            flex-basis: 100%;
            gap: 10px 22px;
          }
        }
      `}</style>
    </footer>
  );
}
