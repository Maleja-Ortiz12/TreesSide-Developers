import { Boxes, ChartColumn, CircleCheck, ClipboardList, Database, Laptop, PawPrint, Sprout } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Tecnología para la gestión agropecuaria-11.png.
export const agropecuario: ServiceCategory = {
  slug: 'agropecuario',
  label: 'Soluciones agropecuarias',
  icon: Sprout,
  metaTitle: 'Software para la gestión agropecuaria | TreesSide Developers',
  metaDescription: 'Soluciones de software para registrar, organizar y gestionar la operación agropecuaria de tu finca: cultivos, ganadería, gastos, inventarios y reportes a tu medida.',
  hero: {
    title: 'Tecnología que entiende lo que pasa',
    highlight: 'en el campo.',
    lead: 'Soluciones de software para registrar, organizar y gestionar la operación agropecuaria de tu finca o unidad productiva.',
    cta: 'Solicita una consulta',
  },
  offers: {
    title: '¿Qué te ofrecemos?',
    lead: 'Desarrollamos herramientas a la medida de tu operación agropecuaria, con módulos que se adaptan a tus actividades, registros y necesidades de gestión.',
    items: [
      { icon: Sprout, title: 'Cultivos', text: 'Siembra, labores y seguimiento de tus cultivos.' },
      { icon: PawPrint, title: 'Ganadería', text: 'Registro y control de la información de tu hato.' },
      { icon: Boxes, title: 'Gastos e inventarios', text: 'Control de gastos, insumos, productos y existencias.' },
      { icon: ChartColumn, title: 'Reportes', text: 'Consolidación de la operación en reportes claros y útiles.' },
    ],
  },
  concept: {
    title: 'Así se ve tu operación en una herramienta a tu medida.',
    text: 'Una vista integrada de tu campo, con registros de cultivos, animales y actividades, organizada y fácil de consultar.',
    alt: 'Vista conceptual: panel de gestión agropecuaria con lotes de cultivo, registro de ganadería y registro de campo (fertilización, control de plagas, mantenimiento de cercas).',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el plan que mejor se adapta a tu operación. Todos son implementaciones a la medida (pago único), con un alcance claro y definido desde el inicio.',
    items: [
      { icon: Sprout, eyebrow: 'Plan 1', name: 'Registro de campo', badge: 'Implementación (pago único)', summary: 'Digitaliza los registros de una actividad específica y consúltalos de forma organizada.', scope: ['Una actividad del campo (según necesidad).', 'Registro, consulta y organización de la información.'], billing: 'Por implementación (pago único)' },
      { icon: PawPrint, eyebrow: 'Plan 2', name: 'Gestión agropecuaria', badge: 'Implementación (pago único)', summary: 'Gestiona tu operación de cultivos o ganadería, con control de gastos, inventario y reportes según el alcance que definas.', scope: ['Módulos de cultivos o ganadería (según necesidad).', 'Gastos, inventario y reportes.'], billing: 'Por implementación (pago único)' },
      { icon: Boxes, eyebrow: 'Plan 3', name: 'Operación a medida', badge: 'Implementación (pago único)', summary: 'Una solución más completa para operaciones con múltiples unidades productivas, procesos, roles e integraciones.', scope: ['Múltiples unidades (cultivos y/o ganadería).', 'Varios procesos.', 'Gestión de roles.', 'Las integraciones que definamos.'], billing: 'Por implementación (pago único)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro y colaborativo, desde la definición de la actividad hasta la validación final.',
    steps: [
      { icon: ClipboardList, title: 'Actividad', text: 'Definimos la actividad o proceso que vas a gestionar.' },
      { icon: Database, title: 'Registros', text: 'Identificamos la información que necesitas capturar y consultar.' },
      { icon: Laptop, title: 'Herramienta', text: 'Desarrollamos e implementamos la solución según el alcance.' },
      { icon: CircleCheck, title: 'Validación', text: 'Revisamos la herramienta contigo y ajustamos lo necesario.' },
    ],
  },
  cta: { title: 'Conversemos sobre tu operación.', text: 'Cuéntanos cómo trabajas en el campo y te proponemos la mejor alternativa para tu caso.', button: 'Solicita una consulta' },
};
