import { Code, FlaskConical, Gamepad2, Globe, Laptop, Layers, Lightbulb, MousePointer2, Puzzle } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Servicios de videojuegos y planes-7.png.
export const videojuegos: ServiceCategory = {
  slug: 'videojuegos',
  label: 'Videojuegos',
  icon: Gamepad2,
  metaTitle: 'Desarrollo de videojuegos | TreesSide Developers',
  metaDescription: 'Diseñamos y desarrollamos experiencias de juego interactivas: prototipos, juegos web y experiencias a la medida, con una visión creativa y técnica.',
  hero: {
    badge: 'Servicio de Videojuegos',
    title: 'Ideas que se juegan. Mundos que',
    highlight: 'se exploran.',
    lead: 'Diseñamos y desarrollamos experiencias de juego interactivas, desde prototipos hasta juegos web y experiencias a la medida, con una visión creativa, técnica y centrada en la experiencia del jugador.',
    cta: 'Hablemos de tu juego',
  },
  offers: {
    title: '¿Qué podemos hacer?',
    lead: 'Soluciones de desarrollo de videojuegos según tus objetivos.',
    items: [
      { icon: Globe, title: 'Juegos web', text: 'Desarrollo de juegos jugables en navegador.' },
      { icon: Layers, title: 'Prototipos', text: 'Versiones jugables para validar ideas y mecánicas.' },
      { icon: MousePointer2, title: 'Experiencias interactivas', text: 'Propuestas lúdicas y gamificadas para diversos propósitos.' },
      { icon: FlaskConical, title: 'Pruebas', text: 'Evaluación y ajuste de la experiencia de juego.' },
    ],
  },
  concept: {
    title: 'Así puede verse tu juego',
    text: 'Una referencia conceptual de la experiencia de juego: entorno, interacción y flujo básico.',
    alt: 'Vista conceptual: personaje en un mundo de islas flotantes con ruinas y cascadas, con indicadores de vida, brújula y controles táctiles en pantalla.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Tres opciones de alcance para llevar tu idea de juego a la realidad.',
    items: [
      { icon: Gamepad2, name: 'Prototipo jugable', badge: 'Implementación única', summary: 'Una versión funcional y enfocada en validar tu idea de juego.', scope: ['Desarrollo de la mecánica principal.', 'Escenario de prueba (nivel o entorno básico).', 'Validación de la jugabilidad y la experiencia.'] },
      { icon: Laptop, name: 'Juego web', badge: 'Implementación única', summary: 'Un juego completo para navegador, con una experiencia definida y lista para su uso.', scope: ['Desarrollo de la experiencia de juego.', 'Interfaz e interacción (UI) y controles.', 'Alcance definido según tus objetivos.'] },
      { icon: Puzzle, name: 'Experiencia a medida', badge: 'Implementación única', summary: 'Un desarrollo personalizado con mayor alcance, según las necesidades de tu proyecto.', scope: ['Diseño y desarrollo de mecánicas de juego.', 'Contenido (niveles, retos, progresión, etc.).', 'Arte y recursos visuales según el alcance.', 'Integraciones y funcionalidades adicionales.'] },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un flujo claro, iterativo y colaborativo para llevar tu juego de la idea al resultado final.',
    steps: [
      { icon: Lightbulb, title: 'Concepto', text: 'Definimos la idea, objetivos, referencias y alcance.' },
      { icon: Layers, title: 'Prototipo', text: 'Construimos una versión jugable para validar la propuesta.' },
      { icon: Code, title: 'Desarrollo', text: 'Implementamos el juego con sus mecánicas, contenido y diseño.' },
      { icon: FlaskConical, title: 'Pruebas', text: 'Probamos la experiencia, ajustamos y preparamos la entrega.' },
    ],
  },
  cta: { title: 'Conversemos tu idea de juego', text: 'Cuéntanos qué tipo de experiencia te imaginas y te ayudamos a definir el alcance ideal.', button: 'Agendar una consulta' },
};
