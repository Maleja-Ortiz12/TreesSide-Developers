import { Camera, ChartNoAxesColumnIncreasing, Goal, Layers, Leaf, Megaphone, Pencil, Smartphone, Sprout } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Marca, fotografía y presencia digital-2 redes mockup actualizado.png.
// The mockup has no hero CTA, section leads, plan scopes or process paragraphs: those shared fields stay empty and SocialLayout ignores them.
export const redesSociales: ServiceCategory = {
  slug: 'redes-sociales',
  label: 'Redes sociales, marketing y marca',
  icon: Megaphone,
  metaTitle: 'Marca, fotografía y presencia digital | TreesSide Developers',
  metaDescription: 'Estrategia, contenido visual y presencia digital para tu negocio: gestión de redes sociales, marketing digital, fotografía, identidad de marca y diseño de piezas.',
  hero: {
    title: 'Haz que tu marca se vea, se entienda y',
    highlight: 'conecte.',
    lead: 'Estrategia, contenido visual y presencia digital para mostrar mejor lo que hace tu negocio.',
    cta: '',
  },
  offers: {
    title: '¿Qué hacemos por tu marca?',
    items: [
      { icon: Smartphone, title: 'Gestión de redes sociales', text: 'Estrategia, calendario, programación de contenido y manejo de comunidad dentro del alcance acordado.' },
      { icon: Megaphone, title: 'Marketing digital', text: 'Campañas con objetivos, configuración de publicidad y reporte de resultados.' },
      { icon: Camera, title: 'Fotografía y contenido', text: 'Sesiones planificadas, fotografía de productos o del negocio, edición y formatos adaptados.' },
      { icon: Leaf, title: 'Identidad y mejora de marca', text: 'Diagnóstico visual, mejora de logo, paleta de color, tipografía y consistencia de la marca.' },
      { icon: Pencil, title: 'Diseño de piezas', text: 'Diseño de posts, stories, anuncios y materiales de campaña.' },
    ],
  },
  // The band art already carries the original "Vista conceptual" pill, so the title is only an accessible caption.
  concept: {
    title: 'Vista conceptual',
    text: '',
    alt: 'Calendario de contenido, publicaciones "Tu producto, con identidad", "Conecta con lo que te inspira" y "Calidad en cada detalle", moodboard de marca y una taza antes y después de aplicar la identidad.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: '',
    items: [
      { icon: Camera, name: 'Identidad y fotografía', badge: 'Proyecto / Sesión', summary: 'Diagnóstico visual, mejora de identidad y sesión fotográfica con entregables acordados.', scope: [] },
      { icon: Layers, name: 'Presencia en redes', badge: 'Mensual recurrente', summary: 'Estrategia, calendario, diseño de piezas, programación y seguimiento de canales acordados.', scope: [] },
      { icon: Sprout, name: 'Marca en crecimiento', badge: 'Configuración inicial + Mensual', summary: 'Identidad, contenido fotográfico, redes y campañas coordinadas según alcance.', scope: [] },
    ],
    notes: ['Canales, cantidad de piezas y fotos, revisiones, sesiones y gestión de comunidad se acuerdan en la propuesta. Pauta publicitaria, desplazamientos y producción adicional se cotizan aparte.'],
  },
  process: {
    title: 'Nuestro proceso',
    lead: '',
    steps: [
      { icon: Leaf, title: 'Conocemos tu marca', text: '' },
      { icon: Goal, title: 'Definimos estrategia y estilo', text: '' },
      { icon: Camera, title: 'Producimos y publicamos', text: '' },
      { icon: ChartNoAxesColumnIncreasing, title: 'Revisamos y mejoramos', text: '' },
    ],
  },
  cta: { title: 'Démosle una presencia clara a tu marca.', text: '', button: 'Hablemos' },
};
