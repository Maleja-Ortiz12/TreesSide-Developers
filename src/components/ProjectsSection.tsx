'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FEATURED_PROJECTS, Project } from '@/data/content';
import { ProjectModal } from './ProjectModal';
import { ProjectSpotlight } from './ProjectSpotlight';
import { ArrowRight, UtensilsCrossed, Radio, Boxes, Infinity, Flower2, Monitor, type LucideIcon } from 'lucide-react';
import { PROJECT_FILTERS, projectGroup, projectGroupLabel, withMockupArt } from '@/lib/projectGroups';

const CATALOG = withMockupArt(FEATURED_PROJECTS);
const PROJECT_ICONS: Record<string, LucideIcon> = {
  'equipo-la-lupe': UtensilsCrossed,
  'equipo-emisoras-latinas': Radio,
  'equipo-calculadora-de-contenedores': Boxes,
  'equipo-ocho80': Infinity,
  'equipo-floraltech-e-commerce': Flower2,
};
function ProjectIcon({ project }: { project: Project }) {
  const Icon = PROJECT_ICONS[project.id] ?? Monitor;
  return <Icon size={30} strokeWidth={1.6} aria-hidden="true" />;
}


export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProjects = CATALOG.filter(p => activeFilter === 'Todos' || projectGroup(p) === activeFilter);

  const router = useRouter();
  const goToContact = () => router.push('/contacto');

  return (
    <section id="proyectos" className="projects-page">
      <div className="container">
        <header className="projects-hero">
          <div className="hero-copy">
            <h1 className="section-title">
              Ideas que ya están <span className="text-gradient">funcionando.</span>
            </h1>
            <p className="section-subtitle">
              Catálogo de TreesSide y proyectos personales de sus integrantes. Cada proyecto del equipo conserva su autoría y su fuente.
            </p>

            <div className="filters" role="group" aria-label="Filtrar proyectos">
              {PROJECT_FILTERS.map((filter) => (
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
            <Image src="/images/mockup/projects-hero-tree.webp" alt="" width={1036} height={674} priority className="tree-image" />
          </div>
        </header>

        <span className="circuit-drop" aria-hidden="true" />

        <div className="catalog-body">
          <span className="catalog-tree" aria-hidden="true" />
          <ProjectSpotlight key={`spotlight-${activeFilter}`} projects={filteredProjects} onOpen={setSelectedProject} suspended={selectedProject !== null} groupOf={projectGroupLabel} />

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
                  <ProjectIcon project={project} />
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-group">{projectGroupLabel(project)}</p>
                  {project.experience && <span className="card-experience">Experiencia laboral</span>}
                  <p className="card-description">{project.description}</p>
                  <button type="button" aria-label={`Ver proyecto ${project.title}`} className="card-action">
                    Ver proyecto
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="card-media">
                  <div data-project-laptop="" className="card-laptop">
                  <div className="card-screen">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 900px) 90vw, 280px"
                      style={{ objectFit: project.imageFit ?? 'cover' }}
                      className="project-thumb"
                    />
                  </div>
                  <span className="card-base" aria-hidden="true" />
                  </div>
                  {project.imageLabel && <p className="card-note">{project.imageLabel}</p>}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactClick={goToContact}
      />

      <style jsx>{`
        /* A perspective entrance changes native hash coordinates while the catalog loads. */
        :global([data-reveal="first"]:has(> #proyectos)) {
          animation: none;
        }
        .projects-page {
          position: relative;
          padding: 100px 0 24px;
          overflow: clip;
        }
        .projects-hero {
          position: relative;
          display: flex;
          align-items: flex-start;
          min-height: 465px;
          isolation: isolate;
        }
        .hero-copy {
          position: relative;
          z-index: 1;
          width: 53%;
          padding-top: 22px;
        }
        .hero-copy .section-title {
          font-size: clamp(2.5rem, 4.8vw, 4.2rem);
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
          position: absolute;
          z-index: -1;
          top: -40px;
          right: -75px;
          width: 70%;
          max-width: 800px;
          aspect-ratio: 1036 / 674;
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
          /* Fades the cropped artwork into the page background on every side. */
          -webkit-mask-image: radial-gradient(ellipse 67% 70% at 57% 46%, #000 55%, transparent 100%);
          mask-image: radial-gradient(ellipse 67% 70% at 57% 46%, #000 55%, transparent 100%);
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
        .catalog-body {
          position: relative;
          isolation: isolate;
        }
        .catalog-tree {
          position: absolute;
          z-index: -1;
          top: 80px;
          bottom: 10px;
          left: 50%;
          width: 72px;
          transform: translateX(-50%);
          background: url('/images/mockup/projects-trunk.webp') center top / 72px 620px repeat-y;
          pointer-events: none;
          mask-image: linear-gradient(transparent, #000 60px, #000 calc(100% - 60px), transparent);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 56px 64px;
          margin: 64px 0 40px;
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
        /* Elbow traces link each laptop card to the tree running between the columns. */
        .project-card::after {
          content: '';
          position: absolute;
          top: -28px;
          width: calc(50% + 32px);
          height: 28px;
          border-top: 2px solid #64ffd0;
          filter: drop-shadow(0 0 6px #3ef0a8);
          pointer-events: none;
        }
        .project-card:nth-child(odd)::after {
          left: 50%;
          border-left: 2px solid #64ffd0;
          border-top-left-radius: 22px;
        }
        .project-card:nth-child(even)::after {
          right: 50%;
          border-right: 2px solid #64ffd0;
          border-top-right-radius: 22px;
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
        .card-copy > :global(svg) {
          color: var(--primary-green);
          margin-bottom: 10px;
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
        .card-experience {
          align-self: flex-start;
          margin-top: 8px;
          padding: 2px 10px;
          border-radius: 999px;
          border: 1px solid rgba(46, 230, 197, 0.45);
          color: var(--primary-cyan);
          font-size: 0.72rem;
        }
        .card-description {
          margin: 14px 0 16px;
          color: #d3e4de;
          font-size: 0.9rem;
          line-height: 1.55;
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
        .card-laptop {
          perspective: 800px;
          transform: rotate(-4deg);
          padding-bottom: 8px;
        }
        .card-screen {
          position: relative;
          aspect-ratio: 16 / 10;
          border-radius: 12px 12px 3px 3px;
          overflow: hidden;
          background: #071613;
          border: 5px solid #071310;
          box-shadow: 0 0 0 1px #a3e5ce60, 0 0 24px -6px rgba(62, 240, 168, 0.35);
        }
        .card-base {
          display: block;
          width: 112%;
          height: 10px;
          margin-left: -6%;
          background: linear-gradient(#a1beb8, #2a4540);
          border-radius: 2px 2px 50% 50%;
          box-shadow: 0 9px 14px #0008;
        }
        .card-screen :global(.project-thumb) {
          transition: transform 0.5s ease;
        }
        .project-card:hover :global(.project-thumb) {
          transform: scale(1.05);
        }
        .card-note {
          margin-top: 8px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        @keyframes project-arrive {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-card { animation: none; transition: none; }
          .card-laptop { transform: none; }
          .project-card:hover, .project-card:focus-within, .project-card:hover :global(.project-thumb) { transform: none; }
          .card-screen :global(.project-thumb) { transition: none !important; }
        }
        @media (max-width: 1080px) {
          .projects-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .catalog-tree, .project-card::after {
            display: none;
          }
        }
        @media (max-width: 820px) {
          .projects-page { padding-top: 95px; }
          .projects-hero {
            flex-direction: column;
            min-height: 0;
          }
          .hero-copy { width: 100%; padding-top: 12px; }
          .hero-tree {
            position: relative;
            top: auto;
            right: auto;
            width: 118%;
            margin: 0 -9% -15px;
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
