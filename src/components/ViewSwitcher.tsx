'use client';

import React from 'react';
import { LayoutGrid, Layers, Monitor, Phone } from 'lucide-react';

export type ViewMode = 'all' | 'col1' | 'col2' | 'col3';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'all', label: 'Página Completa', icon: 'all' },
    { id: 'col1', label: '1. Inicio & Proyectos', icon: '1' },
    { id: 'col2', label: '2. Servicios & Tech', icon: '2' },
    { id: 'col3', label: '3. Nosotros & Contacto', icon: '3' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 90,
      background: 'rgba(7, 13, 23, 0.9)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 245, 160, 0.3)',
      borderRadius: '999px',
      padding: '5px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 245, 160, 0.15)'
    }}>
      {views.map((v) => {
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            onClick={() => {
              onViewChange(v.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: isActive
                ? 'linear-gradient(135deg, var(--primary-green), var(--primary-cyan))'
                : 'transparent',
              color: isActive ? '#050c14' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              padding: '7px 14px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
