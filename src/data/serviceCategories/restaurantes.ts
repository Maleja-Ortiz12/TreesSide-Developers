import { Boxes, ChartColumn, ChefHat, Code, FileText, Monitor, Printer, ShoppingCart, Users, UtensilsCrossed } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Restaurante conectado_ servicios y planes-5.png, combined with the flow,
// POS conceptual view and La Lupe reference of Images/mockup de restaurantes.png.
export const restaurantes: ServiceCategory = {
  slug: 'restaurantes',
  label: 'Restaurantes',
  icon: UtensilsCrossed,
  metaTitle: 'Software y web para restaurantes | TreesSide Developers',
  metaDescription: 'Soluciones digitales para restaurantes: web y carta, pedidos, cocina, caja e inventarios. Planes Presencia digital, Ventas en línea y Gestión integral.',
  hero: {
    title: 'Tu restaurante,',
    highlight: 'conectado de la carta a la caja.',
    lead: 'Soluciones digitales para restaurantes que integran la presencia en línea, los pedidos, la cocina, la caja y la administración en un solo ecosistema.',
    cta: 'Solicita una asesoría',
  },
  offers: {
    title: '¿Qué te ofrecemos?',
    lead: 'Un conjunto de soluciones que se adaptan a la operación de tu restaurante.',
    items: [
      { icon: Monitor, title: 'Web y carta', text: 'Presencia en línea con tu carta, sedes y contacto por WhatsApp.' },
      { icon: ShoppingCart, title: 'Pedidos y cocina', text: 'Toma de pedidos (en línea o en el restaurante) y envío directo a cocina y bar.' },
      { icon: Printer, title: 'Caja y administración', text: 'Cobro, control diario y movimientos del restaurante de forma centralizada.' },
      { icon: Boxes, title: 'Inventarios', text: 'Control de insumos, existencias y consumo por preparación.' },
    ],
  },
  flow: {
    title: 'Del pedido al cierre, sin perder el hilo.',
    lead: 'De la carta al cierre de caja, una experiencia para clientes y equipo.',
    steps: [
      { icon: Users, title: 'Meseros', text: 'Toma de pedidos en mesas, con meseros o en línea.' },
      { icon: ChefHat, title: 'Cocina y bar', text: 'Envío de pedidos a cocina y bar (comandas).' },
      { icon: Printer, title: 'Caja', text: 'Cobro, control diario y movimientos del restaurante.' },
      { icon: Boxes, title: 'Inventarios', text: 'Control de insumos, existencias y consumo por preparación.' },
      { icon: ChartColumn, title: 'Administración', text: 'Carta, usuarios y reportes operativos.' },
    ],
  },
  concept: {
    title: 'Operación completa, de la mesa a la cocina.',
    text: 'Así puede verse tu restaurante en acción: mesas y pedidos en el punto de venta, cobro en caja y comandas en cocina, todo conectado.',
    alt: 'Vista conceptual: punto de venta del restaurante con mapa de mesas, pedido de la mesa 04, opciones de pago, comandas de cocina e inventario con stock bajo.',
  },
  plans: {
    title: 'Planes propuestos para tu restaurante',
    lead: 'Elige el plan que se ajusta a tu operación actual y a tus objetivos. Son paquetes comerciales que podemos adaptar en alcance según las necesidades de tu restaurante.',
    items: [
      { icon: Monitor, name: 'Presencia digital', eyebrow: 'Plan 1', badge: 'Implementación (pago único)', summary: 'Web, carta, sedes y contacto por WhatsApp.', scopeLabel: 'Incluye', scope: ['Sitio web de tu restaurante.', 'Carta digital (platos, precios y categorías).', 'Información de sedes y horarios.', 'Botón de contacto por WhatsApp.'] },
      { icon: ShoppingCart, name: 'Ventas en línea', eyebrow: 'Plan 2', badge: 'Implementación (pago único)', summary: 'Web, panel de productos, pedidos y pasarela de pagos.', scopeLabel: 'Incluye', scope: ['Todo lo del Plan 1.', 'Panel de productos y gestión de la carta.', 'Pedidos en línea (para domicilio o recoger).', 'Integración con pasarela de pagos.'] },
      {
        icon: Printer,
        name: 'Gestión integral',
        eyebrow: 'Plan 3',
        featured: true,
        summary: 'Pedidos, meseros, cocina y bar, caja, inventarios y administración.',
        scopeLabel: 'Incluye',
        scope: ['Toma de pedidos (mesas, meseros o en línea).', 'Envío de pedidos a cocina y bar (comandas).', 'Caja y control de ventas.', 'Inventarios (insumos, existencias y consumo).', 'Administración (carta, usuarios, reportes operativos).'],
        modes: [
          { title: 'Suscripción', text: 'Uso continuo del sistema, con actualizaciones y soporte.' },
          { title: 'Personalizado · pago único', text: 'Implementación a la medida, según el alcance acordado.' },
        ],
      },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'Infraestructura, mantenimiento y servicios externos según alcance.'],
  },
  references: {
    title: 'Proyecto destacado',
    lead: 'La Lupe es un proyecto real de nuestro equipo para un restaurante de comida mexicana.',
    projectIds: ['equipo-la-lupe'],
  },
  process: {
    title: 'Nuestro proceso de entrega',
    lead: 'Un proceso claro, colaborativo y enfocado en la operación real de tu restaurante.',
    steps: [
      { icon: UtensilsCrossed, title: 'Operación', text: 'Conocemos tu restaurante, tu forma de trabajo y tus objetivos.' },
      { icon: FileText, title: 'Alcance', text: 'Definimos juntos las funcionalidades, módulos y entregables del plan.' },
      { icon: Code, title: 'Configuración o desarrollo', text: 'Implementamos y configuramos la solución según el alcance acordado.' },
      { icon: Users, title: 'Prueba con tu equipo', text: 'Validamos la operación contigo y tu equipo, y realizamos los ajustes finales.' },
    ],
  },
  cta: { title: 'Conversemos sobre tu restaurante', text: 'Cuéntanos tu idea, tu operación y lo que necesitas. Te ayudamos a elegir el plan más adecuado y a definir el alcance de tu solución.', button: 'Agendar una consulta' },
};
