import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, Boxes, MousePointerClick, Settings, Brush, SlidersHorizontal, Lightbulb, Layers, Code2, FlaskConical, ArrowRight } from 'lucide-react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import { SectorNav } from './SectorNav';
import { CategoryPlans } from './CategoryPlans';
import styles from './CustomLayouts.module.css';

const offers = [
  { icon: Gamepad2, title: 'Juegos web', text: 'Experiencias que se ejecutan en el navegador.', art: 'web' },
  { icon: Boxes, title: 'Prototipos jugables', text: 'Validamos mecánicas y la experiencia de juego.', art: 'prototipo' },
  { icon: MousePointerClick, title: 'Experiencias interactivas', text: 'Propuestas para marcas, educación o entretenimiento.', art: 'interactivo' },
];
const mechanics = [
  { icon: Settings, title: 'Mecánicas', text: 'Definimos las reglas, retos e interacción.' },
  { icon: Gamepad2, title: 'Interfaz y controles', text: 'Diseñamos una experiencia clara y jugable.' },
  { icon: Brush, title: 'Arte y sonido', text: 'Construimos la atmósfera visual y auditiva.' },
  { icon: SlidersHorizontal, title: 'Pruebas y ajustes', text: 'Probamos, iteramos y refinamos la experiencia.' },
];
const steps = [
  { icon: Lightbulb, title: 'Concepto', text: 'Aterrizamos la idea, referencias y objetivos.' },
  { icon: Layers, title: 'Prototipo', text: 'Construimos una versión jugable inicial.' },
  { icon: Code2, title: 'Desarrollo', text: 'Evolucionamos la experiencia con contenido e interacción.' },
  { icon: FlaskConical, title: 'Pruebas', text: 'Jugamos, validamos y ajustamos detalles.' },
];

export function GamesLayout({ category }: { category: ServiceCategory }) {
  return (
    <div className={`${styles.root} container`}>
      <SectorNav slug={category.slug} label={category.label} />
      <header className={styles.gameHero}>
        <div><h1>Ideas que se juegan. Mundos que se <span>exploran.</span></h1><p>Arte e interfaces conceptuales.</p><div className={styles.actions}><Link href="/contacto" className="btn btn-primary"><Gamepad2 size={20} aria-hidden="true" /> Cuéntanos tu juego</Link><Link href="#posibilidades" className="btn btn-secondary">Explorar posibilidades</Link></div></div>
        <div className={styles.heroStage} data-art-3d="hero" data-tilt=""><Image src="/images/services/videojuegos/hero.webp" alt="Islas flotantes, cascadas y un árbol luminoso de un mundo de videojuego conceptual." width={960} height={680} priority /></div>
      </header>
      <section id="posibilidades" className={styles.section} aria-labelledby="offers-title">
        <h2 id="offers-title">¿Qué quieres crear?</h2>
        <div className={styles.offerGrid}>{offers.map(({ icon: Icon, title, text, art }) => <article key={title} className={styles.offerCard}><Image src={`/images/services/videojuegos/${art}.webp`} alt="" width={600} height={340} /><Icon size={42} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className={styles.section} aria-labelledby="mechanics-title">
        <h2 id="mechanics-title">De la mecánica a la experiencia.</h2>
        <div className={styles.mechanics}>
          <div><div className={styles.artStage} data-art-3d="gameplay" data-tilt=""><Image src="/images/services/videojuegos/gameplay.webp" alt="Vista conceptual de un personaje en una plataforma entre islas flotantes, con controles de juego y un portal luminoso." width={1020} height={420} sizes="(max-width: 700px) 94vw, 650px" /></div><p className={styles.caption}>Vista conceptual</p></div>
          <ul className={styles.mechanicsList}>{mechanics.map(({ icon: Icon, title, text }) => <li key={title}><Icon size={30} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul>
        </div>
      </section>
      <CategoryPlans plans={category.plans} />
      <section className={styles.section} aria-labelledby="process-title">
        <h2 id="process-title">Nuestro proceso de desarrollo.</h2>
        <ol className={`${styles.steps} ${styles.gameSteps}`}>{steps.map(({ icon: Icon, title, text }) => <li key={title}><Icon size={30} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>
      <section className={styles.exploration} aria-labelledby="exploration-title">
        <div><small>Exploración de proyecto · Vista conceptual</small><h2 id="exploration-title">Aventura en islas flotantes</h2><p>Exploración, plataformas y retos en un mundo fantástico de estilo propio.</p></div>
        {['islas', 'cueva', 'portal'].map((art, index) => <Image key={art} src={`/images/services/videojuegos/${art}.webp`} alt={`Vista conceptual: ${['islas con cascadas y ruinas', 'cueva de cristales luminosos', 'plataforma y portal sobre el vacío'][index]}.`} width={420} height={240} />)}
      </section>
      <section className={styles.gameCta} aria-labelledby="cta-title"><div><h2 id="cta-title">Definamos juntos el alcance de tu juego.</h2><p>Las plataformas, el estilo y la complejidad se acuerdan al cotizar.</p></div><Link href="/contacto" className="btn btn-primary"><Gamepad2 size={22} aria-hidden="true" /> Diseñemos la experiencia <ArrowRight size={18} aria-hidden="true" /></Link></section>
    </div>
  );
}
