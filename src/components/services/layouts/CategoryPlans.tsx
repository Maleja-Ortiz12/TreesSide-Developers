import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import styles from './CustomLayouts.module.css';

/** The original mockup's commercial scope, rendered without rasterized text. */
export function CategoryPlans({ plans }: { plans: ServiceCategory['plans'] }) {
  return (
    <section id="planes" aria-labelledby="plans-title" className={styles.section}>
      <h2 id="plans-title">{plans.title}</h2>
      <p className={styles.plansLead}>{plans.lead}</p>
      <div className={styles.planGrid}>
        {plans.items.map(({ icon: Icon, ...plan }) => (
          <article key={plan.name} className={styles.planCard} data-featured={plan.featured || undefined} data-tilt="">
            <div className={styles.planHeading}><Icon size={30} aria-hidden="true" /><div>{plan.eyebrow && <small>{plan.eyebrow}</small>}<h3>{plan.name}</h3></div></div>
            {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
            <p>{plan.summary}</p>
            <strong>{plan.scopeLabel ?? 'Incluye'}</strong>
            <ul>{plan.scope.map(item => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            {plan.modes && <div className={styles.planModes}><strong>Modalidades de contratación</strong>{plan.modes.map(mode => <p key={mode.title}><strong>{mode.title}</strong><br />{mode.text}</p>)}</div>}
            {plan.billing && <p>Tipo de facturación: {plan.billing}</p>}
            <Link href="/contacto" className={styles.planQuote} aria-label={`Cotizar ${plan.name}`}>Por cotizar <ArrowRight size={17} aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
      <ul className={styles.planNotes}>{plans.notes.map(note => <li key={note}><Info size={16} aria-hidden="true" /><span>{note}</span></li>)}</ul>
    </section>
  );
}
