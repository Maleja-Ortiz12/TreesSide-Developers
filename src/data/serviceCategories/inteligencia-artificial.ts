import { CircleCheck, CodeXml, Database, FileText, Layers, MessageCircle, Sparkles, Target } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Servicios de inteligencia artificial y APIs-9.png.
export const inteligenciaArtificial: ServiceCategory = {
  slug: 'inteligencia-artificial',
  label: 'Inteligencia artificial y APIs',
  icon: Sparkles,
  metaTitle: 'Inteligencia artificial y APIs | TreesSide Developers',
  metaDescription: 'Diseñamos e implementamos asistentes, automatizaciones y APIs que conectan tu información y tus sistemas: API a medida, Asistente conectado y Solución inteligente.',
  hero: {
    title: 'Conecta tus sistemas.',
    highlight: 'Dale inteligencia',
    titleEnd: 'a tus procesos.',
    lead: 'Diseñamos e implementamos asistentes, automatizaciones y APIs que conectan tu información, tus sistemas y tus equipos, para que trabajes con datos accesibles, procesos más ágiles y respuestas útiles en el día a día.',
    cta: 'Solicitar una consultoría',
  },
  offers: {
    title: '¿Qué incluye este servicio?',
    items: [
      { icon: MessageCircle, title: 'Asistentes', text: 'Conversacionales, con tu información y enfocados en tareas reales de tu operación.' },
      { icon: FileText, title: 'Documentos', text: 'Consulta y uso de documentos (guías, políticas, catálogos, etc.) como fuente de conocimiento.' },
      { icon: CodeXml, title: 'APIs', text: 'Diseño e implementación de APIs a medida para conectar datos, servicios y procesos.' },
      { icon: Layers, title: 'Integraciones', text: 'Conexión con tus sistemas, herramientas y canales de comunicación definidos.' },
    ],
  },
  concept: {
    title: 'Espacio de trabajo: Asistente, fuentes y APIs',
    text: 'Una vista de referencia de cómo se integran el asistente, tus fuentes de información y las APIs en una solución unificada.',
    alt: 'Vista conceptual: asistente conectado que responde con base en fuentes de información como documentos, catálogo, APIs y sistemas integrados.',
  },
  plans: {
    title: 'Elige la solución que se ajusta a tu necesidad',
    lead: 'Paquetes de implementación (pago único) diseñados para diferentes alcances de inteligencia, conexión de datos e integraciones.',
    items: [
      { icon: CodeXml, name: 'API a medida', summary: 'Implementación de endpoints personalizados para exponer o consumir información, con un modelo de IA y una integración puntual.', scope: ['Diseño, implementación y puesta en marcha de una API.', 'Con modelo e integración definida.'], billing: 'Pago único (implementación)' },
      { icon: MessageCircle, name: 'Asistente conectado', summary: 'Asistente conversacional enfocado en la consulta de documentos o un catálogo de información, disponible en un canal definido.', scope: ['Configuración del asistente.', 'Conexión con fuente(s) de información (documentos o catálogo).', 'Habilitación en un canal (ej. web, interno).'], billing: 'Pago único (implementación)' },
      { icon: Layers, name: 'Solución inteligente', summary: 'Solución integral con múltiples fuentes de información, flujos de trabajo, integraciones y roles de usuario, según el alcance definido.', scope: ['Diseño e implementación de una solución con varias fuentes.', 'Flujos de interacción.', 'Integraciones con sistemas.', 'Gestión de roles según necesidad.'], billing: 'Pago único (implementación)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Consumo de modelos, hosting y acompañamiento recurrente se cotizan aparte.'],
  },
  process: {
    title: 'Así llevamos tu solución a producción',
    lead: 'Un proceso claro y colaborativo, desde la definición del caso hasta la evaluación de la solución implementada.',
    steps: [
      { icon: Target, title: 'Caso', text: 'Definimos el objetivo, el alcance y los resultados esperados.' },
      { icon: Database, title: 'Datos', text: 'Revisamos y preparamos las fuentes de información (documentos, catálogo, sistemas, etc.).' },
      { icon: CodeXml, title: 'Integración', text: 'Implementamos el asistente, la(s) API(s) y las integraciones definidas en el alcance.' },
      { icon: CircleCheck, title: 'Evaluación', text: 'Validamos la solución contigo y realizamos los ajustes necesarios antes de la entrega final.' },
    ],
  },
  cta: { title: 'Hablemos de tu caso', text: 'Cuéntanos tu necesidad y exploremos juntos la mejor forma de conectar tus sistemas y aplicar inteligencia a tus procesos.', button: 'Agendar una consultoría' },
};
