'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { caseHref } from '@/data/cases';
import { MenuQuoteDemo } from './demos/MenuQuoteDemo';
import { RadioDemo } from './demos/RadioDemo';
import { LoadCalculatorDemo } from './demos/LoadCalculatorDemo';
import { useDemoSelection } from './home/demoSelection';
import styles from './home/Home.module.css';
const demos = [
  { id: 'la-lupe', title: 'La Lupe', kind: 'Restaurante', Demo: MenuQuoteDemo },
  { id: 'emisoras-latinas', title: 'Emisoras Latinas', kind: 'Radio', Demo: RadioDemo },
  { id: 'calculadora-de-contenedores', title: 'Calculadora de contenedores', kind: 'Logística', Demo: LoadCalculatorDemo },
];
export function HomeDemos() {
  const selected = useDemoSelection();
  return <section id="demos" className={styles.demos}>
    <div className="container">
      <div className={styles.demoLayout}>
        <div><h2>Menos promesas. Más cosas que <span className="text-gradient">puedes probar.</span></h2><p>Explora demos conceptuales de soluciones reales y comprueba por ti mismo cómo podemos llevar tu idea al siguiente nivel.</p><p className={styles.note}>Simulaciones locales con datos de ejemplo. No se guardan ni se envían datos; no son reservas, ventas ni pedidos reales.</p></div>
        <div>{demos.map(({ id, title, kind, Demo }) => <article key={id} id={`demo-${id}`} data-demo={id} hidden={selected !== id} className={styles.demoPanel}>
          <p className={styles.demoLabel}>Demo conceptual · {kind}</p><Demo /><p className={styles.source}>Basado en <Link href={caseHref(title) ?? `/proyectos#equipo-${id}`}>{title}</Link></p>
        </article>)}</div>
      </div>
      <h3 className={styles.projectsTitle}>Ideas que cobran <span className="text-gradient">vida.</span></h3>
      <div className={styles.projects}>{demos.slice(0, 2).map(({ title }) => {
        const project = FEATURED_PROJECTS.find(item => item.title === title)!;
        return <article key={project.id} data-project-card={project.id} className={styles.project}>
          <div data-laptop="" className={styles.laptop}><div className={styles.screen}><Image src={project.image} alt={project.title} width={460} height={290} style={{ objectFit: 'cover', objectPosition: 'top' }} /></div><span className={styles.laptopBase} /></div>
          <div><h3>{project.title}</h3><p>{project.description}</p><Link href={`/proyectos#${project.id}`} className={styles.projectLink}>Ver proyecto <ArrowRight size={18} /></Link></div>
        </article>;
      })}</div>
    </div>
  </section>;
}
