import { ChartColumn, CircleCheck, ClipboardList, Database, FileText, MessageCircle, Monitor, RefreshCw, Search } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Datos visibles, decisiones más claras-3.png.
export const datosYAnalitica: ServiceCategory = {
  slug: 'datos-y-analitica',
  label: 'Datos y analítica',
  icon: ChartColumn,
  metaTitle: 'Datos, BI y analítica para tu negocio | TreesSide Developers',
  metaDescription: 'Transformamos tus datos en información clara: limpieza de datos, BI, exploración y reportes. Planes Diagnóstico de datos, Dashboard de negocio y Analítica continua.',
  hero: {
    title: 'Tus datos tienen historias.',
    highlight: 'Hagámoslas visibles.',
    lead: 'Transformamos tus datos en información clara y útil para tomar mejores decisiones, con procesos de calidad, visualizaciones efectivas y análisis a la medida de tu negocio.',
    cta: 'Solicitar una consulta',
  },
  offers: {
    title: '¿Qué ofrecemos en este servicio?',
    lead: 'Un conjunto de capacidades que convierten tus datos en valor real.',
    items: [
      { icon: Database, title: 'Limpieza de datos', text: 'Revisión, depuración y estandarización para datos confiables y listos para analizar.' },
      { icon: ChartColumn, title: 'BI (Inteligencia de negocio)', text: 'Modelado y análisis de información para entender el estado y la evolución de tu negocio.' },
      { icon: Search, title: 'Exploración de datos', text: 'Análisis descriptivo y exploratorio para descubrir patrones, tendencias y oportunidades.' },
      { icon: FileText, title: 'Reportes', text: 'Informes y visualizaciones claras, útiles y alineadas a tus objetivos.' },
    ],
  },
  concept: {
    title: 'Panel de análisis del negocio',
    text: 'Un panel que reúne tus indicadores, la evolución de cada indicador y su composición, con accesos a resumen, análisis y reportes.',
    alt: 'Vista conceptual: panel de análisis del negocio con cuatro indicadores, un gráfico de evolución del indicador y un gráfico de composición.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el alcance que mejor se ajuste a tus necesidades.',
    items: [
      { icon: ClipboardList, name: 'Diagnóstico de datos', eyebrow: 'Plan 1', summary: 'Revisión de la calidad de tus datos, limpieza básica y hallazgos definidos.', scope: ['Diagnóstico de fuentes acordadas.', 'Revisión y mejora de la calidad de datos.', 'Limpieza básica y estandarización.', 'Entrega de hallazgos y recomendaciones.'], billing: 'Implementación (única vez)' },
      { icon: Monitor, name: 'Dashboard de negocio', eyebrow: 'Plan 2', summary: 'Un tablero de control a la medida, con indicadores, filtros y visualizaciones claras.', scope: ['Integración de fuentes acordadas.', 'Definición de indicadores clave.', 'Diseño y desarrollo del dashboard.', 'Filtros y visualizaciones interactivas.'], billing: 'Implementación (única vez)' },
      { icon: RefreshCw, name: 'Analítica continua', eyebrow: 'Plan 3', summary: 'Implementación y acompañamiento para mantener tus reportes actualizados y útiles.', scope: ['Implementación inicial (fuentes, modelo y reportes).', 'Actualización de reportes según frecuencia pactada.', 'Seguimiento y ajustes según tus necesidades.', 'Acompañamiento continuo en el uso y análisis.'], billing: 'Implementación (única vez) + servicio recurrente (según la frecuencia pactada)' },
    ],
    notes: ['Fuentes, volumen y licencias se acuerdan.', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un flujo claro y colaborativo, desde la necesidad hasta la puesta en marcha.',
    steps: [
      { icon: MessageCircle, title: 'Preguntas', text: 'Entendemos tus objetivos, necesidades y contexto.' },
      { icon: Database, title: 'Fuentes', text: 'Validamos y preparamos las fuentes de datos acordadas.' },
      { icon: ChartColumn, title: 'Análisis', text: 'Exploramos, limpiamos y modelamos los datos para generar insights.' },
      { icon: CircleCheck, title: 'Validación', text: 'Revisamos resultados contigo, ajustamos lo necesario y dejamos todo en marcha.' },
    ],
  },
  cta: { title: 'Conversemos sobre tus datos', text: 'Conversemos sobre tus datos, necesidades y el plan más adecuado para tu negocio.', button: 'Agendar una consulta' },
};
