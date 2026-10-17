'use client';

import React from 'react';
import { Logo } from './Logo';
import { CONTACT_INFO } from '@/data/content';
import { Github, Linkedin, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Inicio', id: 'inicio' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Proyectos', id: 'proyectos' },
    { label: 'Sobre Nosotros', id: 'sobre-nosotros' },
    { label: 'Contacto', id: 'contacto' }
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
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
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
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Síguenos (Social Networks) */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Síguenos
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={CONTACT_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="social-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Github size={18} />
              </a>

              <a
                href={CONTACT_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Linkedin size={18} />
              </a>

              <a
                href={CONTACT_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Youtube size={18} />
              </a>

              <a
                href={CONTACT_INFO.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="social-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Twitter size={18} />
              </a>
            </div>
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
            © 2025 SoftZenkodoDevs. Todos los derechos reservados.
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
        .social-btn:hover {
          background: rgba(0, 245, 160, 0.15) !important;
          border-color: var(--primary-green) !important;
          color: var(--primary-green) !important;
          box-shadow: 0 0 12px rgba(0, 245, 160, 0.3) !important;
          transform: translateY(-2px);
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
