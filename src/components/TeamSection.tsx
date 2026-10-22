'use client';

import { useEffect, useRef, type PointerEvent } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TEAM_MEMBERS } from '@/data/team';
import styles from './TeamSection.module.css';

export function TeamSection({ detailed = false }: { detailed?: boolean }) {
  const Heading = detailed ? 'h1' : 'h2';
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        root.dataset.visible = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  function tilt(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${-y * 10}deg`);
    card.style.setProperty('--tilt-y', `${x * 10}deg`);
  }

  function reset(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  }

  return (
    <section id="equipo" ref={section} className={`${styles.section} ${detailed ? styles.detailed : ''}`} aria-labelledby="team-title">
      <div className="container">
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.cube}>{Array.from({ length: 6 }, (_, face) => <span key={face} />)}</div>
        </div>
        <div className={styles.heading}>
          <span className="kicker"><Code2 size={18} aria-hidden="true" /> NUESTRO EQUIPO</span>
          <Heading id="team-title" className="section-title">Personas reales.<br /><span className="text-gradient">Talento que construye.</span></Heading>
          <p className="section-subtitle">Detrás de cada solución hay personas con distintas fortalezas. Conoce nuestro equipo y explora el trabajo de cada integrante.</p>
          {detailed ? (
            <Link className={styles.jumpLink} href="/contacto">Hablemos de tu próximo proyecto <ArrowUpRight size={18} aria-hidden="true" /></Link>
          ) : (
            <Link className={styles.jumpLink} href="/equipo">Conoce al equipo en detalle <ArrowUpRight size={18} aria-hidden="true" /></Link>
          )}
          {detailed && <p className={styles.sourceNote}>Experiencia, formación y proyectos personales según los portafolios de cada integrante. Estos trabajos no se presentan como proyectos de TreesSide Developers.</p>}
        </div>
        <div className={styles.grid}>
          {TEAM_MEMBERS.map((member, index) => (
            <div className={styles.stage} key={member.portfolio} style={{ animationDelay: `${index * 100}ms` }}>
              <article className={styles.card} onPointerMove={detailed ? undefined : tilt} onPointerLeave={detailed ? undefined : reset} onPointerCancel={detailed ? undefined : reset}>
                <div className={styles.identity}>
                  <div className={styles.avatar}>
                    <Image className={styles.portrait} src={member.photo} alt={member.name} width={detailed ? 384 : 112} height={detailed ? 384 : 112} style={{ objectFit: member.photoFit ?? 'cover' }} loading="lazy" />
                    <span className={styles.orbit} aria-hidden="true" />
                  </div>
                  <span className={styles.number}>/ 0{index + 1}</span>
                </div>
                <div className={styles.profile}>
                {detailed ? <h2 className={styles.memberName}>{member.name}</h2> : <h3>{member.name}</h3>}
                <p className={styles.role}>{member.role}</p>
                <p className={styles.description}>{member.description}</p>
                {member.skills.length > 0 && <ul className={styles.skills} aria-label={`Tecnologías de ${member.name}`}>
                  {member.skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>}
                {detailed && (
                  <div className={styles.details}>
                    {member.contributions.length > 0 && <div>
                      <h3>Áreas de aporte</h3>
                      <ul>{member.contributions.map(item => <li key={item}>{item}</li>)}</ul>
                    </div>}
                    {member.education && <div><h3>Formación</h3><p>{member.education}</p></div>}
                    {member.projects.length > 0 && <div>
                      <h3>Proyectos del portafolio</h3>
                      <ul>{member.projects.map(project => <li key={project.name}><strong>{project.name}</strong><p>{project.description}</p></li>)}</ul>
                    </div>}
                    {!member.contributions.length && <p>Estamos preparando una presentación más completa de su experiencia. Mientras tanto, puedes explorar los proyectos y la información publicada en su portafolio.</p>}
                  </div>
                )}
                <a className={styles.link} href={member.portfolio} target="_blank" rel="noopener noreferrer" aria-label={`Ver portafolio de ${member.name} (abre en otra pestaña)`}>
                  Ver portafolio <ArrowUpRight size={19} aria-hidden="true" />
                </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
