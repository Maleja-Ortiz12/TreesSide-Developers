'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FEATURED_PROJECTS, Project } from '@/data/content';
import { ProjectModal } from './ProjectModal';
import { ProjectSpotlight } from './ProjectSpotlight';
import { ArrowRight } from 'lucide-react';

const WEB_CATEGORIES = ['Sitios web', 'Web & E-Commerce', 'Radio web', 'Marketplaces'];
const DATA_CATEGORIES = ['Análisis de datos'];

// The mockup filters by three broad groups; every real category falls in exactly one of them.
export function projectGroup(project: Project) {
  if (WEB_CATEGORIES.includes(project.category)) return 'Web';
  if (DATA_CATEGORIES.includes(project.category)) return 'Datos';
  return 'Aplicaciones';
}

const FILTERS = ['Todos', 'Web', 'Aplicaciones', 'Datos'];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProjects = FEATURED_PROJECTS.filter(p => activeFilter === 'Todos' || projectGroup(p) === activeFilter);

  const router = useRouter();
  const goToContact = () => router.push('/contacto');

  return (
    <section id="proyectos" className="projects-page">
      <div className="container">
        <header className="projects-hero">
          <div className="hero-copy">
            <span className="kicker">Proyectos</span>
            <h2 className="section-title">
              Proyectos <span className="text-gradient">Destacados</span>
            </h2>
            <p className="section-subtitle">
              Catálogo de TreesSide y proyectos personales de sus integrantes. Cada proyecto del equipo conserva su autoría y su fuente.
            </p>

            <div className="filters" role="group" aria-label="Filtrar proyectos">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`filter-pill${activeFilter === filter ? ' is-active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-tree" aria-hidden="true">
            <span className="tree-glow" />
            <Image src="/images/treesside-logo.webp" alt="" width={420} height={420} priority className="tree-image" />
          </div>
        </header>

        <span className="circuit-drop" aria-hidden="true" />

        <ProjectSpotlight key={`spotlight-${activeFilter}`} projects={filteredProjects} onOpen={setSelectedProject} suspended={selectedProject !== null} />

        <div className="projects-grid" key={`grid-${activeFilter}`}>
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              id={project.id}
              data-project={project.id}
              className="glass-card project-card"
              style={{
                // Home carousel links land here; the margin keeps the card clear of the 76px fixed header.
                scrollMarginTop: '100px',
                animationDelay: `${Math.min(index, 8) * 55}ms`,
              }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="card-copy">
                <h3 className="card-title">{project.title}</h3>
                <p className="card-group">{projectGroup(project)} · {project.category}</p>
                {project.owner && <p className={`card-owner${project.experience ? ' is-experience' : ''}`}>
                  {`${project.experience ? 'Experiencia laboral' : 'Proyecto del equipo'} · ${project.owner}`}
                </p>}
                <p className="card-description">{project.description}</p>

                {project.authors && <div className="card-authors">
                  {project.authors.map(author => (
                    <a key={author.portfolio} href={author.portfolio} target="_blank" rel="noopener noreferrer"
                      aria-label={`Ver portafolio de ${author.name} (abre en otra pestaña)`}
                      onClick={event => event.stopPropagation()}>
                      {project.authors!.length > 1 ? `Portafolio de ${author.name}` : 'Ver portafolio del autor'}
                    </a>
                  ))}
                </div>}
                <button type="button" aria-label={`Ver proyecto ${project.title}`} className="card-action">
                  Ver proyecto
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="card-media">
                <div className="card-screen">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 900px) 90vw, 280px"
                    style={{ objectFit: project.imageFit ?? 'cover' }}
                    className="project-thumb"
                  />
                  <span className="card-stack">{project.tag}</span>
                </div>
                {project.imageLabel && <p className="card-note">{project.imageLabel}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="projects-cta">
          <span className="cta-circuit cta-circuit-left" aria-hidden="true" />
          <span className="cta-circuit cta-circuit-right" aria-hidden="true" />
          <h3>
            ¿Tienes un proyecto <span className="text-gradient">en mente?</span>
          </h3>
          <p>Hablemos y hagamos que suceda.</p>
          <Link href="/contacto" className="btn btn-primary cta-button">
            Contáctanos
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={goToContact}
      />

      <style jsx>{`
        .projects-page {
          position: relative;
          padding: 40px 0 70px;
        }
        .projects-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
          align-items: center;
          gap: 32px;
        }
        .hero-copy .section-title {
          font-size: clamp(2.4rem, 5vw, 3.9rem);
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }
        .filter-pill {
          padding: 9px 24px;
          border-radius: 999px;
          border: 1px solid rgba(220, 245, 236, 0.35);
          background: rgba(5, 17, 15, 0.55);
          color: #e6f5ef;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
        }
        .filter-pill:hover {
          border-color: var(--primary-green);
          color: var(--primary-green);
        }
        .filter-pill.is-active {
          background: linear-gradient(135deg, #6ff7c4, var(--primary-green));
          border-color: transparent;
          color: #03140f;
          font-weight: 600;
          box-shadow: 0 0 18px rgba(62, 240, 168, 0.45);
        }
        .hero-tree {
          position: relative;
          justify-self: end;
          width: min(100%, 400px);
          aspect-ratio: 1;
          overflow: hidden;
        }
        .tree-glow {
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(62, 240, 168, 0.32), transparent 70%);
          filter: blur(30px);
        }
        .hero-tree :global(.tree-image) {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Zooms past the wordmark under the tree; the brand name is already in the header. */
          transform: scale(1.3);
          transform-origin: 50% 22%;
          /* Fades the square artwork into the page so only the glowing tree remains. */
          -webkit-mask-image: radial-gradient(circle at 50% 46%, #000 42%, transparent 70%);
          mask-image: radial-gradient(circle at 50% 46%, #000 42%, transparent 70%);
        }
        .circuit-drop {
          display: block;
          width: 2px;
          height: 46px;
          margin: 0 auto;
          background: linear-gradient(transparent, var(--primary-green));
          box-shadow: 0 0 10px rgba(62, 240, 168, 0.6);
          position: relative;
        }
        .circuit-drop::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -5px;
          width: 10px;
          height: 10px;
          translate: -50% 0;
          border-radius: 50%;
          background: #b9ffe4;
          box-shadow: 0 0 12px var(--primary-green);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 56px 28px;
          margin: 64px 0 90px;
        }
        .project-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: 20px;
          padding: 26px 22px 26px 26px;
          cursor: pointer;
          overflow: visible;
          transition: transform 350ms ease, border-color 350ms ease, box-shadow 350ms ease;
          animation: project-arrive 500ms ease backwards;
        }
        /* Circuit trace rising from each card into the gap above, ending in a glowing node. */
        .project-card::after {
          content: '';
          position: absolute;
          top: -56px;
          width: 2px;
          height: 56px;
          background: linear-gradient(rgba(62, 240, 168, 0.05), rgba(62, 240, 168, 0.75));
          box-shadow: 0 0 8px rgba(62, 240, 168, 0.45);
          pointer-events: none;
        }
        .project-card:nth-child(odd)::after {
          left: 72%;
        }
        .project-card:nth-child(even)::after {
          left: 28%;
        }
        /* The card a carousel link points to is already in place when the browser scrolls to it. */
        .project-card:target {
          animation: none;
        }
        .project-card:hover, .project-card:focus-within {
          transform: translateY(-6px);
          border-color: rgba(62, 240, 168, 0.55);
          box-shadow: 0 26px 50px -22px rgba(62, 240, 168, 0.35);
        }
        .card-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .card-title {
          font-size: clamp(1.35rem, 2.2vw, 1.75rem);
          font-weight: 700;
          line-height: 1.12;
          color: #ffffff;
          overflow-wrap: anywhere;
        }
        .card-group {
          margin-top: 8px;
          color: var(--primary-green);
          font-size: 0.95rem;
          font-weight: 500;
        }
        .card-owner {
          margin-top: 6px;
          color: #9fe9cd;
          font-size: 0.78rem;
        }
        .card-owner.is-experience {
          color: var(--primary-cyan);
        }
        .card-description {
          margin: 14px 0 16px;
          color: #d3e4de;
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .card-authors {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .card-authors a {
          color: var(--primary-cyan);
          font-size: 0.84rem;
        }
        .card-action {
          margin-top: auto;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 0 8px;
          border: 0;
          background: transparent;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
        }
        .card-action::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: calc(100% - 28px);
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--primary-green), rgba(62, 240, 168, 0.2));
          box-shadow: 0 0 8px rgba(62, 240, 168, 0.5);
        }
        .card-media {
          min-width: 0;
          align-self: center;
        }
        .card-screen {
          position: relative;
          aspect-ratio: 4 / 3.4;
          border-radius: 16px;
          overflow: hidden;
          background: #071613;
          border: 1px solid rgba(190, 255, 230, 0.22);
          box-shadow: 0 18px 40px -18px #000, 0 0 0 4px rgba(10, 28, 25, 0.9), 0 0 24px -6px rgba(62, 240, 168, 0.35);
        }
        .card-screen :global(.project-thumb) {
          transition: transform 0.5s ease;
        }
        .project-card:hover :global(.project-thumb) {
          transform: scale(1.05);
        }
        .card-stack {
          position: absolute;
          left: 10px;
          bottom: 10px;
          max-width: calc(100% - 20px);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(62, 240, 168, 0.45);
          background: rgba(5, 17, 15, 0.88);
          color: var(--primary-green);
          font-size: 0.72rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-note {
          margin-top: 8px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .projects-cta {
          position: relative;
          text-align: center;
          padding: 40px 20px 20px;
        }
        .projects-cta h3 {
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #ffffff;
        }
        .projects-cta p {
          margin: 12px 0 26px;
          color: var(--text-muted);
          font-size: 1.05rem;
        }
        .projects-cta :global(.cta-button) {
          padding: 15px 34px;
          font-size: 1.1rem;
        }
        .cta-circuit {
          position: absolute;
          top: 58%;
          width: 26%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(62, 240, 168, 0.7));
          box-shadow: 0 0 8px rgba(62, 240, 168, 0.4);
        }
        .cta-circuit::after {
          content: '';
          position: absolute;
          top: -4px;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #b9ffe4;
          box-shadow: 0 0 12px var(--primary-green);
        }
        .cta-circuit-left {
          left: 0;
        }
        .cta-circuit-right {
          right: 0;
          transform: scaleX(-1);
        }
        @keyframes project-arrive {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-card { animation: none; transition: none; }
          .project-card:hover, .project-card:focus-within, .project-card:hover :global(.project-thumb) { transform: none; }
          .card-screen :global(.project-thumb) { transition: none !important; }
        }
        @media (max-width: 1080px) {
          .projects-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .project-card:nth-child(n)::after {
            left: 50%;
          }
        }
        @media (max-width: 820px) {
          .projects-hero {
            grid-template-columns: minmax(0, 1fr);
          }
          .hero-tree, .cta-circuit {
            display: none;
          }
        }
        @media (max-width: 560px) {
          .project-card {
            grid-template-columns: minmax(0, 1fr);
            padding: 20px;
          }
          .card-media {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}
