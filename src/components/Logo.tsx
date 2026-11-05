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
          background: 'radial-gradient(circle, rgba(62, 240, 168, 0.28) 0%, rgba(46, 230, 197, 0.18) 45%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
          animationDuration: '5s'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(62, 240, 168, 0.25)',
          border: '1px solid rgba(62, 240, 168, 0.25)'
        }}>
          <Image
            src="/images/treesside-logo.webp"
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
        flexShrink: 0,
        // The tree mark has a transparent background, so it sits directly on the header like the brand artwork.
        filter: 'drop-shadow(0 0 8px rgba(62, 240, 168, 0.35))'
      }}>
        <Image
          src="/images/treesside-logo.webp"
          alt="TreesSide Developers Logo"
          width={width}
          height={height}
          style={{
            objectFit: 'contain',
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
          <span style={{ color: '#ffffff', textShadow: '0 0 18px rgba(62, 240, 168, 0.25)' }}>TreesSide</span>
          {/* Matches the updated logo: spaced green capitals under the white name. */}
          <span style={{
            color: '#82cb8c',
            fontSize: size === 'lg' ? '0.75rem' : '0.66rem',
            fontWeight: 600,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            marginTop: '4px'
          }}>Developers</span>
        </span>
      )}
    </div>
  );
}
