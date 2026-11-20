'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroScene } from './home/HeroScene';
import { selectDemo, useDemoSelection } from './home/demoSelection';
import styles from './home/Home.module.css';

const tabs = [['la-lupe', 'Restaurantes'], ['emisoras-latinas', 'Streaming'], ['calculadora-de-contenedores', 'Logística']];
const solutions = [
  {
    slug: 'restaurantes', title: 'Web para restaurantes',
    audience: 'Restaurantes que necesitan mostrar su carta y recibir consultas de clientes.',
    problem: 'Una carta difícil de encontrar y pedidos o consultas dispersos entre varios canales.',
    features: ['Carta digital con platos y precios', 'Sedes, horarios y contacto por WhatsApp', 'Pedidos, cocina e inventario según el alcance'],
  },
  {
    slug: 'ecommerce', title: 'Tiendas virtuales',
    audience: 'Negocios que quieren mostrar sus productos y vender por internet.',
    problem: 'Catálogos desactualizados y pedidos que se gestionan de forma manual.',
    features: ['Catálogo organizado por categorías', 'Carrito y medios de pago según el alcance', 'Gestión de productos, pedidos e inventario'],
  },
  {
    slug: 'automatizacion', title: 'Software a medida y automatización',
    audience: 'Equipos que necesitan organizar su operación y conectar sus herramientas.',
    problem: 'Tareas repetitivas e información repartida entre archivos y aplicaciones.',
    features: ['Sistemas de gestión con roles y reportes', 'Integración de herramientas y datos', 'Flujos automáticos con reglas de tu negocio'],
  },
];

export function Hero() {
  const selected = useDemoSelection();
  function choose(id: string) {
    selectDemo(id);
    // 'auto' would inherit the page's CSS smooth scrolling, so reduced motion asks for an instant jump.
    document.getElementById('demos')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section id="inicio" className={styles.hero}>
    <div className={`container ${styles.heroStage}`}>
      <div className={styles.heroCopy}>
        <h1>Tu negocio puede vender más y trabajar mejor con <span className="text-gradient">el software adecuado</span></h1>
        <p>Creamos páginas web, tiendas y plataformas a medida para negocios que necesitan recibir clientes, organizar su operación y automatizar tareas</p>
        <div className={styles.heroActions}><Link className="btn btn-primary" href="/contacto">Cotizar mi proyecto <ArrowRight size={20} aria-hidden="true" /></Link><Link className="btn btn-secondary" href="/proyectos">Ver proyectos reales</Link></div>
      </div>
      <HeroScene />
      <div className={styles.explore}><span>01 / EXPLORA</span><div className={styles.tabs} role="group" aria-label="Explorar demos interactivas">{tabs.map(([id, label]) => <button key={id} type="button" data-demo-tab={id} aria-controls={`demo-${id}`} aria-pressed={selected === id} onClick={() => choose(id)}>{label}</button>)}</div></div>
    </div>
    <section id="soluciones" className={`container ${styles.solutions}`} aria-labelledby="soluciones-title">
      <h2 id="soluciones-title">¿Qué necesita tu negocio?</h2>
      <p className={styles.solutionsLead}>Tres formas de empezar. Definimos las funcionalidades según tu operación y el alcance acordado.</p>
      <div className={styles.solutionGrid}>{solutions.map(solution => <article key={solution.slug} data-home-solution={solution.slug} className={styles.solutionCard}>
        <h3>{solution.title}</h3>
        <p><strong>Para quién:</strong> {solution.audience}</p>
        <p><strong>Qué resuelve:</strong> {solution.problem}</p>
        <ul aria-label={`Funcionalidades de ${solution.title}`}>{solution.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        <div className={styles.solutionActions}>
          <Link className="btn btn-primary" href={`/contacto?servicio=${solution.slug}`}>Cotizar esta solución <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href={`/servicios/${solution.slug}`}>Ver servicio</Link>
        </div>
      </article>)}</div>
      <Link className={styles.allServices} href="/servicios">Ver todos los servicios <ArrowRight size={18} aria-hidden="true" /></Link>
    </section>
    <ul className={styles.stats} data-home-stats="" aria-label="Experiencia que puedes revisar">
      <li><Link href="/proyectos#equipo-la-lupe"><strong>La Lupe</strong><span>Web y carta de restaurante</span></Link></li>
      <li><Link href="/proyectos#equipo-emisoras-latinas"><strong>Emisoras Latinas</strong><span>Plataforma de radio del portafolio</span></Link></li>
      <li><Link href="/equipo"><strong>Conoce al equipo</strong><span>Participación y portafolios</span></Link></li>
    </ul>
  </section>;
}
