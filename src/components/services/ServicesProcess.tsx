import { Search, Pencil, Code, Rocket } from 'lucide-react';
import styles from './Services.module.css';

import { PROCESS_STEPS } from '@/data/content';
const ICONS = [Search, Pencil, Code, Rocket];
const STEPS = PROCESS_STEPS.map((step, index) => ({ ...step, Icon: ICONS[index] }));

export function ServicesProcess() {
  return (
    <section id="proceso-servicios" className={styles.process} aria-labelledby="services-process-title">
      <div className={`container ${styles.processLayout}`}>
        <h2 id="services-process-title">Nuestro proceso <span className="text-gradient">de trabajo</span></h2>
        <ol className={styles.steps}>
          {STEPS.map(({ title, description, Icon }) => (
            <li key={title} className={styles.step}>
              <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
