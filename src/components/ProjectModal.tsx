'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/data/content';
import { X, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onContactClick: () => void;
}

export function ProjectModal({ project, onClose, onContactClick }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg, #0d1724, #070d17)',
        border: '1px solid rgba(0, 245, 160, 0.3)',
        borderRadius: '20px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 245, 160, 0.15)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 245, 160, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          <X size={20} />
        </button>

        {/* Modal Image Header */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #0d1724 5%, transparent 60%)'
          }} />

          {/* Tech Tag Badge */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '24px',
            background: 'rgba(7, 13, 23, 0.85)',
            border: '1px solid var(--primary-cyan)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary-cyan)',
            boxShadow: '0 0 12px rgba(0, 210, 255, 0.3)'
          }}>
            {project.tag}
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px 30px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              {project.title}
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary-green)', fontWeight: 600 }}>
              {project.category}
            </span>
          </div>

          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginTop: '14px',
            marginBottom: '20px'
          }}>
            {project.detailedDescription || project.description}
          </p>

          {project.imageLabel && <p style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{project.imageLabel}</p>}
          {project.owner && <p style={{ color: 'var(--primary-green)', marginTop: 12 }}>Proyecto personal del equipo · {project.owner}</p>}

          {/* Key Features */}
          {project.features && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Características Clave:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {project.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={18} color="var(--primary-green)" style={{ flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{project.owner ? 'Autor' : 'Cliente'}</span>
              <p style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{project.owner || project.client || 'Confidencial'}</p>
            </div>
            <div>
              {project.portfolioUrl ? <>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Fuente</span>
                <p><a href={project.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-cyan)' }}>Portafolio del autor <ExternalLink size={14} aria-hidden="true" /></a></p>
              </> : <>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Año de Desarrollo</span>
                <p style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{project.year || '2024'}</p>
              </>}
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ marginTop: '28px', display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onContactClick();
              }}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              Quiero un proyecto similar
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
