'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PURPOSE_PILLARS } from '@/data/content';
import { TEAM_MEMBERS } from '@/data/team';
import { Sparkles, Globe2, Workflow, Lightbulb, Building2, Heart, ArrowUpRight } from 'lucide-react';

export function AboutSection() {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe':
        return <Globe2 size={28} color="var(--primary-green)" />;
      case 'workflow':
        return <Workflow size={28} color="var(--primary-green)" />;
      case 'lightbulb':
        return <Lightbulb size={28} color="var(--primary-green)" />;
      case 'building':
        return <Building2 size={28} color="var(--primary-green)" />;
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
              Tecnología al alcance de todos,{' '}
              <span className="text-gradient">sin fronteras para crecer</span>
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              maxWidth: '560px'
            }}>
              En <strong style={{ color: '#ffffff' }}>TreesSide Developers</strong> creamos software que esté al alcance de todos y que ayude a automatizar los procesos manuales repetitivos. Queremos innovar y acompañar desde microempresas y pequeños emprendimientos hasta grandes empresas, para que Colombia sea un país más tecnológico y productivo. Queremos llegar a mercados extranjeros, conectar con nuevas necesidades y seguir innovando y creciendo junto a empresas de otros países.
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
                  src="/images/treesside-logo.jpg"
                  alt="TreesSide Developers Cyber Tree Logo"
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
                  <span style={{ color: 'var(--primary-green)' }}>TreesSide</span>
                  <span style={{ color: 'var(--primary-cyan)', marginLeft: '6px' }}>Developers</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Objective pillars */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px', textAlign: 'center' }}>
          Nuestro objetivo
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }} className="pillars-grid">
          {PURPOSE_PILLARS.map((pillar, idx) => (
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

        {/* Belief statement */}
        <div style={{
          margin: '44px auto 0',
          maxWidth: '820px',
          padding: '26px 30px',
          borderRadius: '18px',
          border: '1px solid rgba(0, 245, 160, 0.25)',
          background: 'linear-gradient(135deg, rgba(12, 22, 38, 0.85), rgba(7, 13, 23, 0.95))',
          display: 'flex',
          gap: '18px',
          alignItems: 'center'
        }} className="belief-card">
          <Sparkles size={34} color="var(--primary-cyan)" aria-hidden="true" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '1.08rem', color: '#e2e8f0', lineHeight: 1.65 }}>
            Desde Colombia, con visión global. Creemos que la tecnología y la innovación son herramientas para crecer como país. Nuestro compromiso empieza aquí y nuestra visión va más allá: crear soluciones que aporten valor tanto en Colombia como en mercados internacionales.
          </p>
        </div>

        {/* What each member is passionate about */}
        <div id="lo-que-nos-apasiona" style={{ marginTop: '64px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px', textAlign: 'center' }}>
            Lo que nos apasiona
          </h3>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '26px' }}>
            Cada integrante aporta su propia pasión al equipo.{' '}
            <Link href="/equipo" style={{ color: 'var(--primary-cyan)' }}>
              Conoce sus perfiles completos <ArrowUpRight size={15} aria-hidden="true" style={{ verticalAlign: 'middle' }} />
            </Link>
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="passions-grid">
            {TEAM_MEMBERS.map(member => (
              <li key={member.name} className="glass-card" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Heart size={24} color="var(--primary-green)" aria-hidden="true" />
                <div>
                  <strong style={{ display: 'block', color: '#ffffff', fontSize: '1.05rem' }}>{member.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>{member.role}</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{member.passion}</p>
              </li>
            ))}
          </ul>
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
          .passions-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
          .belief-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
