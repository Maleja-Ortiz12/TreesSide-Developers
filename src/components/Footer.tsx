'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { CONTACT_INFO } from '@/data/content';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

export function Footer() {
  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Casos de éxito', href: '/casos' },
    { label: 'Sobre Nosotros', href: '/nosotros' },
    { label: 'Equipo', href: '/equipo' },
    { label: 'Contacto', href: '/contacto' }
  ];

  return (
    <footer style={{
      background: 'rgba(4, 8, 16, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '60px',
      paddingBottom: '30px',
      position: 'relative'
    }}>
      <div className="container">
        {/* Top Footer Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: '40px',
          alignItems: 'start',
          marginBottom: '50px'
        }} className="footer-grid">
          {/* Col 1: Brand Logo & Mission */}
          <div>
            <Logo size="md" showText={true} />
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginTop: '16px',
              maxWidth: '320px'
            }}>
              Desarrollamos soluciones de software a medida con tecnologías modernas y enfoque en calidad y escalabilidad.
            </p>
          </div>

          {/* Col 2: Enlaces rápidos */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Enlaces rápidos
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      background: 'none',
                      border: 'none',
                      textDecoration: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-green)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Contacto
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        </div>

        {/* Bottom Bar: Copyright & Slogan */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            © 2025 TreesSide Developers. Todos los derechos reservados. ·{' '}
            <Link href="/politica-de-datos" style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'underline' }}>
              Política de datos
            </Link>
          </p>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--primary-cyan)',
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}>
            Código que construye futuro
          </p>
        </div>
      </div>

      <style jsx>{`
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
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
