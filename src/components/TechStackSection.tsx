'use client';

import React from 'react';
import Image from 'next/image';
import { TECHNOLOGIES } from '@/data/content';
import { TechLogo } from './TechLogos';
import { Mail } from 'lucide-react';

export function TechStackSection() {
  const tilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${(-y * 18).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(x * 18).toFixed(2)}deg`);
  };

  const resetTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      padding: '40px 0 90px',
      position: 'relative'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <h2 className="section-title">
            Tecnologías que <span className="text-gradient">usamos</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Trabajamos con herramientas modernas y confiables.
          </p>
        </div>

        {/* 12 Tech Cards Grid (6 columns x 2 rows on desktop) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          marginBottom: '70px'
        }} className="tech-grid">
          {TECHNOLOGIES.map((tech, index) => (
            <div
              key={tech.name}
              data-tech={tech.name}
              className="glass-card tech-card-3d"
              onMouseMove={tilt}
              onMouseLeave={resetTilt}
              style={{
                '--tech-color': tech.color,
                '--orbit-delay': `${(index % 6) * -0.6}s`,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                textAlign: 'center',
                cursor: 'default'
              } as React.CSSProperties}
            >
              <div className="tech-icon-stage" aria-hidden="true">
                <span className="tech-icon-halo" />
                <div className="tech-icon-wrap">
                  <TechLogo name={tech.name} />
                </div>
              </div>

              <div>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  display: 'block'
                }}>
                  {tech.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  display: 'block',
                  marginTop: '2px'
                }}>
                  {tech.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA 2: ¿Listo para comenzar? */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(12, 22, 38, 0.9) 0%, rgba(7, 13, 23, 0.95) 100%)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
          borderRadius: '18px',
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 245, 160, 0.05)'
        }}>
          {/* Ambient Glow */}
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(0, 245, 160, 0.22) 0%, transparent 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }} />

          {/* Left Text and CTA Button */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '6px'
            }}>
              ¿Listo para comenzar?
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              marginBottom: '20px'
            }}>
              Tu idea, nuestro código. Hagamos algo grande.
            </p>

            <button
              onClick={scrollToContact}
              className="btn btn-primary"
              style={{
                borderRadius: '8px',
                padding: '12px 26px',
                fontSize: '0.95rem'
              }}
            >
              <Mail size={18} />
              Contáctanos
            </button>
          </div>

          {/* Right: Cyber Tree Logo Graphic */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 245, 160, 0.35)',
              boxShadow: '0 0 25px rgba(0, 245, 160, 0.35)'
            }}>
              <Image
                src="/images/treesside-logo.jpg"
                alt="Cyber Tree TreesSide Developers"
                width={100}
                height={100}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tech-card-3d {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transform-style: preserve-3d;
          transition: transform 0.2s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .tech-card-3d:hover {
          border-color: var(--tech-color);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45), 0 0 22px color-mix(in srgb, var(--tech-color) 35%, transparent);
        }
        .tech-icon-stage {
          position: relative;
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          perspective: 400px;
          transform-style: preserve-3d;
          transform: translateZ(30px);
        }
        .tech-icon-halo {
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--tech-color) 45%, transparent) 0%, transparent 70%);
          filter: blur(8px);
          transform: translateZ(-20px);
          opacity: 0.55;
          transition: opacity 0.3s ease;
        }
        .tech-card-3d:hover .tech-icon-halo {
          opacity: 1;
        }
        .tech-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.55));
          animation: tech-orbit 6s ease-in-out infinite;
          animation-delay: var(--orbit-delay);
        }
        .tech-card-3d:hover .tech-icon-wrap {
          animation: tech-spin 1.1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes tech-orbit {
          0%, 100% { transform: translateY(0) rotateY(-22deg) rotateX(8deg); }
          50% { transform: translateY(-6px) rotateY(22deg) rotateX(-8deg); }
        }
        @keyframes tech-spin {
          from { transform: translateZ(10px) rotateY(0deg) scale(1.15); }
          to { transform: translateZ(10px) rotateY(360deg) scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tech-card-3d {
            transform: none;
            transition: none;
          }
          .tech-icon-wrap,
          .tech-card-3d:hover .tech-icon-wrap {
            animation: none;
          }
        }
        @media (max-width: 990px) {
          .tech-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .tech-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 440px) {
          .tech-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
