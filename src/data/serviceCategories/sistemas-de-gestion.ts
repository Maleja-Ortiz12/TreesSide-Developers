import { Boxes, ChartColumn, CircleCheck, Code, FileText, Layers, Leaf, Network, Search, Settings, Users } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Sistemas de gestión a medida-2.png.
export const sistemasDeGestion: ServiceCategory = {
  slug: 'sistemas-de-gestion',
  label: 'Sistemas de gestión',
  icon: Layers,
  metaTitle: 'Sistemas de gestión a medida | TreesSide Developers',
  metaDescription: 'Diseñamos sistemas de gestión modulares para tu operación: registros, procesos, roles y reportes. Planes Módulo esencial, Gestión conectada y Plataforma a medida.',
  hero: {
    title: 'Una operación conectada.',
    highlight: 'Un sistema hecho para ti.',
    lead: 'Diseñamos e implementamos sistemas de gestión modulares que organizan tu operación, centralizan la información y se adaptan a la forma de trabajar de tu equipo.',
    cta: 'Solicitar una consulta',
  },
  offers: {
    title: '¿Qué puedes hacer con tu sistema?',
    items: [
      { icon: Users, title: 'Roles', text: 'Define permisos y niveles de acceso según tu operación.' },
      { icon: FileText, title: 'Registros', text: 'Centraliza y mantén organizada la información de tu equipo y procesos.' },
      { icon: Network, title: 'Procesos', text: 'Gestiona flujos de trabajo de forma clara y ordenada.' },
      { icon: ChartColumn, title: 'Reportes', text: 'Consulta y analiza la información clave para tu operación.' },
    ],
  },
  concept: {
    title: 'Panel de operación',
    text: 'Tu sistema de gestión reúne registros, procesos, reportes y roles en un panel de operación, con los procesos en curso y la actividad de la operación a la vista.',
    alt: 'Vista conceptual: panel de operación de un sistema de gestión con accesos a registros, procesos, reportes y roles, procesos en curso y un gráfico de actividad.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el alcance que mejor se ajusta a tu operación. Todos los planes son implementaciones únicas (diseño, construcción, pruebas y puesta en marcha).',
    items: [
      { icon: Leaf, name: 'Módulo esencial', badge: 'Implementación única', summary: 'Ideal para iniciar con un proceso específico y organizar la información clave de tu operación.', scope: ['Implementación de un (1) proceso.', 'Gestión de registros asociados.', 'Permisos básicos de acceso.'], billing: 'Pago único (implementación)' },
      { icon: Boxes, name: 'Gestión conectada', badge: 'Implementación única', featured: true, summary: 'Una solución más completa para operar varios procesos de forma integrada y con mejor control.', scope: ['Implementación de varios módulos (p. ej. registros, procesos y reportes).', 'Gestión de roles y permisos.', 'Configuración de flujos de trabajo.', 'Reportes operativos de la operación.'], billing: 'Pago único (implementación)' },
      { icon: Settings, name: 'Plataforma a medida', badge: 'Implementación única', summary: 'Una solución diseñada para necesidades específicas, con integraciones, reglas de operación y módulos personalizados.', scope: ['Diseño de la arquitectura y módulos requeridos.', 'Integraciones con otras herramientas o fuentes.', 'Reglas de negocio y automatizaciones de la operación.', 'Módulos personalizados según tu necesidad.'], billing: 'Pago único (implementación)' },
    ],
    notes: ['Suscripción disponible cuando exista una plataforma compatible con tu operación; condiciones por acordar.', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un camino claro y colaborativo para que tu sistema quede en operación.',
    steps: [
      { icon: Search, title: 'Operación', text: 'Entendemos tu operación, objetivos y necesidades.' },
      { icon: Layers, title: 'Módulos', text: 'Definimos los módulos, roles, procesos y alcance del sistema.' },
      { icon: Code, title: 'Construcción', text: 'Diseñamos, desarrollamos y configuramos la solución de acuerdo con lo definido.' },
      { icon: CircleCheck, title: 'Validación', text: 'Probamos el sistema contigo, ajustamos lo necesario y lo dejamos en operación.' },
    ],
  },
  cta: { title: 'Conversemos sobre tu operación', text: 'Cuéntanos cómo trabajas hoy y te ayudamos a definir el sistema que mejor se ajuste a tu equipo.', button: 'Solicitar una consulta' },
};
