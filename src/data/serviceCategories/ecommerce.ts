import { Blocks, Boxes, CreditCard, Layers, Laptop, Package, ShoppingCart, Tag } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Servicios y planes de e-commerce-1.png.
export const ecommerce: ServiceCategory = {
  slug: 'ecommerce',
  label: 'E-commerce',
  icon: ShoppingCart,
  metaTitle: 'Desarrollo de tiendas online y e-commerce | TreesSide Developers',
  metaDescription: 'Desarrollamos tu tienda online: catálogo, compra y pagos, pedidos e inventario en un solo lugar. Conocé los planes Catálogo digital, Tienda online y Comercio a medida.',
  hero: {
    title: 'Tu tienda, conectada con',
    highlight: 'tu negocio.',
    lead: 'Desarrollamos tu tienda online para que muestres tus productos, recibas compras, gestiones pedidos y controles tu inventario desde un solo lugar.',
    cta: 'Solicita tu tienda online',
  },
  offers: {
    title: '¿Qué incluye el servicio?',
    lead: 'Una tienda online completa, con las funcionalidades clave para vender y gestionar tu operación.',
    items: [
      { icon: Tag, title: 'Catálogo', text: 'Presenta tus productos de forma clara, organizada por categorías.' },
      { icon: CreditCard, title: 'Compra y pagos', text: 'Carrito de compras y múltiples medios de pago según tus necesidades.' },
      { icon: Package, title: 'Pedidos', text: 'Recepción y gestión de pedidos con su estado de seguimiento.' },
      { icon: Boxes, title: 'Inventario', text: 'Controla la disponibilidad de tus productos y mantén tu catálogo actualizado.' },
    ],
  },
  concept: {
    title: 'Así se conecta tu tienda',
    text: 'Así se conecta la experiencia de tu cliente con la operación de tu negocio: el cliente explora tus productos por categorías, completa el checkout y tú gestionas pedidos, productos e inventario desde un panel.',
    alt: 'Vista conceptual: tienda con catálogo, checkout de pago y panel de administración de pedidos, productos e inventario.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Elige el alcance que se adapta a tu negocio. Todos son desarrollos de implementación (pago único).',
    items: [
      { icon: Tag, name: 'Catálogo digital', badge: 'Implementación (pago único)', summary: 'Una presencia en línea para mostrar tus productos o servicios de forma profesional.', scope: ['Sitio web con catálogo de productos.', 'Organización por categorías.', 'Página de contacto.'] },
      { icon: ShoppingCart, name: 'Tienda online', badge: 'Implementación (pago único)', featured: true, summary: 'Una tienda completa para vender en línea y gestionar tus pedidos de forma simple.', scope: ['Todo lo del plan Catálogo digital.', 'Carrito de compras.', 'Integración de medios de pago.', 'Gestión de pedidos.', 'Panel de administración de productos.'] },
      { icon: Layers, name: 'Comercio a medida', badge: 'Implementación (pago único)', summary: 'Una solución de e-commerce ajustada a tu operación, con integraciones y reglas comerciales según tu negocio.', scope: ['Todo lo del plan Tienda online.', 'Integraciones (por ejemplo: facturación, inventario, logística u otras según alcance).', 'Reglas comerciales personalizadas (descuentos, promociones, flujos o procesos específicos).'] },
    ],
    notes: ['El alcance, los entregables y los costos externos se acuerdan antes de iniciar.', 'El mantenimiento (actualizaciones, ajustes y soporte) es un servicio opcional, con cotización por separado.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro y colaborativo para poner tu tienda en línea.',
    steps: [
      { icon: Tag, title: 'Catálogo', text: 'Definimos tus productos, categorías y la estructura de tu tienda.' },
      { icon: Laptop, title: 'Experiencia', text: 'Diseñamos la experiencia de navegación y compra, centrada en tus clientes.' },
      { icon: Blocks, title: 'Integración', text: 'Desarrollamos la tienda y configuramos pagos, pedidos y administración.' },
      { icon: ShoppingCart, title: 'Pruebas de compra', text: 'Validamos el flujo completo de compra, pagos y gestión de pedidos antes del lanzamiento.' },
    ],
  },
  cta: { title: 'Conversemos sobre tu tienda', text: 'Cuéntanos tu idea y te ayudamos a definir el mejor plan y alcance para tu e-commerce.', button: 'Agenda una consulta' },
};
