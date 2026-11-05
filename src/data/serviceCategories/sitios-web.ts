import { Building2, CodeXml, FileText, Layers, Monitor, Network, Rocket, Settings, TabletSmartphone, Tag } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Servicios web y planes a medida-15.png.
export const sitiosWeb: ServiceCategory = {
  slug: 'sitios-web',
  label: 'Webs corporativas e institucionales',
  icon: Building2,
  metaTitle: 'Sitios web corporativos e institucionales | TreesSide Developers',
  metaDescription: 'Diseñamos y desarrollamos sitios web corporativos e institucionales que comunican tu propósito y presentan tus servicios, con una experiencia clara y administrable.',
  hero: {
    title: 'Una presencia digital',
    highlight: 'a la altura de lo que haces.',
    lead: 'Diseñamos y desarrollamos sitios web corporativos e institucionales que comunican tu propósito, presentan tus servicios y te conectan con tus públicos, con una experiencia clara, moderna y administrable.',
    cta: 'Solicitar propuesta',
    chips: ['Corporativas', 'Institucionales', 'Portafolios', 'CMS'],
  },
  offers: {
    title: '¿Qué incluye este servicio?',
    items: [
      { icon: Monitor, title: 'Presencia profesional', text: 'Un sitio que refleja tu identidad, propósito y servicios.' },
      { icon: Settings, title: 'Gestión de contenidos', text: 'Opciones administrables según tus necesidades.' },
      { icon: TabletSmartphone, title: 'Experiencia multiplataforma', text: 'Diseño adaptable y coherente en computador, tablet y móvil.' },
      { icon: Network, title: 'Escalable y flexible', text: 'Una base sólida para futuros crecimientos.' },
    ],
  },
  concept: {
    title: 'Estructura clara, contenido editable y orientada a tus objetivos.',
    text: 'Así podría organizarse tu sitio: un mapa de navegación simple y un diseño moderno, con secciones clave y contenido que puedes administrar (según el plan).',
    alt: 'Vista conceptual: mapa de navegación del sitio (Inicio, Nosotros, Servicios, Recursos, Contacto) junto a las pantallas Quiénes somos y Nuestros servicios.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el alcance que mejor se adapta a tu organización. Son paquetes comerciales de implementación, con un pago único según el alcance definido.',
    items: [
      { icon: FileText, name: 'Web informativa', summary: 'Una presencia esencial y profesional en la web.', scope: ['Identidad visual alineada a tu marca.', 'Secciones principales: inicio, servicios, contenido (p. ej. nosotros o información clave) y contacto.', 'Diseño adaptable (computador, tablet y móvil).'], billing: 'Pago único (implementación)' },
      { icon: Settings, name: 'Web administrable', featured: true, summary: 'Tu sitio con un panel para editar contenido de forma sencilla.', scope: ['Todo lo del plan Web informativa.', 'Panel de administración para actualizar contenido (textos, imágenes, secciones definidas).', 'Secciones administrables según el alcance acordado.'], billing: 'Pago único (implementación)' },
      { icon: Layers, name: 'Sitio a medida', summary: 'Una solución web diseñada según tus necesidades específicas.', scope: ['Todo lo del plan Web administrable.', 'Funcionalidades personalizadas (p. ej. formularios avanzados, áreas privadas, catálogos, etc.), según requerimiento.', 'Integraciones y estructura personalizada (según el alcance acordado).'], billing: 'Pago único (implementación)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Dominio, hosting, contenido y mantenimiento según alcance.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro, colaborativo y enfocado en un resultado que te represente.',
    steps: [
      { icon: Tag, title: 'Identidad', text: 'Revisamos tu marca, objetivos y público para definir la dirección del sitio.' },
      { icon: FileText, title: 'Contenido', text: 'Organizamos y estructuramos la información: secciones, textos e insumos necesarios.' },
      { icon: CodeXml, title: 'Diseño y desarrollo', text: 'Diseñamos la experiencia visual y desarrollamos tu sitio según el plan elegido.' },
      { icon: Rocket, title: 'Publicación', text: 'Realizamos las pruebas, ajustes finales y ponemos tu sitio en línea (según el alcance).' },
    ],
  },
  cta: { title: '¿Hacemos realidad tu sitio web?', text: 'Conversemos sobre tus objetivos, el alcance y el plan más adecuado para tu organización.', button: 'Solicita una consulta' },
};
