'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FEATURED_PROJECTS, TECHNOLOGIES } from '@/data/content';
import { TEAM_MEMBERS } from '@/data/team';
import { selectDemo, useDemoSelection } from './home/demoSelection';
import styles from './home/Home.module.css';

const tabs = [['la-lupe', 'Restaurantes'], ['emisoras-latinas', 'Streaming'], ['calculadora-de-contenedores', 'Logística']];
export function Hero() {
  const selected = useDemoSelection();
  function choose(id: string) {
    selectDemo(id);
    document.getElementById('demos')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  return <section id="inicio" className={styles.hero}>
    <div className={`container ${styles.heroStage}`}>
      <Image src="/images/mockup/home-hero.webp" alt="" aria-hidden="true" width={1316} height={872} priority className={styles.heroArt} />
      <div className={styles.heroCopy}>
        <h1>Tu próxima idea merece cobrar <span className="text-gradient">vida.</span></h1>
        <p>Desarrollamos software a la medida para restaurantes, medios de streaming, logística y más, convirtiendo tus ideas en soluciones reales, funcionales y escalables.</p>
        <div className={styles.heroActions}><Link className="btn btn-primary" href="/contacto">Construyamos tu proyecto <ArrowRight size={20} /></Link><Link className="btn btn-secondary" href="#demos">Explorar demos</Link></div>
      </div>
      <div className={styles.explore}><span>01 / EXPLORA</span><div className={styles.tabs} role="group" aria-label="Explorar soluciones">{tabs.map(([id, label]) => <button key={id} data-demo-tab={id} aria-controls={`demo-${id}`} aria-pressed={selected === id} onClick={() => choose(id)}>{label}</button>)}</div></div>
    </div>
    <ul className={styles.stats} data-home-stats="">
      <li><Link href="/proyectos"><strong>{FEATURED_PROJECTS.length}</strong> proyectos</Link></li>
      <li><Link href="/servicios"><strong>{TECHNOLOGIES.length}</strong> tecnologías</Link></li>
      <li><Link href="/equipo"><strong>{TEAM_MEMBERS.length}</strong> desarrolladores</Link></li>
    </ul>
  </section>;
}
