'use client';

import React from 'react';
import { PROCESS_STEPS } from '@/data/content';
import { ArrowRight } from 'lucide-react';

export function ProcessSection() {
  return (
    <section id="proceso" style={{
      padding: '70px 0 90px',
      position: 'relative'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 className="section-title">
            Nuestro <span className="text-gradient">Proceso</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Convertimos tus ideas en productos digitales en 4 pasos.
          </p>
        </div>

        {/* 4 Process Steps with Connectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          position: 'relative'
        }} className="process-grid">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="glass-card"
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Arrow Connector on desktop (except last item) */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div
                  className="step-arrow"
                  style={{
                    position: 'absolute',
                    right: '-18px',
                    top: '46px',
                    zIndex: 5,
                    color: 'var(--primary-cyan)',
                    opacity: 0.7
                  }}
                >
                  <ArrowRight size={22} />
                </div>
              )}

              {/* Number Circle */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '2px solid var(--primary-green)',
                background: 'rgba(0, 245, 160, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--primary-green)',
                boxShadow: '0 0 16px rgba(0, 245, 160, 0.3)',
                marginBottom: '20px'
              }}>
                {step.step}
              </div>

              {/* Title & Desc */}
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '10px'
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .step-arrow {
            display: none !important;
          }
        }
        @media (max-width: 540px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
