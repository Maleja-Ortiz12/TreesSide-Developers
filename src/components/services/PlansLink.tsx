import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';
import styles from './PlansLink.module.css';

/** Plans live only on /planes; every service page points there from the same short block. */
export function PlansLink() {
  return (
    <section id="ver-planes" aria-labelledby="ver-planes-title" className={styles.block} data-plans-link="">
      <ListChecks className={styles.icon} size={36} strokeWidth={1.6} aria-hidden="true" />
      <div className={styles.copy}>
        <h2 id="ver-planes-title">¿Buscas un plan?</h2>
        <p>Conoce nuestros planes con precios, alcance y condiciones en una sola página.</p>
      </div>
      <Link href="/planes" className="btn btn-secondary">Ver planes <ArrowRight size={18} aria-hidden="true" /></Link>
    </section>
  );
}
