import type { ComponentType } from 'react';
import Link from 'next/link';
import { Scissors, Package, UtensilsCrossed, Radio, Boxes, Grid3x3, ArrowRight, type LucideIcon } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { BookingDemo } from './demos/BookingDemo';
import { InventoryDemo } from './demos/InventoryDemo';
import { MenuQuoteDemo } from './demos/MenuQuoteDemo';
import { RadioDemo } from './demos/RadioDemo';
import { LoadCalculatorDemo } from './demos/LoadCalculatorDemo';
import { BingoDemo } from './demos/BingoDemo';
import styles from './HomeDemos.module.css';

interface DemoCard {
  /** Title of the catalog project the demo imitates; authors and link come from the catalog. */
  project: string;
  title: string;
  description: string;
  canBuild: string;
  icon: LucideIcon;
  Demo: ComponentType;
}

const DEMOS: DemoCard[] = [
  {
    project: 'La Lupe', title: 'Menú y cotización', icon: UtensilsCrossed, Demo: MenuQuoteDemo,
    description: 'Arma un pedido con platos reales del restaurante y prepara la cotización que llegaría por WhatsApp.',
    canBuild: 'cartas digitales, pedidos y cotizaciones de catering para restaurantes, panaderías o eventos.',
  },
  {
    project: 'Emisoras Latinas', title: 'Radio en vivo', icon: Radio, Demo: RadioDemo,
    description: 'Filtra emisoras por país y controla el reproductor, como en el directorio de radios latinas.',
    canBuild: 'plataformas de streaming, podcasts o emisoras propias, con directorio, reproductor y SEO para crecer en visitas.',
  },
  {
    project: 'Calculadora de contenedores', title: 'Cálculo de carga', icon: Boxes, Demo: LoadCalculatorDemo,
    description: 'Elige la caja y la altura máxima y mira cuántas caben por capa en el palé, con su peso total.',
    canBuild: 'calculadoras y cotizadores para logística, construcción o manufactura, en web o en app móvil.',
  },
  {
    project: 'UptownHair', title: 'Reservas para tu salón', icon: Scissors, Demo: BookingDemo,
    description: 'Elige servicio y horario y confirma el turno, como en la app de reservas para salones de belleza.',
    canBuild: 'agendas para barberías, spas, consultorios, clases o canchas, con recordatorios y panel de turnos.',
  },
  {
    project: 'Ocho80', title: 'Bingo digital', icon: Grid3x3, Demo: BingoDemo,
    description: 'Saca balotas y mira cómo se marca el cartón hasta cantar línea y bingo, como en la plataforma de rifas y bingo.',
    canBuild: 'juegos, rifas, trivias o sorteos en tiempo real para eventos, comunidades o fundaciones.',
  },
  {
    project: 'Entre Lanas y Fragancias', title: 'Inventario que avisa', icon: Package, Demo: InventoryDemo,
    description: 'Vende y repone productos de la tienda y mira cómo se marcan las existencias bajas.',
    canBuild: 'control de stock, ventas y alertas para tiendas, bodegas o restaurantes, conectado a tu tienda en línea.',
  },
];

const slug = (name: string) =>
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function HomeDemos() {
  return (
    <section id="demos" className={styles.section} aria-labelledby="demos-title">
      <div className="container">
        <div className={styles.heading}>
          <span className="kicker">PROYECTOS REALES, EN MINIATURA</span>
          <h2 id="demos-title" className="section-title">Prueba lo que podemos construir</h2>
          <p className="section-subtitle">Cada demo es una versión pequeña de un proyecto que ya construimos. Haz clic, prueba y vuelve a empezar.</p>
          <p className={styles.disclaimer}>Simulaciones locales con datos de ejemplo. No se guardan ni se envían datos; no son reservas, ventas ni pedidos reales.</p>
        </div>
        <div className={styles.grid}>
          {DEMOS.map(({ project, title, description, canBuild, icon: Icon, Demo }, index) => {
            const source = FEATURED_PROJECTS.find(item => item.title === project);
            const href = source?.projectUrl ?? '/proyectos';
            return (
              <article key={project} className={styles.card} data-demo={slug(project)}>
                <div className={styles.chrome} aria-hidden="true"><span /><span /><span /><small>{`DEMO ${String(index + 1).padStart(2, '0')}`}</small></div>
                <div className={styles.intro}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <p className={styles.source}>
                    Basado en{' '}
                    {href.startsWith('http')
                      ? <a href={href} target="_blank" rel="noopener noreferrer">{project}</a>
                      : <Link href={href}>{project}</Link>}
                    {source?.owner && <span> · {source.owner}</span>}
                  </p>
                </div>
                <Demo />
                <p className={styles.canBuild}><strong>Podemos construir:</strong> {canBuild}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.cta}><p>¿Qué proceso de tu negocio te gustaría simplificar?</p><Link className="btn btn-primary" href="/contacto">Construyamos tu solución <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
