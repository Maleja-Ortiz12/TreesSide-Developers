import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle } from 'lucide-react';
import { SitePage } from '@/components/SitePage';
import { CASE_STUDIES } from '@/data/cases';
import { CONTACT_INFO, FEATURED_PROJECTS } from '@/data/content';
import { pageMetadata } from '@/lib/metadata';
import styles from '../casos.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CASE_STUDIES.map(item => ({ slug: item.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = CASE_STUDIES.find(entry => entry.slug === slug);
  if (!item) return {};
  return pageMetadata(`/casos/${item.slug}`, {
    title: `Caso de éxito: ${item.project} | TreesSide Developers`,
    description: item.summary,
  });
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const item = CASE_STUDIES.find(entry => entry.slug === slug);
  if (!item) notFound();
  const project = FEATURED_PROJECTS.find(entry => entry.title === item.project);
  return (
    <SitePage>
      <article className={`container ${styles.case}`}>
        <Link href="/casos" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Casos de éxito</Link>
        <header className={styles.hero}>
          <div>
            <span className="kicker">CASO DE ÉXITO · {project?.category.toUpperCase()}</span>
            <h1>{item.project}</h1>
            <p className={styles.summary}>{item.summary}</p>
            {project?.owner && <p className={styles.authors}>Desarrollado por {project.owner}</p>}
            {item.liveUrl && (
              <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Ver sitio en línea <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </div>
          {project?.image && (
            <div className={styles.cover}>
              <Image src={project.image} alt={`Vista del proyecto ${item.project}`} fill priority sizes="(max-width: 900px) 100vw, 520px"
                style={{ objectFit: project.imageFit ?? 'cover' }} />
            </div>
          )}
        </header>

        <section className={styles.block}>
          <h2>Contexto</h2>
          <p>{item.context}</p>
        </section>
        <div className={styles.columns}>
          <section className={styles.block}>
            <h2>El reto</h2>
            <ul>{item.challenge.map(line => <li key={line}>{line}</li>)}</ul>
          </section>
          <section className={styles.block}>
            <h2>La solución</h2>
            <ul>{item.solution.map(line => <li key={line}>{line}</li>)}</ul>
          </section>
        </div>
        <section className={styles.block}>
          <h2>Tecnologías</h2>
          <ul className={styles.chips}>{item.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
        </section>
        <section className={`${styles.block} ${styles.results}`}>
          <h2>Resultados</h2>
          <ul>{item.results.map(line => <li key={line}>{line}</li>)}</ul>
        </section>

        <aside className={styles.cta}>
          <p>¿Tienes un proyecto parecido? Cuéntanos tu idea y te decimos cómo lo construiríamos.</p>
          <div>
            <Link href="/contacto" className="btn btn-primary">Hablemos de tu proyecto <ArrowRight size={18} aria-hidden="true" /></Link>
            <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <MessageCircle size={18} aria-hidden="true" />WhatsApp
            </a>
          </div>
        </aside>
      </article>
    </SitePage>
  );
}
