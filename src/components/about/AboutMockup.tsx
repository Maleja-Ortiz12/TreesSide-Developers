import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Layers, TrendingUp } from 'lucide-react';
import { AboutSection } from '../AboutSection';
import { TEAM_MEMBERS } from '@/data/team';
import styles from './About.module.css';

const APPROACH = [
  { title: 'Entender antes de construir', description: 'Profundizamos en tu idea, objetivos y contexto para diseñar la mejor solución.', Icon: Search },
  { title: 'Crear con propósito', description: 'Desarrollamos software útil, sostenible y centrado en generar valor real.', Icon: Layers },
  { title: 'Crecer contigo', description: 'Revisamos contigo los avances y acordamos la entrega. La capacitación, el soporte y las mejoras posteriores dependen del alcance contratado.', Icon: TrendingUp },
];

export function AboutMockup() {
  return <section id="nosotros-intro" className={styles.about}>
    <div className={`container ${styles.hero}`}>
      <Image src="/images/mockup/about-branch.webp" alt="" aria-hidden="true" width={418} height={370} priority className={styles.branch} />
      <div className={styles.copy}>
        <h1>Somos las raíces<br />detrás de tu próxima<br /><span className="text-gradient">gran idea.</span></h1>
        <p>Ayudamos a restaurantes, comercios y emprendimientos que necesitan presentar su oferta, recibir consultas, vender por internet u organizar su operación. Definimos contigo qué construir y qué queda fuera del alcance.</p>
        <Link href="/equipo" className="btn btn-primary">Conocer al equipo <ArrowRight size={20} aria-hidden="true" /></Link>
      </div>
    </div>
    <ul data-about-stats="" className={`container ${styles.stats}`}>
      <li><Link href="/proyectos"><strong>Proyectos</strong> con autoría y fuentes</Link></li>
      <li><Link href="/casos/la-lupe"><strong>La Lupe</strong> consulta el desarrollo</Link></li>
      <li><Link href="/equipo"><strong>Equipo</strong> conoce a sus integrantes</Link></li>
    </ul>
    <div className="container"><p>La experiencia se respalda con proyectos revisables. Los proyectos personales y los realizados como empleados de otras empresas no se presentan como contratos de TreesSide Developers.</p></div>
    <div className={`container ${styles.approach}`}>
      <div className={styles.intro}>
        <h2>Código que construye <span className="text-gradient">futuro.</span></h2>
        <p>Nuestra forma de trabajar combina pensamiento estratégico, desarrollo sólido y una visión de largo plazo para convertir ideas en soluciones reales, funcionales y escalables.</p>
      </div>
      {APPROACH.map(({title,description,Icon})=><article key={title} className={styles.value} data-about-value="">
        <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
        <h3>{title}</h3><p>{description}</p>
      </article>)}
    </div>
    <section className="container" aria-labelledby="about-team-title">
      <h2 id="about-team-title">Las personas detrás de tu proyecto</h2>
      <div className={styles.teamGrid}>{TEAM_MEMBERS.map(member => <article key={member.portfolio} className={styles.teamMember}>
        <Image src={member.photo} alt={member.name} width={160} height={160} sizes="160px" />
        <h3>{member.name}</h3><p>{member.role}</p>
        <ul>{member.contributions.map(item => <li key={item}>{item}</li>)}</ul>
        <a href={member.portfolio} target="_blank" rel="noopener noreferrer">Ver experiencia y proyectos</a>
      </article>)}</div>
      <p>Estas son las áreas de aporte de cada integrante; la propuesta define los responsables de tu proyecto y el acompañamiento contratado.</p>
    </section>
    <div className="container">
      <details data-about-purpose="" className={styles.legacy}>
        <summary>Nuestro propósito y lo que nos apasiona</summary>
        <AboutSection />
      </details>
    </div>
  </section>;
}
