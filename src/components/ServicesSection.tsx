import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/content';
import styles from './services/Services.module.css';

// Illustrations are decorative diagrams, not screenshots or additional service claims.
const ART: Record<string, string> = {
  'desarrollo-web': 'web',
  'bases-de-datos': 'data',
  'cloud-devops': 'cloud',
  'aplicaciones-moviles': 'apps',
  'business-intelligence': 'data',
  'seguridad-mantenimiento': 'cloud',
  videojuegos: 'apps',
  automatizacion: 'apps',
  'plataformas-conectadas': 'web',
};

export function ServicesSection() {
  return (
    <section id="servicios" className={styles.section}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Tecnología que resuelve. Software <span className="text-gradient">que crece contigo.</span></h1>
            <p>Creamos soluciones de software reales, escalables y a la medida, que convierten tus ideas en herramientas que funcionan, optimizan procesos y abren nuevas oportunidades de crecimiento.</p>
            <div className={styles.actions}>
              <Link href="/contacto" className="btn btn-primary">Conversemos sobre tu proyecto <ArrowRight size={20} aria-hidden="true" /></Link>
              <Link href="/planes" className="btn btn-secondary">Ver planes</Link>
            </div>
          </div>
          <Image src="/images/mockup/services-tree.webp" alt="" aria-hidden="true" width={1252} height={798} priority className={styles.tree} />
        </div>

        <p className={styles.eyebrow}>02 / SERVICIOS</p>
        <div className={styles.grid}>
          {SERVICES.map((service, index) => (
            <article key={service.id} id={`servicio-${service.id}`} data-service={service.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.cardCopy}>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{service.title}</h2>
                  <p>{service.items[0]}</p>
                </div>
                <Image src={`/images/mockup/service-${ART[service.id] ?? 'apps'}.webp`} alt="" aria-hidden="true" width={576} height={412} className={styles.cardArt} />
              </div>
              <details className={styles.details}>
                <summary>Conocer más <ArrowRight size={18} aria-hidden="true" /></summary>
                <ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
