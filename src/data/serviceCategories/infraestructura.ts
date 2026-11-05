import { Activity, AppWindow, Cloud, CodeXml, Database, Layers, Network, Rocket, Search, Server, Settings } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Infraestructura tecnológica para crecer-14.png.
export const infraestructura: ServiceCategory = {
  slug: 'infraestructura',
  label: 'Infraestructura',
  icon: Server,
  metaTitle: 'Infraestructura tecnológica y nube | TreesSide Developers',
  metaDescription: 'Diseñamos, implementamos y operamos la infraestructura que tu software necesita: servidores en la nube, redes seguras, despliegues con dominio y respaldo continuo.',
  hero: {
    badge: 'Infraestructura',
    title: 'La base tecnológica',
    highlight: 'para seguir creciendo.',
    lead: 'Diseñamos, implementamos y operamos la infraestructura que tu software necesita, con servidores en la nube, redes seguras, despliegues con dominio y respaldo continuo.',
    cta: 'Hablemos de tu infraestructura',
  },
  offers: {
    title: '¿Qué incluye este servicio?',
    items: [
      { icon: Cloud, title: 'Servidores en la nube', text: 'Provisionamiento y configuración de servidores según tu necesidad.' },
      { icon: Network, title: 'Redes', text: 'Configuración de conectividad, seguridad y acceso controlado.' },
      { icon: AppWindow, title: 'Despliegues y dominios', text: 'Publicación de tu aplicación y configuración de dominio.' },
      { icon: Database, title: 'Respaldos y monitoreo', text: 'Copias de seguridad y seguimiento del estado del entorno.' },
    ],
  },
  concept: {
    title: 'Panel de entornos, estado y respaldos',
    text: 'Una vista centralizada para gestionar tus entornos (producción, staging y desarrollo), consultar su estado y controlar los respaldos.',
    alt: 'Vista conceptual: panel de infraestructura con los entornos de producción, staging y desarrollo, su estado y su último respaldo.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Tres opciones comerciales para implementar y operar tu infraestructura, según el punto en el que se encuentre tu proyecto.',
    items: [
      { icon: Rocket, name: 'Puesta en marcha', badge: 'Implementación (única vez)', summary: 'Configuración inicial y despliegue de tu aplicación, con dominio y el entorno acordado.', scope: ['Configuración del entorno inicial.', 'Despliegue de la aplicación.', 'Configuración de dominio.', 'Ajustes básicos para su operación.'], billing: 'Una sola vez' },
      { icon: Layers, name: 'Infraestructura conectada', badge: 'Implementación (única vez)', summary: 'Implementación de una infraestructura más completa, con servidores, red, base de datos y respaldo, según la arquitectura acordada.', scope: ['Configuración de servidores (nube).', 'Configuración de red y accesos.', 'Implementación de base de datos.', 'Configuración de respaldos.', 'Despliegue de la aplicación y dominio.'], billing: 'Una sola vez' },
      { icon: Settings, name: 'Administración continua', badge: 'Servicio recurrente', featured: true, summary: 'Seguimiento y operación del entorno, con mantenimiento, respaldos y ajustes dentro del alcance acordado.', scope: ['Seguimiento del estado del entorno.', 'Mantenimiento y ajustes operativos.', 'Gestión de respaldos.', 'Ajustes de configuración dentro del alcance.'], billing: 'Recurrente' },
    ],
    notes: ['Proveedores de nube, dominios, licencias y consumo se pagan según contratación.', 'No se garantiza un tiempo de disponibilidad (uptime).', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro y colaborativo para dejar tu infraestructura lista y en operación.',
    steps: [
      { icon: Search, title: 'Diagnóstico', text: 'Entendemos tus necesidades, requisitos y el contexto del proyecto.' },
      { icon: Layers, title: 'Arquitectura', text: 'Definimos la arquitectura, los componentes y el alcance de la infraestructura.' },
      { icon: CodeXml, title: 'Implementación', text: 'Configuramos, desplegamos y validamos el entorno acordado.' },
      { icon: Activity, title: 'Seguimiento', text: 'Acompañamos la operación, con mantenimiento, respaldos y ajustes dentro del alcance.' },
    ],
  },
  cta: { title: 'Agenda una consulta de infraestructura', text: 'Conversemos sobre tus necesidades y definamos el plan más adecuado.', button: 'Hablemos ahora' },
};
