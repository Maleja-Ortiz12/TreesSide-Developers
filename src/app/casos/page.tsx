import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SitePage } from '@/components/SitePage';
import { CASE_STUDIES } from '@/data/cases';
import { FEATURED_PROJECTS } from '@/data/content';
import { pageMetadata } from '@/lib/metadata';
import styles from './casos.module.css';

export const metadata: Metadata = pageMetadata('/casos', {
  title: 'Casos de éxito | TreesSide Developers',
  description: 'Cómo resolvimos retos reales: el contexto, la solución y los resultados de proyectos construidos por el equipo de TreesSide.',
});

export default function CaseStudiesPage() {
  return (
    <SitePage>
      <section className={`container ${styles.index}`}>
        <span className="kicker">CASOS DE ÉXITO</span>
        <h1>Proyectos reales, de la idea al resultado</h1>
        <p className={styles.summary}>El contexto, el reto, la solución y lo que se logró en algunos de los proyectos que construimos.</p>
        <div className={styles.grid}>
          {CASE_STUDIES.map(item => {
            const project = FEATURED_PROJECTS.find(entry => entry.title === item.project);
            return (
              <Link key={item.slug} href={`/casos/${item.slug}`} className={`glass-card ${styles.card}`}>
                {project?.image && (
                  <span className={styles.thumb}>
                    <Image src={project.image} alt="" fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: project.imageFit ?? 'cover' }} />
                  </span>
                )}
                <span className={styles.cardBody}>
                  <strong>{item.project}</strong>
                  <span>{item.summary}</span>
                  <em>Ver caso <ArrowRight size={15} aria-hidden="true" /></em>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </SitePage>
  );
}
