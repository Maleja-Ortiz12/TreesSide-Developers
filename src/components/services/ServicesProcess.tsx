import { Search, Pencil, Code, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const STEPS = [
  { title: 'Descubrimos', description: 'Entendemos tu idea, objetivos y necesidades.', Icon: Search },
  { title: 'Diseñamos', description: 'Definimos la solución, la experiencia y la arquitectura.', Icon: Pencil },
  { title: 'Construimos', description: 'Desarrollamos con calidad, de forma iterativa y transparente.', Icon: Code },
  { title: 'Lanzamos', description: 'Ponemos tu solución en marcha, lista para generar valor.', Icon: Rocket },
];

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
