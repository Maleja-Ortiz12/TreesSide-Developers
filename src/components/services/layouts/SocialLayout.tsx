import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Info, MessageCircle } from 'lucide-react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import { SectorNav } from './SectorNav';
import styles from './SocialLayout.module.css';

const ART = '/images/services/redes-sociales';

/** Social media page following its updated mockup; the shared HomeClosing footer comes from the parent SitePage. */
export function SocialLayout({ category }: { category: ServiceCategory }) {
  const { hero, offers, concept, plans, process, cta } = category;
  // The mockup highlights the closing words of the CTA ("tu marca.").
  const [, ctaLead = cta.title, ctaHighlight] = cta.title.match(/^(.*)\s(tu marca\.)$/) ?? [];
  return (
    <div className={`${styles.root} container`}>
      <SectorNav slug={category.slug} label={category.label} />
      <header className={styles.hero} aria-labelledby="social-title">
        <div className={styles.heroCopy}>
          <h1 id="social-title">{hero.title} <span className={styles.highlight}>{hero.highlight}</span></h1>
          <p className={styles.lead}>{hero.lead}</p>
        </div>
        <div className={styles.heroStage} data-art-3d="hero" data-tilt="">
          <Image src={`${ART}/hero-ai.webp`} alt="Cámara, celular con una publicación y portátil con el calendario de contenido sobre un escritorio de trabajo creativo." width={1992} height={1192} sizes="(max-width: 800px) 94vw, 680px" priority />
        </div>
      </header>

      <section id="que-hacemos" aria-labelledby="que-hacemos-title" className={styles.section}>
        <h2 id="que-hacemos-title" className={styles.underlined}>{offers.title}</h2>
        <ul className={styles.offers}>
          {offers.items.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <div className={styles.offerHead}><Icon size={30} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3></div>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="vista-conceptual" aria-labelledby="vista-conceptual-caption" className={styles.concept}>
        <figure>
          <div className={styles.artStage} data-art-3d="concept" data-tilt="">
            <Image src={`${ART}/concept-ai.webp`} alt={concept.alt} width={4088} height={1232} sizes="(max-width: 1200px) 96vw, 1180px" />
          </div>
          {/* The art already shows the original pill, so the caption is for assistive technology only. */}
          <figcaption id="vista-conceptual-caption" className={styles.visuallyHidden}>{concept.title}</figcaption>
        </figure>
      </section>

      <section id="planes" aria-labelledby="planes-title" className={styles.section}>
        <h2 id="planes-title" className={styles.underlined}>{plans.title}</h2>
        <div className={styles.planGrid}>
          {plans.items.map(({ icon: Icon, name, badge, summary }, index) => (
            <article key={name} className={styles.plan} data-tilt="">
              <div className={styles.planHead}>
                <Icon size={30} strokeWidth={1.6} aria-hidden="true" />
                <h3 id={`plan-redes-${index}`}>{name}</h3>
                {badge && <span className={styles.badge}>{badge}</span>}
              </div>
              <p>{summary}</p>
              <Link href="/contacto" className={styles.quote} aria-describedby={`plan-redes-${index}`}>Por cotizar</Link>
            </article>
          ))}
        </div>
        {plans.notes.map(note => <p key={note} className={styles.note}><Info size={18} aria-hidden="true" /><span>{note}</span></p>)}
      </section>

      <section id="proceso" aria-labelledby="proceso-title" className={styles.section}>
        <h2 id="proceso-title" className={styles.underlined}>{process.title}</h2>
        <ol className={styles.steps}>
          {process.steps.map(({ icon: Icon, title }) => (
            <li key={title}>
              <div className={styles.step}><Icon size={34} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3></div>
              <ArrowRight className={styles.arrow} size={22} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section id="contacto-redes" aria-labelledby="contacto-redes-title" className={styles.cta}>
        <Image src={`${ART}/cta-left-ai.webp`} alt="" width={1080} height={568} sizes="(max-width: 700px) 46vw, 300px" className={styles.ctaLeft} />
        <div className={styles.ctaCopy}>
          <h2 id="contacto-redes-title">{ctaLead}{ctaHighlight && <> <span className={styles.highlight}>{ctaHighlight}</span></>}</h2>
          <Link href="/contacto" className={styles.ctaButton}><MessageCircle size={22} aria-hidden="true" />{cta.button}</Link>
        </div>
        <Image src={`${ART}/cta-right-ai.webp`} alt="" width={780} height={412} sizes="(max-width: 700px) 46vw, 260px" className={styles.ctaRight} />
      </section>
    </div>
  );
}
