'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FEATURED_PROJECTS, Project } from '@/data/content';
import { ProjectModal } from './ProjectModal';
import { ProjectSpotlight } from './ProjectSpotlight';
import { ArrowRight, Mail } from 'lucide-react';

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const TEAM_FILTER = 'Proyectos del equipo';
  const EXPERIENCE_FILTER = 'Experiencia laboral';
  const categories = [...new Set(['Todos', TEAM_FILTER, EXPERIENCE_FILTER, ...FEATURED_PROJECTS.map(project => project.category)])];

  const filteredProjects = FEATURED_PROJECTS.filter(p => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === TEAM_FILTER) return !p.experience;
    if (activeFilter === EXPERIENCE_FILTER) return Boolean(p.experience);
    return p.category === activeFilter;
  });

  const router = useRouter();
  const goToContact = () => router.push('/contacto');

  return (
    <section id="proyectos" style={{
      padding: '90px 0 60px',
      position: 'relative'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <h2 className="section-title">
              Proyectos <span className="text-gradient">Destacados</span>
            </h2>
            <p className="section-subtitle">
              Catálogo de TreesSide y proyectos personales de sus integrantes. Cada proyecto del equipo conserva su autoría y su fuente.
            </p>
          </div>

          <button
            onClick={() => setActiveFilter('Todos')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-cyan)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'gap 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.gap = '10px'}
            onMouseLeave={(e) => e.currentTarget.style.gap = '6px'}
          >
            Ver todos
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '36px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              style={{
                background: activeFilter === cat ? 'rgba(0, 245, 160, 0.15)' : 'rgba(12, 22, 38, 0.6)',
                border: activeFilter === cat ? '1px solid var(--primary-green)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeFilter === cat ? 'var(--primary-green)' : 'var(--text-muted)',
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeFilter === cat ? '0 0 12px rgba(0, 245, 160, 0.2)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <ProjectSpotlight key={`spotlight-${activeFilter}`} projects={filteredProjects} onOpen={setSelectedProject} suspended={selectedProject !== null} />

        {/* Project Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '60px'
        }} className="projects-grid" key={`grid-${activeFilter}`}>
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              data-project={project.id}
              className="glass-card project-card"
              style={{
                animationDelay: `${Math.min(index, 8) * 55}ms`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Card Image Thumbnail */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '210px',
                overflow: 'hidden'
              }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    objectFit: project.imageFit ?? 'cover',
                    background: '#0b1220',
                    transition: 'transform 0.5s ease'
                  }}
                  className="project-thumb"
                />
                
                {/* Tech tag pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '14px',
                  background: 'rgba(7, 13, 23, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 210, 255, 0.4)',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--primary-cyan)',
                  letterSpacing: '0.3px'
                }}>
                  {project.tag}
                </div>
              </div>
              {project.imageLabel && <p style={{ padding: '8px 16px', fontSize: '.72rem', color: 'var(--text-muted)' }}>{project.imageLabel}</p>}

              {/* Card Body */}
              <div style={{
                padding: '20px 22px 24px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    {project.title}
                  </h3>
                  {project.owner && <p style={{ fontSize: '.8rem', color: project.experience ? 'var(--primary-cyan)' : 'var(--primary-green)', marginBottom: 10 }}>
                    {`${project.experience ? 'Experiencia laboral' : 'Proyecto del equipo'} · ${project.owner}`}
                  </p>}
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.55,
                    marginBottom: '18px'
                  }}>
                    {project.description}
                  </p>
                </div>

                {/* Link trigger */}
                {project.authors && <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {project.authors.map(author => (
                    <a key={author.portfolio} href={author.portfolio} target="_blank" rel="noopener noreferrer"
                      aria-label={`Ver portafolio de ${author.name} (abre en otra pestaña)`}
                      onClick={event => event.stopPropagation()}
                      style={{ color: 'var(--primary-cyan)', fontSize: '.85rem' }}>
                      {project.authors!.length > 1 ? `Portafolio de ${author.name}` : 'Ver portafolio del autor'}
                    </a>
                  ))}
                </div>}
                <button type="button" aria-label={`Ver proyecto ${project.title}`} style={{
                  background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left',
                  color: 'var(--primary-cyan)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: 'auto'
                }}>
                  Ver proyecto
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner (from Mockup Panel 1) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(12, 22, 38, 0.85) 0%, rgba(7, 13, 23, 0.95) 100%)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
          borderRadius: '18px',
          padding: '24px 36px',
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
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(0, 245, 160, 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }} />

          {/* Left: Cyber Tree Graphic & Callout Text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '16px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid rgba(0, 245, 160, 0.35)',
              boxShadow: '0 0 20px rgba(0, 245, 160, 0.3)'
            }}>
              <Image
                src="/images/treesside-logo.jpg"
                alt="Cyber Tree TreesSide Developers"
                width={84}
                height={84}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>

            <div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '4px'
              }}>
                ¿Tienes un proyecto <span className="text-gradient">en mente?</span>
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Hablemos y hagamos que suceda.
              </p>
            </div>
          </div>

          {/* Right: Contact Button */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link
              href="/contacto"
              className="btn btn-secondary"
              style={{
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '0.95rem'
              }}
            >
              <Mail size={18} />
              Contáctanos
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={goToContact}
      />

      <style jsx>{`
        .project-card {
          transition: transform 350ms ease, border-color 350ms ease, box-shadow 350ms ease;
          animation: project-arrive 500ms ease backwards;
        }
        .project-card:hover, .project-card:focus-within {
          transform: translateY(-7px);
          border-color: var(--primary-cyan);
          box-shadow: 0 22px 45px -18px rgba(0, 210, 255, 0.3);
        }
        .glass-card:hover .project-thumb {
          transform: scale(1.05);
        }
        @keyframes project-arrive {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-card { animation: none; transition: none; }
          .project-card:hover, .project-card:focus-within, .glass-card:hover .project-thumb { transform: none; }
          .project-thumb { transition: none !important; }
        }
        @media (max-width: 960px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
