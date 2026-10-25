import Link from 'next/link';
import { ArrowRight, Check, Minus, MessageCircle, FileText, RefreshCw, ClipboardList } from 'lucide-react';
import { COMMERCIAL_PLANS, formatPlanPrice, planWhatsAppUrl } from '@/data/plans';
import styles from './PlansSection.module.css';

function IncludedPlan({ id, preview = false }: { id?: string; preview?: boolean }) {
  const included = COMMERCIAL_PLANS.find(plan => plan.id === id);
  if (!included) return null;
  return (
    <p className={styles.inherited}>
      Incluye todo lo de <a href={`${preview ? '/planes' : ''}#${included.id}`}>{included.name}</a>
      {' y añade las funciones de este nivel.'}
    </p>
  );
}

/** Small entry point on the home and services pages; the complete scope lives at /planes. */
export function PlansPreview() {
  return (
    <section id="planes-resumen" className={styles.preview} aria-labelledby="plans-preview-title">
      <div className="container">
        <span className="kicker">UN PUNTO DE PARTIDA CLARO</span>
        <h2 id="plans-preview-title" className="section-title">Planes para poner tu negocio en marcha</h2>
        <p className="section-subtitle">Presencia digital, ventas en línea o automatización. Conoce el alcance antes de cotizar.</p>
        <div className={styles.previewGrid}>
          {COMMERCIAL_PLANS.map(plan => (
            <article key={plan.id} className={`glass-card ${styles.previewCard}`}>
              <p className={styles.line}>{plan.line}</p>
              <h3>{plan.name}</h3>
              <p className={styles.price}><span>Desde</span> <strong>{formatPlanPrice(plan.price)}</strong> <small>COP</small></p>
              <p className={styles.frequency}>Implementación · pago único</p>
              <IncludedPlan id={plan.includesPlan} preview />
              <p>{plan.outcome}</p>
              <Link href={`/planes#${plan.id}`} className={styles.details}>Ver alcance y condiciones <ArrowRight size={16} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
        <p className={styles.note}>Valores desde, antes de impuestos si aplican. El precio final se confirma por escrito según el alcance. Consulta los costos recurrentes y las exclusiones de cada plan.</p>
      </div>
    </section>
  );
}

export function PlansSection() {
  return (
    <section id="planes" className={styles.section} aria-labelledby="plans-title">
      <div className="container">
        <header className={styles.heading}>
          <span className="kicker">ALCANCE CLARO, SIN SORPRESAS</span>
          <h1 id="plans-title">Planes para tu negocio</h1>
          <p>Elige un punto de partida y revisa qué incluye, qué no incluye y qué necesitas para comenzar. Antes de contratar confirmamos contigo el alcance, el precio y el cronograma.</p>
          <div className={styles.notice}>
            <FileText size={20} aria-hidden="true" />
            <p>Los valores se expresan en pesos colombianos (COP), antes de impuestos si aplican. Son precios iniciales de implementación, no mensualidades ni una compra automática. <strong>El precio final se confirma por escrito</strong> después de revisar tu proyecto.</p>
          </div>
          <nav className={styles.jumpLinks} aria-label="Ir al detalle de un plan">
            {COMMERCIAL_PLANS.map(plan => <a key={plan.id} href={`#${plan.id}`}>{plan.name}<ArrowRight size={14} aria-hidden="true" /></a>)}
          </nav>
        </header>

        <div className={styles.planList}>
          {COMMERCIAL_PLANS.map((plan, index) => (
            <article key={plan.id} id={plan.id} data-plan={plan.id} className={styles.plan}>
              <div className={styles.planHeader}>
                <div>
                  <span className={styles.line}>{`0${index + 1} / ${plan.line}`}</span>
                  <h2>{plan.name}</h2>
                  <p>{plan.audience}</p>
                </div>
                <div className={styles.priceBlock}>
                  <p className={styles.price}><span>Desde</span> <strong>{formatPlanPrice(plan.price)}</strong> <small>COP</small></p>
                  <p className={styles.frequency}>Implementación · pago único</p>
                  <p className={styles.tax}>Antes de impuestos si aplican</p>
                </div>
              </div>
              <IncludedPlan id={plan.includesPlan} />
              <p className={styles.outcome}>{plan.outcome}</p>
              <div className={styles.scopeGrid}>
                <div className={styles.scope}>
                  <h3><Check size={19} aria-hidden="true" />Qué incluye</h3>
                  <ul>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className={`${styles.scope} ${styles.excluded}`}>
                  <h3><Minus size={19} aria-hidden="true" />No incluye</h3>
                  <ul>{plan.excludes.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className={styles.scope}>
                  <h3><RefreshCw size={18} aria-hidden="true" />Costos recurrentes</h3>
                  <ul>{plan.recurring.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className={styles.scope}>
                  <h3><ClipboardList size={18} aria-hidden="true" />Qué necesitamos de ti</h3>
                  <ul>{plan.requirements.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
              <div className={styles.delivery}>
                <h3>Entrega y alcance</h3>
                <p>{plan.delivery}</p>
              </div>
              <div className={styles.planCta}>
                <a href={planWhatsAppUrl(plan)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" aria-label={`Cotizar ${plan.name} por WhatsApp`}>
                  <MessageCircle size={18} aria-hidden="true" />Cotizar este plan
                </a>
                <Link href="/contacto" className={styles.details}>Prefiero el formulario o correo <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.conditions} aria-labelledby="plans-conditions-title">
          <h2 id="plans-conditions-title">Antes de comenzar</h2>
          <ul>
            <li>La propuesta define entregables, responsables, criterios de aceptación, pagos por etapas y condiciones de propiedad del código y las cuentas.</li>
            <li>El plazo se acuerda según el alcance y la disponibilidad de contenidos, accesos y aprobaciones. No prometemos una fecha sin revisar el proyecto.</li>
            <li>Los dominios y servicios se eligen según disponibilidad, capacidad y condiciones del proveedor. Las renovaciones se informan en la cotización.</li>
            <li>No incluyen comisiones de pasarelas de pago, campañas, producción de contenido ni consumos externos no indicados expresamente como incluidos.</li>
            <li>Los planes son acumulativos: cada nivel identifica el anterior que incluye y amplía sus funciones. El catálogo de la tienda no tiene un tope fijo de productos; su cantidad, variantes y carga inicial influyen en el precio final.</li>
            <li>Nuevas páginas, integraciones y cambios de alcance se cotizan antes de ejecutarlos. El soporte y mantenimiento posterior se acuerdan por separado.</li>
            <li>El SEO técnico inicial no garantiza posiciones en buscadores, ventas ni resultados comerciales.</li>
          </ul>
          <p>¿Necesitas una plataforma a medida, una app o una integración más compleja? <Link href="/contacto">Cuéntanos qué necesitas</Link> y preparamos una propuesta específica.</p>
        </aside>
      </div>
    </section>
  );
}
