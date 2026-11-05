import { ArrowLeftRight, Box, Boxes, Calculator, ChartColumn, CircleCheck, Code, Database, MapIcon, Network, Truck } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Control logístico para cada movimiento-4.png.
export const logistica: ServiceCategory = {
  slug: 'logistica',
  label: 'Logística empresarial',
  icon: Truck,
  metaTitle: 'Software de logística empresarial | TreesSide Developers',
  metaDescription: 'Software para calcular cargas, controlar inventarios, gestionar flujos operativos y generar reportes de tu operación logística, con orden, trazabilidad y control.',
  hero: {
    badge: 'Logística empresarial',
    title: 'Control para cada movimiento de tu',
    highlight: 'operación.',
    lead: 'Herramientas de software para calcular cargas, controlar inventarios, gestionar flujos operativos y generar reportes de tu operación logística.',
    cta: 'Solicitar propuesta',
    secondary: { label: 'Conoce los planes', href: '/planes' },
  },
  offers: {
    title: '¿Qué ofrecemos?',
    lead: 'Soluciones de logística empresarial que te dan orden, trazabilidad y control en tu operación.',
    items: [
      { icon: Calculator, title: 'Cálculo de carga', text: 'Calcula y organiza la carga según tu operación, reglas y restricciones.' },
      { icon: Boxes, title: 'Inventarios', text: 'Registra, consulta y controla existencias con trazabilidad.' },
      { icon: ArrowLeftRight, title: 'Flujos operativos', text: 'Gestiona movimientos (entradas, salidas, traslados) con reglas de tu operación.' },
      { icon: ChartColumn, title: 'Reportes', text: 'Genera reportes claros de inventarios, movimientos y operación.' },
    ],
  },
  concept: {
    title: 'Una vista integrada de tu operación logística.',
    text: 'Ejemplo conceptual de una calculadora de carga y un tablero de control de bodega con inventarios, movimientos y reportes.',
    alt: 'Vista conceptual: calculadora de carga por tipo de unidad, dimensiones y peso, junto a un tablero de control de bodega con productos, existencias y ubicaciones.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el alcance que se ajusta a tu operación. Son paquetes de implementación (pago único), con la posibilidad de soporte recurrente opcional por cotización independiente.',
    items: [
      { icon: Box, name: 'Herramienta puntual', summary: 'Implementación única de una calculadora o un registro para un proceso específico de tu operación logística.', scopeLabel: 'Alcance sugerido', scope: ['Una calculadora o registro (según necesidad).', 'Reglas básicas del proceso.', 'Interfaz de uso clara y funcional.'], billing: 'Pago único (implementación)' },
      { icon: Boxes, name: 'Control operativo', summary: 'Implementación única de un sistema de control operativo con inventario, movimientos, roles y reportes, según el alcance definido.', scopeLabel: 'Alcance sugerido', scope: ['Gestión de inventarios (altas, bajas, ajustes).', 'Registro de movimientos (entradas, salidas, traslados).', 'Roles y permisos de acceso.', 'Reportes operativos (según necesidad).'], billing: 'Pago único (implementación)' },
      { icon: Network, name: 'Integración empresarial', summary: 'Implementación única con conexión de sistemas, reglas de negocio y flujos a medida para una operación logística más integrada.', scopeLabel: 'Alcance sugerido', scope: ['Conexión con sistemas existentes (según necesidad).', 'Reglas de negocio personalizadas.', 'Flujos operativos a medida de tu operación.', 'Módulos, reportes y ajustes según alcance.'], billing: 'Pago único (implementación)' },
    ],
    notes: ['Soporte recurrente (opcional): mantenimiento, ajustes y acompañamiento posterior a la implementación, con cotización independiente.', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro y colaborativo, desde la comprensión de tu operación hasta la validación de la solución.',
    steps: [
      { icon: MapIcon, title: 'Mapeo', text: 'Entendemos tu operación, procesos y necesidades.' },
      { icon: Database, title: 'Reglas y datos', text: 'Definimos reglas de negocio, información y alcance.' },
      { icon: Code, title: 'Desarrollo', text: 'Implementamos la solución según el alcance acordado.' },
      { icon: CircleCheck, title: 'Validación', text: 'Probamos contigo la solución y realizamos los ajustes finales.' },
    ],
  },
  cta: { title: '¿Hablamos de tu operación?', text: 'Cuéntanos cómo gestionas tu logística y te proponemos la mejor alternativa.', button: 'Solicita una consulta' },
};
