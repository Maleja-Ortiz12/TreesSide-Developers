import { Building2, CalendarDays, CircleCheck, Mail, Monitor, Search, Settings, SlidersHorizontal, Wrench } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Diagnóstico, mantenimiento y soporte técnico-12.png.
export const soporteTecnico: ServiceCategory = {
  slug: 'soporte-tecnico',
  label: 'Servicio técnico',
  icon: Wrench,
  metaTitle: 'Servicio técnico y soporte de equipos | TreesSide Developers',
  metaDescription: 'Diagnóstico, mantenimiento, configuración y soporte de tus equipos, remoto o presencial, con una atención clara, profesional y orientada a la solución.',
  hero: {
    badge: 'Servicio técnico',
    title: 'Tu tecnología merece',
    highlight: 'volver a funcionar bien.',
    lead: 'Diagnóstico, mantenimiento, configuración y soporte de tus equipos, con una atención clara, profesional y orientada a la solución.',
    cta: 'Solicitar servicio técnico',
  },
  offers: {
    title: '¿En qué te apoyamos?',
    lead: 'Un servicio técnico integral para mantener tus equipos en buen estado y en operación.',
    items: [
      { icon: Search, title: 'Diagnóstico', text: 'Identificamos la causa de la falla y la mejor alternativa de solución.' },
      { icon: Settings, title: 'Mantenimiento', text: 'Limpieza, revisión y ajustes preventivos y correctivos.' },
      { icon: SlidersHorizontal, title: 'Configuración', text: 'Ajustamos tus equipos y software según tus necesidades de uso.' },
      { icon: Monitor, title: 'Soporte remoto / presencial', text: 'Te acompañamos a distancia o en sitio, según disponibilidad.' },
    ],
  },
  concept: {
    title: 'Gestión de tickets de servicio',
    text: 'Un seguimiento claro de tu solicitud, con el estado actual, las actividades realizadas y la próxima acción.',
    alt: 'Vista conceptual: panel de tickets de servicio con equipo, asunto, estado (en diagnóstico, en atención, en espera, finalizado) y última actualización.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige la modalidad que mejor se adapte a tus necesidades de soporte y operación.',
    items: [
      { icon: Wrench, name: 'Diagnóstico y solución puntual', featured: true, summary: 'Atención por servicio, ideal para resolver una necesidad específica en tus equipos.', scope: ['Revisión.', 'Propuesta de solución.', 'Atención acordada.'], billing: 'Por servicio' },
      { icon: CalendarDays, name: 'Mantenimiento programado', summary: 'Mantenimiento preventivo y correctivo para mantener tus equipos en buen estado de operación.', scope: ['Limpieza, revisión y configuración de equipos definidos.'], billing: 'Por jornada o paquete (acorde a la necesidad acordada)' },
      { icon: Building2, name: 'Soporte para empresas', summary: 'Acompañamiento continuo para la operación de tus equipos, con canales de atención definidos.', scope: ['Soporte recurrente con bolsa de horas o visitas, según lo acordado.'], billing: 'Recurrente (mensual o por periodo acordado)' },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Repuestos, licencias, desplazamientos y recuperación especializada se cotizan según caso.'],
  },
  process: {
    title: 'Nuestro proceso de atención',
    lead: 'Un flujo simple y claro, desde tu solicitud hasta la entrega.',
    steps: [
      { icon: Mail, title: 'Recibimos', text: 'Tu solicitud de servicio con la información del equipo y la necesidad.' },
      { icon: Search, title: 'Diagnosticamos', text: 'Revisamos el equipo e identificamos la causa y las alternativas de solución.' },
      { icon: Wrench, title: 'Proponemos y atendemos', text: 'Te presentamos la solución y, con tu acuerdo, realizamos la atención (remota o presencial, según disponibilidad).' },
      { icon: CircleCheck, title: 'Verificamos y entregamos', text: 'Probamos el equipo, validamos la solución contigo y cerramos el servicio.' },
    ],
  },
  cta: { title: '¿Quieres orientación para tu caso?', text: 'Cuéntanos tu necesidad y te ayudamos a elegir el plan más adecuado.', button: 'Agendar consulta' },
};
