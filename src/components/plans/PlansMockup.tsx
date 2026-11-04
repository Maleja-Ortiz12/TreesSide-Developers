import Image from 'next/image';
import { ArrowDown, ArrowRight, Check, Minus } from 'lucide-react';
import { COMMERCIAL_PLANS, formatPlanPrice, type CommercialPlan } from '@/data/plans';
import styles from './PlansMockup.module.css';

const SUMMARIES: Record<string, string> = {
  'impulso-web': 'Sitio informativo adaptable y contacto.',
  'catalogo-administrable': 'Catálogo y panel de productos.',
  'vende-online': 'Tienda, carrito y pasarela externa.',
  'automatiza-tu-negocio': 'Web, tienda y automatización de un proceso.',
};

// Follow the explicit inheritance in the existing catalog, not the visual order of the columns.
function includesScope(plan: CommercialPlan, scopeId: string) {
  let current: CommercialPlan | undefined = plan;
  const visited = new Set<string>();
  while (current && !visited.has(current.id)) {
    if (current.id === scopeId) return true;
    visited.add(current.id);
    current = COMMERCIAL_PLANS.find(item => item.id === current?.includesPlan);
  }
  return false;
}

export function PlansHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1 id="plans-title">Elige cómo empieza tu <span className="text-gradient">próxima idea.</span></h1>
        <p>Planes de desarrollo de software pensados para tu negocio. Elige el alcance que necesitas y llevemos tu idea a lo real.</p>
        <div className={styles.actions}>
          <a href="#comparativo-planes" className="btn btn-primary">Ver comparación de alcances <ArrowDown size={20} aria-hidden="true" /></a>
          <a href="#explorar-planes" className="btn btn-secondary">Explorar planes</a>
        </div>
      </div>
      <Image src="/images/mockup/plans-tree.webp" alt="" aria-hidden="true" width={1160} height={856} priority className={styles.tree} />
    </header>
  );
}

export function PlansOverview() {
  return (
    <div id="explorar-planes" className={styles.overview} aria-label="Planes disponibles">
      {COMMERCIAL_PLANS.map(plan => (
        <article key={plan.id} data-plan-preview={plan.id} data-featured={plan.id === 'vende-online' || undefined} className={styles.card}>
          <Image src={`/images/mockup/plan-${plan.id}.webp`} alt="" aria-hidden="true" width={396} height={210} className={styles.laptop} />
          <h2>{plan.name}</h2>
          <p className={styles.summary}>{SUMMARIES[plan.id] ?? plan.outcome}</p>
          <p className={styles.price}><span>Desde</span><strong>{formatPlanPrice(plan.price)} <small>COP</small></strong></p>
          <p className={styles.frequency}>Implementación · pago único</p>
          <a href={`#${plan.id}`} className={`btn ${plan.id === 'vende-online' ? 'btn-primary' : 'btn-secondary'} ${styles.scopeLink}`}>Ver alcance <ArrowRight size={18} aria-hidden="true" /></a>
        </article>
      ))}
    </div>
  );
}

export function PlansComparison() {
  return (
    <div id="comparativo-planes" className={styles.comparison}>
      <div className={styles.tableScroll} role="region" aria-label="Comparativo de alcances; desplazamiento horizontal en pantallas pequeñas" tabIndex={0}>
        <table data-plans-comparison="" className={styles.table}>
          <caption>Comparativo de <span className="text-gradient">alcances</span></caption>
          <thead><tr><th scope="col">Alcance</th>{COMMERCIAL_PLANS.map(plan => <th key={plan.id} scope="col">{plan.name}</th>)}</tr></thead>
          <tbody>
            {COMMERCIAL_PLANS.map(scope => (
              <tr key={scope.id} data-scope-row={scope.id}>
                <th scope="row">{SUMMARIES[scope.id] ?? scope.outcome}</th>
                {COMMERCIAL_PLANS.map(plan => {
                  const included = includesScope(plan, scope.id);
                  return <td key={plan.id} data-included={included}>
                    {included ? <Check size={18} aria-hidden="true" className={styles.check} /> : <Minus size={18} aria-hidden="true" className={styles.minus} />}
                    <span className={styles.srOnly}>{included ? 'Incluido' : 'No incluido'}</span>
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.comparisonNote}>Valores desde. El alcance y el precio final se confirman por escrito.</p>
    </div>
  );
}
