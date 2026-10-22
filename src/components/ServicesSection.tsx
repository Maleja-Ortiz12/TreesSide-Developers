'use client';

import React from 'react';
import Image from 'next/image';
import { SERVICES } from '@/data/content';
import {
  Code,
  Database,
  Cloud,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Check
} from 'lucide-react';

export function ServicesSection() {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code size={24} color="var(--primary-cyan)" />;
      case 'database':
        return <Database size={24} color="var(--primary-cyan)" />;
      case 'cloud':
        return <Cloud size={24} color="var(--primary-cyan)" />;
      case 'smartphone':
        return <Smartphone size={24} color="var(--primary-cyan)" />;
      case 'bar-chart':
        return <BarChart3 size={24} color="var(--primary-cyan)" />;
      case 'shield':
        return <ShieldCheck size={24} color="var(--primary-cyan)" />;
      default:
        return <Code size={24} color="var(--primary-cyan)" />;
    }
  };

  return (
    <section id="servicios" style={{
      padding: '100px 0 80px',
      position: 'relative'
    }}>
      {/* Background ambient light */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Services Hero Row: Title & 3D Laptop illustration */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '50px',
          alignItems: 'center',
          marginBottom: '60px'
        }} className="services-hero-grid">
          <div>
            <div className="kicker">
              NUESTROS SERVICIOS
            </div>
            
            <h2 className="section-title" style={{ marginBottom: '20px' }}>
              Soluciones tecnológicas{' '}
              <span className="text-gradient">para tus ideas</span>
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: '560px'
            }}>
              Te acompañamos en todo el proceso de desarrollo, desde la idea hasta la implementación y mantenimiento, con enfoque en calidad, rendimiento y escalabilidad.
            </p>
          </div>

          {/* Right Visual: 3D Laptop with cyber code & cloud glow */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 210, 255, 0.25)',
              maxWidth: '440px',
              width: '100%',
              aspectRatio: '4 / 3'
            }} className="animate-float">
              <Image
                src="/images/services-laptop.jpg"
                alt="Servicios Tecnológicos TreesSide Developers"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* 6 Detailed Service Cards (2 cols x 3 rows) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }} className="services-grid">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="glass-card"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Icon badge */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 210, 255, 0.2)'
              }}>
                {getServiceIcon(srv.iconName)}
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '14px'
                }}>
                  {srv.title}
                </h3>

                {/* Bullets */}
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {srv.items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span style={{
                        color: 'var(--primary-green)',
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        fontWeight: 700
                      }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 990px) {
          .services-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .kicker {
            justify-content: center;
          }
          .services-hero-grid p {
            margin: 0 auto;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
