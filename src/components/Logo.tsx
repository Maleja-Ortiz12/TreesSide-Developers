import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  // Dimensions
  const getDims = () => {
    switch (size) {
      case 'sm':
        return { width: 36, height: 36, textClass: 'text-lg' };
      case 'md':
        return { width: 44, height: 44, textClass: 'text-xl' };
      case 'lg':
        return { width: 72, height: 72, textClass: 'text-2xl' };
      case 'hero':
        return { width: 340, height: 340, textClass: 'text-3xl' };
      default:
        return { width: 44, height: 44, textClass: 'text-xl' };
    }
  };

  const { width, height } = getDims();

  if (size === 'hero') {
    return (
      <div className={`logo-hero-container ${className}`} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Ambient neon backdrop glow */}
        <div className="glow-pulse" style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 160, 0.28) 0%, rgba(0, 210, 255, 0.18) 45%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
          animationDuration: '5s'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 160, 0.25)',
          border: '1px solid rgba(0, 245, 160, 0.25)'
        }}>
          <Image
            src="/images/treesside-logo.jpg"
            alt="TreesSide Developers Cyber Tree Logo"
            width={width}
            height={height}
            priority
            style={{
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`brand-logo ${className}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none'
    }}>
      <div style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 245, 160, 0.3)',
        boxShadow: '0 0 14px rgba(0, 245, 160, 0.3)',
        flexShrink: 0
      }}>
        <Image
          src="/images/treesside-logo.jpg"
          alt="TreesSide Developers Logo"
          width={width}
          height={height}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {showText && (
        <span style={{
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.6rem' : '1.35rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          lineHeight: 1.15,
          userSelect: 'none'
        }}>
          <span style={{ color: 'var(--primary-green)' }}>TreesSide</span>
          <span style={{
            color: 'var(--primary-cyan)',
            fontSize: size === 'lg' ? '0.75rem' : '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            marginTop: '4px'
          }}>Developers</span>
        </span>
      )}
    </div>
  );
}
