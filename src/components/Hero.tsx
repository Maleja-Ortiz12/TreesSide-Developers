'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QUICK_FEATURES, FEATURED_PROJECTS, TECHNOLOGIES } from '@/data/content';
import { TEAM_MEMBERS } from '@/data/team';
import { Eye, Mail, Code, Database, Cloud, Cpu, ArrowRight } from 'lucide-react';

export function Hero() {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code size={24} color="var(--primary-cyan)" />;
      case 'database':
        return <Database size={24} color="var(--primary-cyan)" />;
      case 'cloud':
        return <Cloud size={24} color="var(--primary-cyan)" />;
      case 'cpu':
        return <Cpu size={24} color="var(--primary-cyan)" />;
      default:
        return <Code size={24} color="var(--primary-cyan)" />;
    }
  };

  const tilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${(-y * 12).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(x * 12).toFixed(2)}deg`);
  };

  const resetTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const stats = [
    { value: FEATURED_PROJECTS.length, label: 'proyectos' },
    { value: TECHNOLOGIES.length, label: 'tecnologías' },
    { value: TEAM_MEMBERS.length, label: 'desarrolladores' },
  ];

  return (
    <section id="inicio" style={{
      position: 'relative',
      paddingTop: '140px',
      paddingBottom: '80px',
      overflow: 'hidden'
    }}>
      {/* Background ambient radial lighting */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 245, 160, 0.12) 0%, rgba(0, 210, 255, 0.08) 50%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Hero Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.9fr',
          gap: '60px',
          alignItems: 'center',
          marginBottom: '80px'
        }} className="hero-grid">
          {/* Left Column: Headlines & CTA */}
          <div>
            {/* Kicker badge */}
            <div className="kicker">
              <span>IDEAS</span>
              <span style={{ opacity: 0.6 }}>&gt;</span>
              <span>CÓDIGO</span>
              <span style={{ opacity: 0.6 }}>&gt;</span>
              <span>SOLUCIONES</span>
            </div>

            <h1 className="section-title" style={{
              fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
              marginBottom: '22px'
            }}>
              Transformamos{' '}
              <span className="text-gradient">ideas en soluciones</span>{' '}
              digitales
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              En <strong style={{ color: '#ffffff', fontWeight: 600 }}>TreesSide Developers</strong> desarrollamos software a medida,
              combinando creatividad, tecnología y buenas prácticas para llevar tus proyectos al siguiente nivel.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center'
            }}>
              <Link
                href="/proyectos"
                className="btn btn-primary"
                style={{
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderRadius: '10px'
                }}
              >
                <Eye size={20} />
                Ver nuestros proyectos
              </Link>

              <Link
                href="/contacto"
                className="btn btn-secondary"
                style={{
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderRadius: '10px'
                }}
              >
                <Mail size={19} />
                Contáctanos
              </Link>
            </div>
          </div>

          {/* Right Column: Glowing Cyber Tree Logo Graphic */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Glowing neon pulse circle */}
            <div className="glow-pulse" style={{
              position: 'absolute',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 245, 160, 0.22) 0%, rgba(0, 210, 255, 0.14) 40%, transparent 70%)',
              filter: 'blur(50px)',
              zIndex: 0,
              animationDuration: '6s'
            }} />

            {/* Brand card with neon border and 3D tilt */}
            <div className="animate-float" style={{ position: 'relative', zIndex: 1 }}>
            <div
              data-brand-card
              className="brand-card"
              onMouseMove={tilt}
              onMouseLeave={resetTilt}
              style={{
                position: 'relative',
                borderRadius: '24px',
                padding: '12px',
                background: 'linear-gradient(145deg, rgba(12, 22, 38, 0.95), rgba(7, 13, 23, 0.9))',
                border: '1px solid rgba(0, 245, 160, 0.25)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 245, 160, 0.2)'
              } as React.CSSProperties}
            >
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                width: '320px',
                height: '320px'
              }}>
                <Image
                  src="/images/treesside-logo.webp"
                  alt="TreesSide Developers Cyber Tree Logo"
                  width={320}
                  height={320}
                  priority
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>

              {/* Brand name, subtitle and tagline */}
              <div style={{ marginTop: '16px', textAlign: 'center', transform: 'translateZ(30px)' }}>
                <span style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  lineHeight: 1.1
                }}>
                  <span style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary-green)', textShadow: '0 0 18px rgba(0, 245, 160, 0.35)' }}>TreesSide</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.32em', color: 'var(--primary-cyan)', marginTop: '6px', textTransform: 'uppercase' }}>Developers</span>
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
                  Código que construye futuro
                </p>
              </div>

              {/* Real catalog figures */}
              <ul style={{
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                margin: '14px 4px 4px',
                transform: 'translateZ(20px)'
              }}>
                {stats.map(stat => (
                  <li key={stat.label} style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    background: 'rgba(0, 210, 255, 0.06)',
                    border: '1px solid rgba(0, 210, 255, 0.2)',
                    textAlign: 'center'
                  }}>
                    <strong aria-hidden="true" style={{ display: 'block', fontSize: '1.15rem', color: '#ffffff' }}>{stat.value}</strong>
                    <span aria-hidden="true" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                    <span className="sr-stat">{`${stat.value} ${stat.label}`}</span>
                  </li>
                ))}
              </ul>
              <span data-brand-card-end hidden />
            </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Row (Desarrollo Web, Bases de Datos, Soluciones Cloud, Apps a Medida) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }} className="quick-features-grid">
          {QUICK_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(0, 210, 255, 0.2)'
              }}>
                {getFeatureIcon(feat.icon)}
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  {feat.title}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px !important;
          }
          .kicker {
            justify-content: center;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid div:has(.btn) {
            justify-content: center;
          }
          .quick-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .brand-card {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transform-style: preserve-3d;
          transition: transform 0.2s ease-out, box-shadow 0.3s ease;
        }
        .brand-card:hover {
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 245, 160, 0.35) !important;
        }
        .sr-stat {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-card {
            transform: none;
            transition: none;
          }
        }
        @media (max-width: 600px) {
          .quick-features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
