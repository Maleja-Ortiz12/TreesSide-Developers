import { CalendarDays, CirclePlay, CodeXml, Layers, Link, Monitor, MonitorPlay, Play, Radio, SlidersHorizontal, Target } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Plataformas de streaming a tu medida-1 mockup actualizado.png.
// The mockup has no hero CTA, leads or plan scopes: those shared fields stay empty and StreamingLayout ignores them.
export const streaming: ServiceCategory = {
  slug: 'streaming',
  label: 'Streaming',
  icon: Radio,
  metaTitle: 'Plataformas de streaming a tu medida | TreesSide Developers',
  metaDescription: 'Creamos plataformas web para emisoras, audio y video en vivo o bajo demanda: reproductores web, directorios y programación, administración de contenido e integraciones.',
  hero: {
    title: 'Tu señal. Tu plataforma.',
    highlight: 'Tu audiencia.',
    lead: 'Creamos plataformas web para emisoras, audio y video en vivo o bajo demanda, según el alcance.',
    cta: '',
  },
  offers: {
    title: 'Capacidades de nuestra solución de streaming',
    items: [
      { icon: Play, title: 'Reproductores web', text: '' },
      { icon: CalendarDays, title: 'Directorios y programación', text: '' },
      { icon: Layers, title: 'Administración de contenido', text: '' },
      { icon: Link, title: 'Integraciones', text: '' },
    ],
  },
  concept: {
    title: 'Vista conceptual',
    text: 'Ejemplo de portal de streaming con directorio de emisoras, reproductor en vivo, programación y contenido a la carta.',
    alt: 'Vista conceptual del portal Radio del Valle: emisoras, reproductor en vivo, programación de hoy y contenido a la carta.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: '',
    items: [
      { icon: Radio, name: 'Reproductor esencial', summary: 'Página de streaming y reproductor conectado a una fuente acordada.', scope: [], billing: 'Pago único' },
      { icon: MonitorPlay, name: 'Plataforma administrable', summary: 'Reproductor, directorio o programación y panel para gestionar contenidos según alcance.', scope: [], billing: 'Pago único' },
      { icon: SlidersHorizontal, name: 'Streaming a medida', summary: 'Roles, múltiples fuentes e integraciones adaptadas a tu operación.', scope: [], billing: 'Pago único' },
    ],
    // First note is the recurring-support bar ("label: text"); the second, the external-cost line below it.
    notes: [
      'Acompañamiento recurrente: mantenimiento, seguimiento y ajustes por cotizar.',
      'Alojamiento, ancho de banda, proveedores y derechos de contenido se definen según contratación.',
    ],
  },
  process: {
    title: 'Nuestro proceso de trabajo',
    lead: '',
    steps: [
      { icon: Target, title: 'Fuente y objetivos', text: 'Definimos la fuente de streaming y los objetivos de la plataforma.' },
      { icon: Monitor, title: 'Experiencia', text: 'Diseñamos la experiencia de reproducción, directorio y programación según el alcance.' },
      { icon: CodeXml, title: 'Desarrollo e integración', text: 'Construimos la plataforma e integramos los servicios requeridos.' },
      { icon: CirclePlay, title: 'Pruebas de reproducción', text: 'Validamos la reproducción en vivo y bajo demanda antes de la entrega.' },
    ],
  },
  cta: { title: 'Demos una plataforma a tu contenido.', text: '', button: '' },
};
