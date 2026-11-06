import type React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Info, MessageCircle } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { SERVICE_CATEGORIES, serviceCategory } from '@/data/serviceCategories';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ProjectImage } from '@/components/ProjectImage';
import { HomeClosing } from '@/components/home/HomeClosing';
import { CUSTOM_LAYOUTS } from '@/components/services/layouts';
import styles from './category.module.css';

type Props = { params: Promise<{ categoria: string }> };

export const generateStaticParams = () => SERVICE_CATEGORIES.map(({ slug }) => ({ categoria: slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = serviceCategory((await params).categoria);
  if (!category) return {};
  return pageMetadata(`/servicios/${category.slug}`, { title: category.metaTitle, description: category.metaDescription });
}

export default async function ServiceCategoryPage({ params }: Props) {
  const category = serviceCategory((await params).categoria);
  if (!category) notFound();
  const Custom = CUSTOM_LAYOUTS[category.slug];
  if (Custom) {
    return (
      <SitePage offsetHeader={false} footer={<HomeClosing />}>
        <article className={styles.page}><Custom category={category} /></article>
      </SitePage>
    );
  }
  const { hero, offers, flow, concept, plans, references, process, cta, icon: Icon } = category;
  const projects = references ? FEATURED_PROJECTS.filter(project => references.projectIds.includes(project.id)) : [];

  return (
    <SitePage offsetHeader={false} footer={<HomeClosing />}>
      <article className={styles.page}>
        <div className="container">
          <div className={styles.topbar}>
            <nav aria-label="Ruta de navegación" className={styles.crumbs}>
              <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
              <Link href="/servicios">Servicios</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{category.label}</span>
            </nav>
            <Link href="/servicios#categorias" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> Volver a servicios</Link>
          </div>

          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.badge}><Icon size={20} aria-hidden="true" /> {hero.badge ?? category.label}</p>
              <h1>{hero.title} <span className="text-gradient">{hero.highlight}</span>{hero.titleEnd && <> {hero.titleEnd}</>}</h1>
              <p className={styles.lead}>{hero.lead}</p>
              <div className={styles.actions}>
                <Link href="/contacto" className="btn btn-primary">{hero.cta} <ArrowRight size={18} aria-hidden="true" /></Link>
                {hero.secondary && <Link href={hero.secondary.href} className="btn btn-secondary">{hero.secondary.label}</Link>}
              </div>
              {hero.chips && <ul className={styles.chips}>{hero.chips.map(chip => <li key={chip}>{chip}</li>)}</ul>}
            </div>
            {/* 3D stage: the art leans and floats; TiltEffect turns the stage toward the pointer. */}
            <div className={styles.heroStage} data-art-3d="hero" data-tilt="" aria-hidden="true">
              <Image src={`/images/services/${category.slug}-hero.webp`} alt="" width={1100} height={560} priority className={styles.heroArt} />
            </div>
          </header>

          <section aria-labelledby="offers-title" className={styles.offers}>
            <div className={styles.offersIntro}>
              <h2 id="offers-title">{offers.title}</h2>
              {offers.lead && <p>{offers.lead}</p>}
            </div>
            <ul className={styles.offerGrid} style={{ '--cols': offers.items.length } as React.CSSProperties}>
              {offers.items.map(({ icon: ItemIcon, title, text }) => (
                <li key={title}><ItemIcon size={30} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>
              ))}
            </ul>
          </section>

          {flow && (
            <section aria-labelledby="flow-title" className={styles.flow}>
              <h2 id="flow-title">{flow.title}</h2>
              <p>{flow.lead}</p>
              <ol className={styles.flowSteps}>
                {flow.steps.map(({ icon: StepIcon, title, text }) => (
                  <li key={title}><span className={styles.flowNode}><StepIcon size={26} strokeWidth={1.6} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></li>
                ))}
              </ol>
            </section>
          )}

          <section aria-labelledby="concept-title" className={styles.concept}>
            <div className={styles.conceptCopy}>
              <p className={styles.pill}>Vista conceptual</p>
              <h2 id="concept-title">{concept.title}</h2>
              <p>{concept.text}</p>
            </div>
            <div className={styles.conceptStage} data-art-3d="concept" data-tilt="">
              <Image src={`/images/services/${category.slug}-concept.webp`} alt={concept.alt} width={1300} height={420} sizes="(max-width: 900px) 92vw, 760px" className={styles.conceptArt} />
            </div>
          </section>

          <section aria-labelledby="plans-title" className={styles.plans}>
            <div className={styles.sectionHead}>
              <h2 id="plans-title">{plans.title}</h2>
              <p>{plans.lead}</p>
            </div>
            <div className={styles.planGrid}>
              {plans.items.map(({ icon: PlanIcon, ...plan }) => (
                <article key={plan.name} className={styles.plan} data-featured={plan.featured || undefined}>
                  <div className={styles.planHead}>
                    <PlanIcon size={30} strokeWidth={1.6} aria-hidden="true" />
                    <div>
                      {plan.eyebrow && <p className={styles.planEyebrow}>{plan.eyebrow}</p>}
                      <h3>{plan.name}</h3>
                    </div>
                    {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
                  </div>
                  <p className={styles.planSummary}>{plan.summary}</p>
                  <p className={styles.planLabel}>{plan.scopeLabel ?? 'Alcance'}:</p>
                  <ul>{plan.scope.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
                  {plan.modes && (
                    <div className={styles.modes}>
                      <p className={styles.planLabel}>Modalidades de contratación:</p>
                      {plan.modes.map(mode => <p key={mode.title}><strong>{mode.title}</strong> {mode.text}</p>)}
                    </div>
                  )}
                  {plan.billing && <p className={styles.billing}><span>Tipo de facturación</span> {plan.billing}</p>}
                  <p className={styles.price}>Por cotizar</p>
                </article>
              ))}
            </div>
            <ul className={styles.notes}>
              {plans.notes.map(note => <li key={note}><Info size={16} aria-hidden="true" />{note}</li>)}
            </ul>
          </section>

          {references && projects.length > 0 && (
            <section aria-labelledby="references-title" className={styles.references}>
              <div className={styles.sectionHead}>
                <h2 id="references-title">{references.title}</h2>
                <p>{references.lead}</p>
              </div>
              {projects.map(project => (
                <article key={project.id} className={styles.reference}>
                  <div className={styles.referenceImage}><ProjectImage src={project.image} alt={project.title} fill sizes="(max-width: 760px) 90vw, 520px" /></div>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.authors && <p className={styles.note}>Autoría: {project.authors.map(author => author.name).join(' · ')}</p>}
                    <Link href={`/proyectos#${project.id}`} className="btn btn-secondary">Ver proyecto <ArrowRight size={18} aria-hidden="true" /></Link>
                  </div>
                </article>
              ))}
            </section>
          )}

          <section aria-labelledby="process-title" className={styles.process}>
            <div className={styles.sectionHead}>
              <h2 id="process-title">{process.title}</h2>
              <p>{process.lead}</p>
            </div>
            <ol className={styles.steps}>
              {process.steps.map(({ icon: StepIcon, title, text }, index) => (
                <li key={title}>
                  <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                  <StepIcon size={26} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="cta-title" className={styles.cta}>
            <MessageCircle size={40} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h2 id="cta-title">{cta.title}</h2>
              <p>{cta.text}</p>
            </div>
            <Link href="/contacto" className="btn btn-primary">{cta.button} <ArrowRight size={18} aria-hidden="true" /></Link>
          </section>
        </div>
      </article>
    </SitePage>
  );
}
