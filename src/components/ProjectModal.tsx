'use client';

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ProjectImage } from './ProjectImage';
import { Project } from '@/data/content';
import Link from 'next/link';
import { caseForProject, caseHref } from '@/data/cases';
import { projectEvidenceLabel } from '@/lib/projectEvidence';
import { X, ArrowRight, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onContactClick: () => void;
}

const OVERLAY_STYLE: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(3,11,10,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };

export function ProjectModal({ project, onClose, onContactClick }: ProjectModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]')[0];
    (first ?? panel.current)?.focus({ preventScroll: true });
    return () => opener?.focus({ preventScroll: true });
  }, [project]);
  if (!project) return null;
  const evidence = caseForProject(project.title);
  const features = project.features ?? evidence?.solution;
  const publicUrl = project.projectUrl ?? evidence?.liveUrl;
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key !== 'Tab') return;
    const controls = panel.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]');
    if (!controls?.length) { event.preventDefault(); panel.current?.focus(); return; }
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  // styled-jsx does not scope this root overlay (browser evidence: no jsx-* class, computed position static),
  // so its viewport layout is inline: the modal must open where the visitor is, never at the end of the page.
  return <BodyPortal><div className="project-overlay" style={OVERLAY_STYLE} onClick={onClose}>
    <div ref={panel} role="dialog" aria-modal={true} aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown} className="project-dialog" onClick={event => event.stopPropagation()}>
      <button type="button" onClick={onClose} aria-label="Cerrar modal" className="project-close"><X size={22} aria-hidden="true" /></button>
      <div data-project-detail-media="" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#071613' }}>
        <ProjectImage src={project.image} alt={`Captura de ${project.title}`} fill sizes="(max-width: 760px) calc(100vw - 40px), 720px" style={{ objectFit: 'contain' }} />
      </div>
      <div className="project-detail">
        <p className="text-gradient">{projectEvidenceLabel(project)}</p>
        <h2 id={titleId}>{project.title}</h2>
        <p>{project.category} · {project.tag}</p>
        {project.imageLabel && <p>{project.imageLabel}</p>}
        {evidence && <><h3>Contexto o necesidad</h3><p>{evidence.context}</p></>}
        <h3>Solución desarrollada</h3><p>{project.detailedDescription || project.description}</p>
        <h3>Participación del equipo</h3>
        {project.experience && <p>Producto de otra empresa en el que participó como empleado. No es un contrato de TreesSide Developers.</p>}
        {project.authors?.length ? <ul>{project.authors.map(author => <li key={author.portfolio}><a href={author.portfolio} target="_blank" rel="noopener noreferrer">{author.name} · Portafolio del autor <ExternalLink size={14} aria-hidden="true" /></a></li>)}</ul> : <p>{project.owner || 'La participación individual y sus responsabilidades están pendientes de confirmar.'}</p>}
        {project.client && <p>Cliente: {project.client}</p>}
        {project.year && project.year !== 'No especificado' && <p>Año: {project.year}</p>}
        {features && <><h3>Funcionalidades entregadas</h3><ul>{features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
        {caseHref(project.title) && <p><Link href={caseHref(project.title)!}>Ver caso del proyecto <ArrowRight size={14} aria-hidden="true" /></Link></p>}
        {publicUrl && <p><a href={publicUrl} target="_blank" rel="noopener noreferrer">Ver proyecto en línea <ExternalLink size={14} aria-hidden="true" /></a></p>}
        <div className="project-actions"><button onClick={onClose} className="btn btn-secondary">Cerrar</button><button onClick={() => { onClose(); onContactClick(); }} className="btn btn-primary">Quiero un proyecto similar <ArrowRight size={16} aria-hidden="true" /></button></div>
      </div>
      <style jsx>{`
        .project-overlay { position:fixed; inset:0; z-index:200; background:rgba(3,11,10,.9); display:flex; align-items:center; justify-content:center; padding:20px; }
        .project-dialog { position:relative; background:#071613; border:1px solid #3ef0a870; border-radius:20px; width:100%; max-width:720px; max-height:90dvh; overflow:auto; overscroll-behavior:contain; }
        .project-close { position:absolute; right:12px; top:12px; z-index:1; display:grid; place-items:center; width:44px; height:44px; border:1px solid #3ef0a8; border-radius:50%; background:#071613; color:#fff; cursor:pointer; }
        .project-detail { padding:24px; color:#d3e4de; overflow-wrap:anywhere; }
        .project-detail h2 { color:#fff; font-size:1.8rem; }
        .project-detail h3 { color:#fff; margin-top:24px; margin-bottom:8px; }
        .project-detail p { margin:10px 0; line-height:1.65; }
        .project-detail ul { padding-left:20px; line-height:1.7; }
        .project-detail a { color:#8bffd3; text-decoration:underline; text-underline-offset:3px; }
        .project-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:24px; }
      `}</style>
    </div>
  </div></BodyPortal>;
}

// Portal to <body>: inside #proyectos a transformed ancestor would turn `position: fixed` into
// section-relative positioning and show the modal at the end of the catalog.
function BodyPortal({ children }: { children: React.ReactNode }) {
  // No document during server rendering (the modal only opens client-side, but stay safe).
  return typeof document === 'undefined' ? <>{children}</> : createPortal(children, document.body);
}
