import { Bot, CircleCheck, FileIcon, Layers, Link, MapIcon, Play, Settings, SlidersHorizontal, Workflow } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Automatización empresarial_ menos tareas, más tiempo-8.png.
export const automatizacion: ServiceCategory = {
  slug: 'automatizacion',
  label: 'Automatización empresarial',
  icon: Workflow,
  metaTitle: 'Automatización empresarial de procesos | TreesSide Developers',
  metaDescription: 'Automatizaciones que conectan tus herramientas, procesan información y ejecutan tareas de forma confiable: RPA, integraciones, documentos y ejecuciones.',
  hero: {
    badge: 'Automatización empresarial',
    title: 'Menos tareas repetitivas.',
    highlight: 'Más tiempo para avanzar.',
    lead: 'Diseñamos y ponemos en marcha automatizaciones que conectan tus herramientas, procesan información y ejecutan tareas de forma confiable, para que tu equipo se enfoque en lo que realmente aporta valor.',
    cta: 'Automatizar mi proceso',
  },
  offers: {
    title: '¿Qué incluye este servicio?',
    lead: 'Automatizamos tareas, conectamos herramientas y organizamos la información para que tus procesos sean más ágiles, ordenados y consistentes.',
    items: [
      { icon: Bot, title: 'RPA', text: 'Automatización de tareas repetitivas en tus sistemas.' },
      { icon: Link, title: 'Integración de herramientas', text: 'Conexión y flujo de información entre las aplicaciones que usas.' },
      { icon: FileIcon, title: 'Documentos', text: 'Generación, transformación y organización de documentos de forma automática.' },
      { icon: Play, title: 'Ejecuciones', text: 'Programación y ejecución automatizada de procesos según tus reglas.' },
    ],
  },
  concept: {
    title: 'Así puede verse tu automatización',
    text: 'Un flujo que recibe información, la procesa con reglas definidas, la integra en tus herramientas y ejecuta las acciones correspondientes.',
    alt: 'Vista conceptual: flujo de automatización en cuatro pasos: recibe información, aplica reglas, integra datos y ejecuta acciones.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Tres formas de llevar la automatización a tu operación, según el alcance y el acompañamiento que necesites.',
    items: [
      { icon: Layers, name: 'Flujo puntual', eyebrow: 'Plan 1', badge: 'Implementación (una sola vez)', summary: 'Automatización de una tarea delimitada, con reglas claras y un alcance específico.', scope: ['Un flujo de automatización.', 'Reglas de negocio definidas.', 'Conexión con las herramientas necesarias.', 'Entrega y puesta en marcha.'], billing: 'Una sola vez (implementación)' },
      { icon: Link, name: 'Proceso conectado', eyebrow: 'Plan 2', badge: 'Implementación (una sola vez)', summary: 'Automatización de un proceso de varias etapas, con integración entre herramientas y manejo de errores.', scope: ['Flujo de varias etapas.', 'Integración entre herramientas.', 'Manejo de errores y validaciones.', 'Entrega, pruebas y puesta en marcha.'], billing: 'Una sola vez (implementación)' },
      { icon: Settings, name: 'Operación acompañada', eyebrow: 'Plan 3', badge: 'Implementación + servicio recurrente', featured: true, summary: 'Implementación de la automatización y un servicio recurrente de acompañamiento, con monitoreo y ajustes dentro del alcance acordado.', scope: ['Implementación del flujo o proceso acordado.', 'Monitoreo de la operación.', 'Ajustes dentro del alcance acordado.', 'Soporte y acompañamiento periódico.'], billing: 'Implementación (una sola vez) + servicio recurrente (mensual)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Licencias y servicios externos por separado.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un camino claro y colaborativo para poner tu automatización en marcha.',
    steps: [
      { icon: MapIcon, title: 'Mapeamos', text: 'Entendemos tu proceso, las herramientas y el objetivo.' },
      { icon: SlidersHorizontal, title: 'Definimos reglas', text: 'Establecemos las reglas, flujos y resultados esperados.' },
      { icon: Settings, title: 'Automatizamos', text: 'Creamos, integramos y configuramos el flujo.' },
      { icon: CircleCheck, title: 'Probamos', text: 'Validamos el funcionamiento contigo y dejamos el proceso en marcha.' },
    ],
  },
  cta: { title: 'Cuéntanos qué quieres automatizar', text: 'Agendemos una consulta para entender tu proceso y proponerte la mejor opción.', button: 'Hablemos' },
};
