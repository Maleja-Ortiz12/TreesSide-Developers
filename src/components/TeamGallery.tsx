'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ChevronRight, Code2 } from 'lucide-react';
import { TEAM_MEMBERS } from '@/data/team';
import styles from './TeamGallery.module.css';

function resetTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty('--tilt-x');
  event.currentTarget.style.removeProperty('--tilt-y');
}

function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || !window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  ).matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty('--tilt-x', `${-y * 8}deg`);
  event.currentTarget.style.setProperty('--tilt-y', `${x * 8}deg`);
}

export function TeamGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const gallery = useRef<HTMLDivElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const previousSelection = useRef<number | null>(null);
  const exitAnimation = useRef<Animation | null>(null);

  useEffect(() => {
    if (selected !== null) {
      backButton.current?.focus({ preventScroll: true });
    } else if (previousSelection.current !== null) {
      triggers.current[previousSelection.current]?.focus({ preventScroll: true });
    }
    previousSelection.current = selected;
  }, [selected]);

  useEffect(() => () => { exitAnimation.current?.cancel(); }, []);

  function changeView(next: number | null) {
    if (exitAnimation.current || transitioning) return;
    const node = gallery.current;
    if (!node || !node.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSelected(next);
      return;
    }
    setTransitioning(true);
    const animation = node.animate([
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
    ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    exitAnimation.current = animation;
    animation.finished.then(() => {
      exitAnimation.current = null;
      setSelected(next);
      setTransitioning(false);
    }).catch(() => { /* Cancellation during unmount needs no state update. */ });
  }

  return (
    <section id="equipo" className={styles.section} aria-labelledby="team-title">
      <div className="container">
        <div className={styles.heading}>
          <span className="kicker"><Code2 size={18} aria-hidden="true" /> NUESTRO EQUIPO</span>
          <h1 id="team-title" className="section-title">Talento que crece.<br /><span className="text-gradient">Un mismo propósito.</span></h1>
          <p className="section-subtitle">Conoce a las personas detrás del código. Abre un perfil para explorar su experiencia, sus habilidades y los proyectos que les dan forma.</p>
          <p className={styles.hint}>Elige un integrante y explora su perfil en una vista centrada.</p>
          <div className={styles.sculpture} aria-hidden="true"><span /><span /><span /></div>
        </div>

        <div ref={gallery} key={selected ?? 'team'} data-team-gallery="true" data-focused={selected !== null}
          className={styles.gallery} aria-busy={transitioning}>
          {selected !== null && <div className={styles.toolbar}>
            <button type="button" ref={backButton} className={styles.backButton} disabled={transitioning}
              onClick={() => changeView(null)}>
              <ArrowLeft size={18} aria-hidden="true" /> Volver al equipo
            </button>
            <span className={styles.viewLabel}>PERFIL DEL INTEGRANTE</span>
          </div>}
          {TEAM_MEMBERS.map((member, index) => {
            const active = selected === index;
            return (
              <article key={member.portfolio} hidden={selected !== null && !active}
                data-selected={active} className={styles.card}
                style={{ animationDelay: selected === null ? `${index * 70}ms` : '0ms' }}>
                <div className={styles.overview}>
                  <div className={styles.photoFrame} onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
                    <span className={styles.photoBackplate} aria-hidden="true" />
                    <div className={styles.photoFloat}>
                      <Image src={member.photo} alt={member.name} width={384} height={384}
                        className={styles.portrait} style={{ objectFit: member.photoFit ?? 'cover' }} loading="lazy" />
                    </div>
                    <span className={styles.photoShine} aria-hidden="true" />
                    <span className={styles.number}>{String(index + 1).padStart(2, '0')} / TREESSIDE</span>
                  </div>
                  <div className={styles.intro}>
                    <p className={styles.role}>{member.role}</p>
                    <h2 id={`team-name-${index + 1}`}>{member.name}</h2>
                    <p className={styles.description}>{member.description}</p>
                  </div>
                  <button type="button" ref={node => { triggers.current[index] = node; }} className={styles.toggle}
                    aria-expanded={active} aria-controls={`team-profile-${index + 1}`}
                    aria-label={`${active ? 'Volver al equipo desde el perfil' : 'Ver perfil'} de ${member.name}`}
                    disabled={transitioning} onClick={() => changeView(active ? null : index)}>
                    {active ? 'Volver al equipo' : 'Ver perfil'} <ChevronRight size={19} aria-hidden="true" />
                  </button>
                  <a className={styles.portfolio} href={member.portfolio} target="_blank" rel="noopener noreferrer"
                    aria-label={`Ver portafolio de ${member.name} (abre en otra pestaña)`}>
                    Ver portafolio <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>

                <div id={`team-profile-${index + 1}`} hidden={!active} className={styles.detailsBody}
                  role="region" aria-labelledby={`team-name-${index + 1}`}>
                  <div><h3>Tecnologías</h3>
                    <ul className={styles.skills} aria-label={`Tecnologías de ${member.name}`}>
                      {member.skills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                  <div><h3>Áreas de aporte</h3>
                    <ul className={styles.list}>{member.contributions.map(item => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div><h3>Formación</h3><p>{member.education}</p></div>
                  <div><h3>Proyectos del portafolio</h3>
                    <ul className={styles.projects}>{member.projects.map(project => (
                      <li key={project.name}><strong>{project.name}</strong><p>{project.description}</p></li>
                    ))}</ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.bottom}>
          <p>Experiencia, formación y proyectos personales según los portafolios de cada integrante. Estos trabajos no se presentan como proyectos de TreesSide Developers.</p>
          <Link href="/contacto" className="btn btn-secondary">Construyamos tu próxima idea <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
