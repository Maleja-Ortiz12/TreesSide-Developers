import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Layers, TrendingUp } from 'lucide-react';
import { FEATURED_PROJECTS, TECHNOLOGIES } from '@/data/content';
import { TEAM_MEMBERS } from '@/data/team';
import { AboutSection } from '../AboutSection';
import styles from './About.module.css';

const APPROACH = [
  { title: 'Entender antes de construir', description: 'Profundizamos en tu idea, objetivos y contexto para diseñar la mejor solución.', Icon: Search },
  { title: 'Crear con propósito', description: 'Desarrollamos software útil, sostenible y centrado en generar valor real.', Icon: Layers },
  { title: 'Crecer contigo', description: 'Evolucionamos la solución junto a tus necesidades, con enfoque en escala y continuidad.', Icon: TrendingUp },
];

export function AboutMockup() {
  return <section id="nosotros-intro" className={styles.about}>
    <div className={`container ${styles.hero}`}>
      <Image src="/images/mockup/about-branch.webp" alt="" aria-hidden="true" width={418} height={370} priority className={styles.branch} />
      <div className={styles.copy}>
        <h1>Somos las raíces<br />detrás de tu próxima<br /><span className="text-gradient">gran idea.</span></h1>
        <p>Un equipo que une creatividad, tecnología y buenas prácticas para construir software a medida.</p>
        <Link href="/equipo" className="btn btn-primary">Conocer al equipo <ArrowRight size={20} aria-hidden="true" /></Link>
      </div>
    </div>
    <ul data-about-stats="" className={`container ${styles.stats}`}>
      <li><Link href="/proyectos"><strong>{FEATURED_PROJECTS.length}</strong> proyectos</Link></li>
      <li><Link href="/servicios"><strong>{TECHNOLOGIES.length}</strong> tecnologías</Link></li>
      <li><Link href="/equipo"><strong>{TEAM_MEMBERS.length}</strong> desarrolladores</Link></li>
    </ul>
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
    <div className="container">
      <details data-about-purpose="" className={styles.legacy}>
        <summary>Nuestro propósito y lo que nos apasiona</summary>
        <AboutSection />
      </details>
    </div>
  </section>;
}
