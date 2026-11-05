import { ChartColumn, CirclePlay, FileText, Link, Megaphone, Monitor, Radio, Target } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Streaming y redes sociales, todo conectado-6.png.
export const streamingYRedes: ServiceCategory = {
  slug: 'streaming-y-redes',
  label: 'Streaming y redes sociales',
  icon: Radio,
  metaTitle: 'Streaming web y gestión de redes sociales | TreesSide Developers',
  metaDescription: 'Soluciones de streaming y gestión de redes sociales: reproductor web en vivo o bajo demanda, estrategia, calendario y producción de contenido para tus redes.',
  hero: {
    title: 'Tu contenido merece',
    highlight: 'conectar.',
    lead: 'Soluciones de streaming y gestión de redes sociales para que tus contenidos lleguen, se organicen y generen una comunidad activa en digital.',
    cta: 'Solicitar propuesta',
  },
  offers: {
    title: 'Nuestra oferta en esta categoría',
    items: [
      { icon: Radio, title: 'Streaming', text: 'Transmite tu contenido en la web con un reproductor a la medida y la experiencia que necesitas (en vivo o bajo demanda): reproductor web personalizado, directorio o programación (según alcance) y panel de administración de contenidos.' },
      { icon: Megaphone, title: 'Gestión de redes', text: 'Estrategia, calendario y producción de contenido para mantener una presencia activa, coherente y relevante en tus redes sociales: estrategia y plan de contenidos, diseño de piezas y formatos, y programación y publicación en canales acordados.' },
    ],
  },
  concept: {
    title: 'Reproductor y calendario editorial integrados',
    text: 'Así podría verse la experiencia: un reproductor web con tu contenido (en vivo o bajo demanda) y, en paralelo, un calendario editorial para planear, organizar y publicar en redes sociales.',
    alt: 'Vista conceptual: reproductor de streaming web con lista de contenidos junto a un calendario de contenido semanal para redes sociales.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Tres formas de trabajar, según tus objetivos de contenido y presencia digital.',
    items: [
      { icon: Monitor, name: 'Streaming web', badge: 'Implementación (pago único)', summary: 'Puesta en marcha de un reproductor web, directorio o programación y panel de administración, según el alcance acordado.', scope: ['Reproductor, directorio o programación y panel (según alcance).'], billing: 'Pago único (implementación)' },
      { icon: Megaphone, name: 'Gestión de redes', badge: 'Servicio recurrente (mensual)', summary: 'Estrategia, calendario, producción de piezas y programación de contenidos para tus redes sociales.', scope: ['Estrategia, calendario, piezas y programación.', 'Canales, frecuencia y entregables por acordar.'], billing: 'Mensual (gestión recurrente)' },
      { icon: Link, name: 'Presencia conectada', badge: 'Implementación + gestión recurrente', featured: true, summary: 'Streaming web y estrategia de contenido coordinada, para una presencia digital integral y consistente.', scope: ['Implementación del streaming web y gestión recurrente de contenido en redes.'], billing: 'Implementación (pago único) + gestión mensual (servicio recurrente)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Publicidad, producción audiovisual, derechos y servicios externos se cotizan según alcance.'],
  },
  process: {
    title: 'Nuestro proceso de entrega',
    lead: 'Un flujo claro, de la definición a la operación y el seguimiento.',
    steps: [
      { icon: Target, title: 'Objetivos', text: 'Conocemos tus metas, audiencia y necesidades de contenido (streaming, redes o ambos).' },
      { icon: FileText, title: 'Propuesta', text: 'Definimos el alcance, los entregables, el plan de trabajo y la forma de facturación.' },
      { icon: CirclePlay, title: 'Producción y puesta en marcha', text: 'Implementamos el streaming (según alcance) y desarrollamos la estrategia y los contenidos para redes.' },
      { icon: ChartColumn, title: 'Seguimiento', text: 'Acompañamos la operación, revisamos el cumplimiento del plan y ajustamos según lo acordado.' },
    ],
  },
  cta: { title: 'Conversemos sobre tu estrategia de contenido', text: 'Cuéntanos tu idea y te proponemos la mejor forma de llevarla a la web y a tus redes.', button: 'Agendar una consulta' },
};
