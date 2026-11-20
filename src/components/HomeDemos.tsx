'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { caseForProject, caseHref } from '@/data/cases';
import { MenuQuoteDemo } from './demos/MenuQuoteDemo';
import { RadioDemo } from './demos/RadioDemo';
import { LoadCalculatorDemo } from './demos/LoadCalculatorDemo';
import { useDemoSelection } from './home/demoSelection';
import styles from './home/Home.module.css';
const demos = [
  { id: 'la-lupe', title: 'La Lupe', kind: 'Restaurante', service: 'restaurantes', slug: 'restaurante', Demo: MenuQuoteDemo },
  { id: 'emisoras-latinas', title: 'Emisoras Latinas', kind: 'Radio', service: 'streaming', slug: 'radio', Demo: RadioDemo },
  { id: 'calculadora-de-contenedores', title: 'Calculadora de contenedores', kind: 'Logística', service: 'logistica', slug: 'logistica', Demo: LoadCalculatorDemo },
];
export function HomeDemos() {
  const selected = useDemoSelection();
  return <section id="demos" className={styles.demos}>
    <div className="container">
      <div className={styles.demoLayout}>
        <div><h2>Menos promesas. Más cosas que <span className="text-gradient">puedes probar.</span></h2><p>Explora demos conceptuales de soluciones reales y comprueba por ti mismo cómo podemos llevar tu idea al siguiente nivel.</p><p className={styles.note}>Simulaciones locales con datos de ejemplo. No se guardan ni se envían datos; no son reservas, ventas ni pedidos reales.</p></div>
        <div>{demos.map(({ id, title, kind, service, slug, Demo }) => <article key={id} id={`demo-${id}`} data-demo={id} hidden={selected !== id} className={styles.demoPanel}>
          <p className={styles.demoLabel}>Demo conceptual · {kind}</p><Demo /><p className={styles.source}>Basado en <Link href={caseHref(title) ?? `/proyectos#equipo-${id}`}>{title}</Link></p>
          <div className={styles.demoActions}>
            <Link href={`/servicios/${service}?servicio=${service}&demo=${slug}`}>Ver servicio</Link>
            <Link className="btn btn-primary" href={`/contacto?servicio=${service}&demo=${slug}`}>Solicitar una propuesta <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>)}</div>
      </div>
      <h2 className={styles.projectsTitle}>Experiencia que puedes <span className="text-gradient">revisar.</span></h2>
      <div className={styles.projects}>{demos.slice(0, 2).map(({ title }) => {
        const project = FEATURED_PROJECTS.find(item => item.title === title)!;
        const evidence = caseForProject(project.title);
        const publicUrl = project.projectUrl ?? evidence?.liveUrl;
        return <article key={project.id} data-project-card={project.id} className={styles.project}>
          <div data-laptop="" className={styles.laptop}><div className={styles.screen}><Image src={project.image} alt={`Captura de ${project.title}`} width={460} height={290} sizes="(max-width: 760px) 90vw, 42vw" style={{ objectFit: project.imageFit ?? 'cover', objectPosition: 'top' }} /></div><span className={styles.laptopBase} /></div>
          <div>
            <p className={styles.projectOrigin}>Portafolio del equipo</p>
            <h3>{project.title}</h3>
            {evidence && <p><strong>Contexto:</strong> {evidence.context}</p>}
            <p><strong>Solución desarrollada:</strong> {project.description}</p>
            <p><strong>Participación del equipo:</strong> {project.authors?.map((author, index) => <span key={author.name}>{index > 0 ? ' · ' : ''}<a href={author.portfolio} target="_blank" rel="noopener noreferrer">{author.name}</a></span>)}</p>
            {evidence && <div className={styles.projectFeatures}><strong>Funcionalidades entregadas</strong><ul>{evidence.solution.map(feature => <li key={feature}>{feature}</li>)}</ul></div>}
            <div className={styles.projectActions}>
              <Link href={`/proyectos#${project.id}`} className={styles.projectLink}>Ver proyecto <ArrowRight size={18} aria-hidden="true" /></Link>
              {publicUrl && <a href={publicUrl} className={styles.projectLink} target="_blank" rel="noopener noreferrer">Visitar sitio público <ArrowRight size={18} aria-hidden="true" /></a>}
            </div>
          </div>
        </article>;
      })}</div>
    </div>
  </section>;
}
