'use client';

import React from 'react';
import Image from 'next/image';
import { VALUE_PILLARS } from '@/data/content';
import { Sparkles, Users, Code2, Target } from 'lucide-react';

export function AboutSection() {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles size={28} color="var(--primary-green)" />;
      case 'users':
        return <Users size={28} color="var(--primary-green)" />;
      case 'check-circle':
        return <Code2 size={28} color="var(--primary-green)" />;
      case 'target':
        return <Target size={28} color="var(--primary-green)" />;
      default:
        return <Sparkles size={28} color="var(--primary-green)" />;
    }
  };

  return (
    <section id="sobre-nosotros" style={{
      padding: '100px 0 70px',
      position: 'relative'
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(0, 245, 160, 0.08) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Split: Text & Glowing Cyber Tree Logo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '60px',
          alignItems: 'center',
          marginBottom: '60px'
        }} className="about-hero-grid">
          <div>
            <div className="kicker">
              SOBRE NOSOTROS
            </div>

            <h2 className="section-title" style={{ marginBottom: '22px' }}>
              Pasión por el código,{' '}
              <span className="text-gradient">compromiso con tus ideas</span>
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              maxWidth: '560px'
            }}>
              Somos un equipo de desarrolladores que cree en el poder de la tecnología para crear un impacto real. En <strong style={{ color: '#ffffff' }}>SoftZenkodoDevs</strong> combinamos experiencia, aprendizaje constante y trabajo en equipo para ofrecer soluciones innovadoras y eficientes.
            </p>
          </div>

          {/* Right Visual: Glowing Cyber Tree Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              padding: '12px',
              background: 'linear-gradient(145deg, rgba(12, 22, 38, 0.95), rgba(7, 13, 23, 0.9))',
              border: '1px solid rgba(0, 245, 160, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 245, 160, 0.2)',
              maxWidth: '300px',
              width: '100%'
            }} className="animate-float">
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                position: 'relative'
              }}>
                <Image
                  src="/images/logo.jpg"
                  alt="SoftZenkodoDevs Cyber Tree Logo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: '12px', paddingBottom: '4px' }}>
                <span style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ffffff' }}>Soft</span>
                  <span style={{ color: 'var(--primary-green)' }}>Zenko</span>
                  <span style={{ color: 'var(--primary-cyan)' }}>doDevs</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Value Pillars Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }} className="pillars-grid">
          {VALUE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(0, 245, 160, 0.08)',
                border: '1px solid rgba(0, 245, 160, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 245, 160, 0.15)'
              }}>
                {getPillarIcon(pillar.iconName)}
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '8px'
                }}>
                  {pillar.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}>
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .kicker {
            justify-content: center;
          }
          .about-hero-grid p {
            margin: 0 auto;
          }
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
