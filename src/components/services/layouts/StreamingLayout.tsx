import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Radio, Settings } from 'lucide-react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import { SectorNav } from './SectorNav';
import styles from './StreamingLayout.module.css';

/** Streaming page following its updated mockup; the shared HomeClosing footer comes from the parent SitePage. */
export function StreamingLayout({ category }: { category: ServiceCategory }) {
  const { hero, offers, concept, plans, process, cta } = category;
  const [support, external] = plans.notes;
  const [supportLabel, supportText] = support.split(/:\s/);
  return (
    <div className={`${styles.root} container`}>
      <SectorNav slug={category.slug} label={category.label} />
      <header className={styles.hero} aria-labelledby="streaming-title">
        <div className={styles.heroCopy}>
          {/* One sentence per line, as drawn in the mockup. */}
          <h1 id="streaming-title">{(hero.title.match(/[^.]+\./g) ?? []).map(line => <span key={line}>{`${line.trim()} `}</span>)}<span className={styles.highlight}>{hero.highlight}</span></h1>
          <p className={styles.lead}>{hero.lead}</p>
        </div>
        <div className={styles.heroStage} data-art-3d="hero" data-tilt="">
          <Image src="/images/services/streaming/hero-ai.webp" alt="Micrófono de estudio con ondas de audio junto a un reproductor de video en vivo." width={2160} height={992} sizes="(max-width: 800px) 94vw, 640px" priority />
        </div>
      </header>

      <section id="capacidades" aria-labelledby="capacidades-title" className={styles.section}>
        <h2 id="capacidades-title" className={styles.underlined}>{offers.title}</h2>
        <ul className={styles.capabilities}>
          {offers.items.map(({ icon: Icon, title }) => <li key={title}><Icon size={30} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3></li>)}
        </ul>
      </section>

      <section id="vista-conceptual" aria-labelledby="vista-conceptual-title" className={styles.concept}>
        <div className={styles.artStage} data-art-3d="concept" data-tilt="">
          <Image src="/images/services/streaming/concept-ai.webp" alt={concept.alt} width={2772} height={1328} sizes="(max-width: 900px) 94vw, 760px" />
        </div>
        <div className={styles.conceptCopy}>
          <h2 id="vista-conceptual-title" className={styles.pill}>{concept.title}</h2>
          <p>{concept.text}</p>
        </div>
      </section>

      <section id="planes" aria-labelledby="planes-title" className={styles.section}>
        <h2 id="planes-title" className={styles.trailing}>{plans.title}</h2>
        <div className={styles.planGrid}>
          {plans.items.map(({ icon: Icon, name, summary, billing }, index) => (
            <article key={name} className={styles.plan} data-tilt="">
              <div className={styles.planHead}><Icon size={34} strokeWidth={1.6} aria-hidden="true" /><h3 id={`plan-${index}`}>{name}</h3></div>
              <p>{summary}</p>
              <div className={styles.price}>
                <span>{billing}</span>
                <Link href="/contacto" aria-describedby={`plan-${index}`}>Por cotizar</Link>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.support}><Settings size={26} aria-hidden="true" /><span><strong>{supportLabel}:</strong> {supportText}</span></p>
        <p className={styles.external}>{external}</p>
      </section>

      <section id="proceso" aria-labelledby="proceso-title" className={styles.section}>
        <h2 id="proceso-title" className={styles.trailing}>{process.title}</h2>
        <ol className={styles.steps}>
          {process.steps.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <div className={styles.stepHead}><Icon size={30} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3></div>
              <p>{text}</p>
              <ArrowRight className={styles.arrow} size={22} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section id="contacto-streaming" aria-labelledby="contacto-streaming-title" className={styles.cta}>
        <h2 id="contacto-streaming-title"><Link href="/contacto"><Radio size={30} aria-hidden="true" />{cta.title}</Link></h2>
      </section>
    </div>
  );
}
