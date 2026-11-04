import { Lightbulb, Layers, Target } from 'lucide-react';
import styles from './Contact.module.css';

const TOPICS = [
  { title: 'Tu idea', description: 'Esa solución que tienes en mente y quieres convertir en un proyecto real y funcional.', Icon: Lightbulb },
  { title: 'El proceso que quieres mejorar', description: 'Una operación, servicio o flujo que puede ser más simple, eficiente y digital.', Icon: Layers },
  { title: 'Lo que esperas lograr', description: 'Los objetivos que quieres alcanzar con el proyecto, ya sea optimizar, crecer o innovar.', Icon: Target },
];

export function ContactTopics() {
  return (
    <section id="temas-contacto" className={styles.topics} aria-labelledby="contact-topics-title">
      <div className="container">
        <h2 id="contact-topics-title">Puedes escribirnos si quieres hablar sobre:</h2>
        <ul>
          {TOPICS.map(({ title, description, Icon }) => (
            <li key={title} className={styles.topic}>
              <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
