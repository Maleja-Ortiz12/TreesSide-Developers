import { Bell, Calendar, CalendarCheck, CircleCheck, CodeXml, Headphones, Link, SlidersHorizontal, Users } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Cada cita en su lugar-10.png.
export const reservasYCitas: ServiceCategory = {
  slug: 'reservas-y-citas',
  label: 'Reservas y citas',
  icon: CalendarCheck,
  metaTitle: 'Agendas y reservas en línea | TreesSide Developers',
  metaDescription: 'Implementamos agendas y reservas en línea para organizar tus servicios, profesionales y horarios. Planes Agenda digital, Agenda administrable y Reservas conectadas.',
  hero: {
    badge: 'Reservas y citas',
    title: 'Cada cita en',
    highlight: 'su lugar.',
    lead: 'Implementamos agendas y reservas en línea para que tus servicios, profesionales y horarios estén organizados, siempre disponibles y listos para tus clientes.',
    cta: 'Solicitar propuesta',
  },
  offers: {
    title: '¿Qué incluye este servicio?',
    items: [
      { icon: Calendar, title: 'Disponibilidad', text: 'Define horarios y días de atención de forma flexible.' },
      { icon: Users, title: 'Profesionales', text: 'Gestiona uno o varios profesionales y sus agendas.' },
      { icon: CalendarCheck, title: 'Reservas', text: 'Permite que tus clientes reserven en línea, de forma simple y clara.' },
      { icon: Bell, title: 'Recordatorios', text: 'Envía avisos automáticos para reducir inasistencias.' },
    ],
  },
  concept: {
    title: 'Flujo de reserva y agenda semanal',
    text: 'Tu cliente elige el servicio, selecciona un día y un horario disponible, completa el formulario de reserva y recibe el detalle de su cita y recordatorios; tú consultas la agenda semanal de cada profesional desde la administración.',
    alt: 'Vista conceptual: flujo de reserva del cliente en cuatro pasos (servicio, fecha y hora, datos, confirmación) y agenda semanal por profesional para la administración.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Tres opciones de implementación, según el alcance que necesites.',
    items: [
      { icon: Calendar, name: 'Agenda digital', badge: 'Implementación (pago único)', summary: 'Pon en línea tus servicios y horarios con un formulario de reserva sencillo y efectivo.', scopeLabel: 'Alcance del plan', scope: ['Configuración de servicios.', 'Definición de horarios de atención.', 'Formulario de reserva en la web.'] },
      { icon: Users, name: 'Agenda administrable', badge: 'Implementación (pago único)', featured: true, summary: 'Una agenda más completa para gestionar profesionales, disponibilidad y el estado de cada reserva desde un panel de administración.', scopeLabel: 'Alcance del plan', scope: ['Gestión de uno o varios profesionales.', 'Configuración de disponibilidad por profesional.', 'Administración de reservas y sus estados (pendiente, confirmada, cancelada, etc.).', 'Panel de administración y consulta de agenda.'] },
      { icon: Link, name: 'Reservas conectadas', badge: 'Implementación (pago único)', summary: 'Lleva tu agenda al siguiente nivel con pagos, recordatorios e integraciones según el alcance de tu operación.', scopeLabel: 'Alcance del plan', scope: ['Todo lo incluido en Agenda administrable.', 'Integración de pagos en línea (según alcance).', 'Recordatorios automáticos (según alcance).', 'Integraciones con otras herramientas (según alcance).'] },
    ],
    notes: ['Mensajería, pasarelas y mantenimiento tienen costos externos según uso.', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Así llevamos tu agenda de la idea a la puesta en marcha.',
    steps: [
      { icon: Headphones, title: 'Atención', text: 'Conversamos sobre tu operación, servicios y necesidades.' },
      { icon: SlidersHorizontal, title: 'Reglas', text: 'Definimos servicios, horarios, profesionales y alcances del plan.' },
      { icon: CodeXml, title: 'Construcción', text: 'Implementamos y configuramos tu agenda y flujo de reservas.' },
      { icon: CircleCheck, title: 'Pruebas', text: 'Validamos el funcionamiento contigo y dejamos todo listo.' },
    ],
  },
  cta: { title: '¿Quieres una agenda de reservas para tu negocio?', text: 'Cuéntanos cómo atiendes hoy y te proponemos la mejor opción.', button: 'Agendar una consulta' },
};
