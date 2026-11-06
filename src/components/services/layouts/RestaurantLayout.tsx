import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Code2, MessageCircle, Target, ShieldCheck } from 'lucide-react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import { FEATURED_PROJECTS } from '@/data/content';
import { ProjectImage } from '@/components/ProjectImage';
import { SectorNav } from './SectorNav';
import { CategoryPlans } from './CategoryPlans';
import styles from './CustomLayouts.module.css';

const starts = [
  ['Presencia digital', 'Plan básico', 'Página web con carta, esencia, sedes y contacto.', 'Cotizar mi web', 'web'],
  ['Ventas en línea', 'Plan medio', 'Web, panel administrativo y pasarela de pagos en línea.', 'Explorar ventas online', 'ventas'],
  ['Operación integral', 'Plan completo', 'Pedidos, cocina y bar, caja, administración e inventarios.', 'Ver módulos', 'operacion'],
];
const steps = [
  { icon: MessageCircle, title: 'Escuchamos', text: 'a tu equipo' },
  { icon: Target, title: 'Definimos', text: 'el alcance' },
  { icon: Code2, title: 'Configuramos', text: 'o desarrollamos' },
  { icon: ShieldCheck, title: 'Probamos', text: 'en tu flujo' },
];

export function RestaurantLayout({ category }: { category: ServiceCategory }) {
  const project = FEATURED_PROJECTS.find(item => item.id === 'equipo-la-lupe');
  return (
    <div className={`${styles.root} ${styles.restaurant} container`}>
      <SectorNav slug={category.slug} label={category.label} />
      <header className={styles.restaurantHero}>
        <h1>Tu restaurante funciona mejor cuando <span>todo está conectado.</span></h1>
        <p>De la carta al cierre de caja, una experiencia para clientes y equipo.</p>
        <div className={styles.heroStage} data-art-3d="hero" data-tilt="">
          <Image src="/images/services/restaurantes/hero-ai.webp" alt="Vista conceptual del mockup actualizado: mesa 04 y paneles conectados de pedido, cocina y caja." width={2708} height={764} sizes="(max-width: 700px) 94vw, 1040px" priority />
        </div>
        <p className={styles.connected}>Una mesa. Todo conectado.</p>
        <div className={styles.actions}>
          <Link href="#soluciones" className="btn btn-primary">Explorar soluciones <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="#sistema" className="btn btn-secondary">Ver sistema completo</Link>
        </div>
        <p className={styles.caption}>Vista conceptual</p>
      </header>
      <section id="soluciones" aria-labelledby="starts-title" className={styles.section}>
        <h2 id="starts-title">Elige el <span>punto de partida</span> de tu restaurante.</h2>
        <div className={styles.startList}>
          {starts.map(([title, badge, text, cta, art], index) => (
            <article key={title} className={styles.startCard} data-tilt="">
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div><h3>{title} <small>{badge}</small></h3><p>{text}</p><Link href={index === 2 ? '#sistema' : '/contacto'} className={styles.outline}>{cta} <ArrowRight size={16} aria-hidden="true" /></Link></div>
              <Image src={`/images/services/restaurantes/${art}-ai.webp`} alt={`Vista conceptual de ${title.toLowerCase()}, conservada del mockup actualizado.`} width={948} height={index === 2 ? 336 : 324} sizes="(max-width: 700px) 75vw, 360px" />
            </article>
          ))}
        </div>
      </section>
      <section id="sistema" aria-labelledby="flow-title" className={styles.section}>
        <h2 id="flow-title">Del pedido al cierre, <span>sin perder el hilo.</span></h2>
        <ol className={styles.flow}>
          {category.flow?.steps.map(({ icon: Icon, title }) => <li key={title}><span><Icon size={26} aria-hidden="true" /></span><h3>{title}</h3></li>)}
        </ol>
        <div className={styles.artStage} data-art-3d="pos" data-tilt="">
          <Image src="/images/services/restaurantes/pos-ai.webp" alt={category.concept.alt} width={2752} height={1368} sizes="(max-width: 800px) 94vw, 1100px" />
        </div>
        <p className={styles.caption}>Vista conceptual</p>
      </section>
      <CategoryPlans plans={category.plans} />
      <section aria-labelledby="modes-title" className={styles.section}>
        <h2 id="modes-title">El sistema completo, <span>a tu manera.</span></h2>
        <div className={styles.modes}>
          {[{ icon: CalendarDays, title: 'Suscripción', text: 'Acceso a la plataforma con cuota recurrente. Alcance por definir.' }, { icon: Code2, title: 'Desarrollo personalizado · pago único', text: 'Adaptado a tu operación. Infraestructura y mantenimiento se cotizan según alcance.' }].map(({ icon: Icon, title, text }) => (
            <Link href="/contacto" key={title} className={styles.mode}><Icon size={30} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={20} aria-hidden="true" /></Link>
          ))}
        </div>
      </section>
      <section aria-labelledby="process-title" className={styles.section}>
        <h2 id="process-title">Primero conocemos <span>tu operación.</span></h2>
        <ol className={styles.steps}>{steps.map(({ icon: Icon, title, text }) => <li key={title}><Icon size={30} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>
      {project && <section className={styles.reference} aria-labelledby="lupe-title">
        <div><h2 id="lupe-title">La Lupe</h2><p>Un restaurante de comida mexicana con presencia digital alineada a su esencia: carta, sedes y contacto, en una experiencia clara y atractiva.</p><Link href="/contacto" className="btn btn-primary">Hablemos de cómo trabaja tu restaurante. <ArrowRight size={18} aria-hidden="true" /></Link><Link href={`/proyectos#${project.id}`} className={styles.projectLink}>Ver proyecto real: La Lupe <ArrowRight size={16} aria-hidden="true" /></Link></div>
        <div className={styles.referenceImage}><ProjectImage src={project.image} alt={project.title} fill sizes="(max-width: 760px) 90vw, 520px" /></div>
      </section>}
    </div>
  );
}
