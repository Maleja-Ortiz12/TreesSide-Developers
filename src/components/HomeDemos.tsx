'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { enquiryHref } from '@/lib/enquiry';
import { MenuQuoteDemo } from './demos/MenuQuoteDemo';
import { RadioDemo } from './demos/RadioDemo';
import { LoadCalculatorDemo } from './demos/LoadCalculatorDemo';
import { selectDemo, useDemoSelection } from './home/demoSelection';
import styles from './home/HomeRedesign.module.css';

const demos = [
  { id: 'la-lupe', label: 'Restaurantes', kind: 'Menú de restaurante', service: 'restaurantes', slug: 'restaurante', Demo: MenuQuoteDemo },
  { id: 'emisoras-latinas', label: 'Streaming', kind: 'Directorio de radio', service: 'streaming', slug: 'radio', Demo: RadioDemo },
  { id: 'calculadora-de-contenedores', label: 'Logística', kind: 'Calculadora de contenedores', service: 'logistica', slug: 'logistica', Demo: LoadCalculatorDemo },
];

export function HomeDemos() {
  const selected = useDemoSelection();
  return <section id="demos" className={styles.demos} aria-labelledby="demos-title">
    <div className={`container ${styles.demoLayout}`}>
      <div className={styles.demoIntro}>
        <h2 id="demos-title">Pruébalo antes de imaginarlo</h2>
        <p>Explora soluciones de ejemplo y descubre cómo podrían funcionar en tu negocio.</p>
        <p className={styles.demoBadge}>Demo interactiva · Datos de ejemplo</p>
        <p className={styles.note}>Esta simulación no representa funcionalidades implementadas en la web real de La Lupe.</p>
        <p className={styles.note}>No se guardan ni se envían datos; no son reservas, ventas ni pedidos reales.</p>
      </div>
      <div>
        <div className={styles.tabs} role="group" aria-label="Explorar demos interactivas">
          {demos.map(({ id, label }) => <button key={id} type="button" data-demo-tab={id} aria-controls={`demo-${id}`} aria-pressed={selected === id} onClick={() => selectDemo(id)}>{label}</button>)}
        </div>
        {demos.map(({ id, kind, service, slug, Demo }) => <article key={id} id={`demo-${id}`} data-demo={id} hidden={selected !== id} className={styles.demoPanel} aria-label={`Demo de ejemplo: ${kind}`}>
          <p className={styles.demoLabel}>{kind} · Simulación local</p>
          <Demo />
          <div className={styles.demoActions}>
            <Link href={`/servicios/${service}?servicio=${service}&demo=${slug}`}>Ver servicio</Link>
            <Link className="btn btn-primary" href={enquiryHref({ servicio: service, demo: slug })}>Quiero una solución similar <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
