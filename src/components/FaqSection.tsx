import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/data/faq';
import styles from './FaqSection.module.css';

// Mirrors the visible questions so search engines can show them as rich results.
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

/** Native details/summary accordion: works with keyboard and without JavaScript. */
export function FaqSection() {
  return (
    <section id="preguntas-frecuentes" className={styles.section} aria-labelledby="faq-title">
      <div className="container">
        <h2 id="faq-title" className="section-title">Preguntas frecuentes</h2>
        <p className="section-subtitle">Lo que suelen preguntarnos antes de empezar un proyecto.</p>
        <div className={styles.list}>
          {FAQ.map(({ question, answer }) => (
            <details key={question} className={styles.item}>
              <summary>{question}<ChevronDown size={18} aria-hidden="true" className={styles.icon} /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA).replace(/</g, '\\u003c') }}
      />
    </section>
  );
}
