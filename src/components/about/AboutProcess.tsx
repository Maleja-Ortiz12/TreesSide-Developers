import Link from 'next/link';
import { Lightbulb, Pencil, Code, Rocket, Sprout, Laptop, Database, Cloud, LayoutGrid } from 'lucide-react';
import { PROCESS_STEPS } from '@/data/content';
import styles from './About.module.css';

const PRESENTATION = [
  { title: 'Descubrimos', Icon: Lightbulb }, { title: 'Diseñamos', Icon: Pencil },
  { title: 'Construimos', Icon: Code }, { title: 'Lanzamos', Icon: Rocket },
];
const CAPABILITIES = [{ label: 'Web', Icon: Laptop }, { label: 'Datos', Icon: Database }, { label: 'Cloud', Icon: Cloud }, { label: 'Apps', Icon: LayoutGrid }];

export function AboutProcess() {
  return <section id="proceso" className={styles.process} aria-labelledby="about-process-title">
    <div className={`container ${styles.processLayout}`}>
      <div className={styles.intro}>
        <span className="kicker">NUESTRO PROCESO</span>
        <h2 id="about-process-title">De la idea <br />al software, <br /><span className="text-gradient">contigo.</span></h2>
        <p>Un proceso claro, colaborativo y flexible que convierte tus objetivos en soluciones reales.</p>
      </div>
      <ol className={styles.steps}>
        {PROCESS_STEPS.map((step,index)=>{
          const {title,Icon}=PRESENTATION[index];
          return <li key={step.step} className={styles.step} data-about-step="">
            <Sprout className={styles.sprout} size={42} strokeWidth={1.2} aria-hidden="true" />
            <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
            <h3>{title}</h3>
            {step.title!==title && <span className={styles.originalStage}>{step.title}</span>}
            <p>{step.description}</p>
          </li>;
        })}
      </ol>
    </div>
    <nav className={`container ${styles.capabilities}`} aria-label="Nuestras capacidades">
      <span className="kicker">NUESTRAS CAPACIDADES</span>
      {CAPABILITIES.map(({label,Icon})=><Link key={label} href="/servicios"><Icon size={24} strokeWidth={1.6} aria-hidden="true" />{label}</Link>)}
    </nav>
  </section>;
}
