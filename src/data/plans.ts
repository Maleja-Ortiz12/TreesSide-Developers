import { CONTACT_INFO } from './content';

export interface CommercialPlan {
  id: string;
  name: string;
  price: number;
  line: 'Presencia y ventas digitales' | 'Web, ventas y automatización';
  /** The next tier includes this plan's scope; its conditions remain applicable. */
  includesPlan?: string;
  audience: string;
  outcome: string;
  includes: string[];
  excludes: string[];
  recurring: string[];
  requirements: string[];
  delivery: string;
}

/** Starting implementation prices in COP; final scope and taxes belong in the written quote. */
export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: 'impulso-web',
    name: 'Impulso Web',
    price: 500000,
    line: 'Presencia y ventas digitales',
    audience: 'Para restaurantes, profesionales y pequeños negocios que necesitan presentar su oferta y recibir consultas.',
    outcome: 'Un sitio informativo claro, adaptable a celular y listo para que tus clientes te encuentren y te contacten.',
    includes: [
      'Hasta 5 páginas informativas adaptadas a celular, tablet y escritorio.',
      'Presentación del negocio, servicios, galería y datos de contacto con acceso a WhatsApp.',
      'Formulario de contacto conectado a un servicio de recepción de mensajes.',
      'SEO técnico inicial: títulos, descripciones, sitemap, robots e imagen para compartir enlaces.',
      'Dominio .com disponible de tarifa estándar y hosting básico durante el primer año.',
      'Dos rondas de ajustes sobre el diseño acordado, sin agregar nuevas páginas o funcionalidades.',
    ],
    excludes: [
      'Catálogo administrable, tienda virtual, pagos en línea y reservas con reglas complejas.',
      'Panel administrativo, usuarios o integraciones con sistemas externos.',
      'Producción de fotografías, redacción de textos personalizados y campañas publicitarias.',
      'Dominios premium, correo corporativo de pago y posicionamiento SEO mensual.',
    ],
    recurring: [
      'La renovación de dominio y hosting después del primer año se cotiza por separado.',
      'Planes de pago del proveedor del formulario, correo y mantenimiento continuo no están incluidos.',
    ],
    requirements: [
      'Logo, textos definitivos, fotografías con permiso de uso y datos de contacto.',
      'Una persona que revise y apruebe el contenido y el diseño.',
      'Información legal y política de datos que correspondan a tu negocio.',
    ],
    delivery: 'Acordamos la estructura y el diseño, construimos el sitio y revisamos enlaces, formulario y adaptación a celular. El cronograma se define en la propuesta después de recibir el contenido y los accesos necesarios.',
  },
  {
    id: 'catalogo-administrable',
    name: 'Catálogo Administrable',
    price: 900000,
    line: 'Presencia y ventas digitales',
    includesPlan: 'impulso-web',
    audience: 'Para comercios que quieren mostrar sus productos y actualizar el catálogo sin depender del desarrollador para cada cambio.',
    outcome: 'Tu sitio con un catálogo y un panel administrativo para cambiar precios, agregar o quitar productos y organizar sus categorías y existencias básicas.',
    includes: [
      'Todo el sitio informativo de Impulso Web, con hasta 5 páginas, formulario, SEO técnico inicial y dos rondas de ajustes de diseño.',
      'Dominio .com de tarifa estándar y hosting básico durante el primer año, como en Impulso Web.',
      'Panel administrativo desarrollado con código a medida y acceso de administrador.',
      'Gestión de productos: agregar, editar o quitar productos; cambiar nombres, fotos, descripciones y precios.',
      'Categorías y control básico de existencias para organizar el catálogo.',
      'Catálogo público adaptable a celular y acceso a WhatsApp para consultar por un producto.',
      'Capacitación para administrar productos, precios, categorías y existencias básicas.',
    ],
    excludes: [
      'Carrito, checkout y pagos en línea; esas funciones se incluyen desde Vende Online.',
      'Administración con múltiples roles, facturación electrónica y conexión con ERP o inventarios externos.',
      'Importaciones masivas, fotografía de productos, redacción de contenido y campañas publicitarias.',
    ],
    recurring: [
      'Dominio y hosting se renuevan por separado después del primer año.',
      'Capacidad adicional de almacenamiento, servicios de pago y mantenimiento posterior se cotizan aparte.',
    ],
    requirements: [
      'Los contenidos y datos del negocio solicitados en Impulso Web.',
      'Catálogo inicial con productos, fotos, precios, categorías y existencias; acordamos su volumen antes de iniciar.',
      'Persona responsable del acceso de administrador y de validar los cambios del catálogo.',
    ],
    delivery: 'Construimos el sitio y el catálogo, configuramos el acceso administrativo y probamos altas, cambios de precio, actualización de existencias y eliminación de productos. La propuesta define el volumen de carga inicial, el alcance del panel y el cronograma; no incluye una tienda con pagos en línea.',
  },
  {
    id: 'vende-online',
    name: 'Vende Online',
    price: 1490000,
    line: 'Presencia y ventas digitales',
    includesPlan: 'catalogo-administrable',
    audience: 'Para comercios que necesitan una tienda desarrollada con código a medida, con catálogo administrable y pagos en línea.',
    outcome: 'Tu web, el panel de productos y una tienda con carrito y pasarela externa. El precio varía según la cantidad de productos, la carga inicial y la complejidad de la tienda.',
    includes: [
      'Todo Catálogo Administrable: web informativa, dominio y hosting básico el primer año, panel de productos, precios, categorías y existencias.',
      'Tienda desarrollada con código a medida, adaptable a celular, sin depender de un gestor de tiendas prefabricado.',
      'Catálogo sin un tope fijo de productos: el volumen, las variantes y la carga inicial se acuerdan en la cotización y determinan el precio final.',
      'Carrito, proceso de compra y conexión directa con una pasarela externa mediante su API o integración oficial.',
      'Proveedor de pagos elegido con el negocio según disponibilidad, comisiones y requisitos de aprobación.',
      'Consulta de pedidos en el panel y configuración básica de inventario y envíos acordada para el lanzamiento.',
      'Capacitación para administrar productos, actualizar precios y consultar pedidos.',
    ],
    excludes: [
      'Comisiones de la pasarela de pago, costos del transportador y tarifas de servicios externos.',
      'Facturación electrónica, integración con ERP, inventarios externos o marketplace multivendedor.',
      'Desarrollo de la pasarela de pago, aprobación de la cuenta del comercio y funciones no acordadas.',
      'Carga ilimitada de productos por el mismo precio, importaciones masivas no cotizadas y campañas publicitarias.',
    ],
    recurring: [
      'Dominio y hosting se renuevan por separado después del primer año.',
      'Comisiones de transacciones, almacenamiento adicional, servicios externos y mantenimiento se cotizan aparte.',
    ],
    requirements: [
      'Listado de productos con precios, fotos, descripciones, variantes y existencias iniciales para dimensionar el catálogo.',
      'Cuenta aprobada del negocio en la pasarela externa elegida y accesos autorizados de integración.',
      'Reglas de envío, cambios, devoluciones e información legal del comercio.',
    ],
    delivery: 'Definimos el tamaño y la complejidad del catálogo antes de confirmar el valor. Construimos la tienda y el panel con código a medida y probamos el recorrido de compra con el entorno de pruebas de la pasarela cuando esté disponible. La activación depende de la aprobación del proveedor; el plazo no incluye los tiempos de aprobación de terceros.',
  },
  {
    // Keep the previous public anchor working while making the bundle explicit.
    id: 'automatiza-tu-negocio',
    name: 'Negocio Integral',
    price: 3490000,
    line: 'Web, ventas y automatización',
    includesPlan: 'vende-online',
    audience: 'Para negocios que quieren reunir presencia web, catálogo administrable, ventas en línea y automatización en una misma solución.',
    outcome: 'Incluye la web de Impulso Web, el panel de Catálogo Administrable y la tienda de Vende Online, más un flujo para automatizar un proceso del negocio.',
    includes: [
      'Todo Vende Online: web informativa, catálogo y panel de productos, precios y existencias, carrito, pedidos y conexión con una pasarela externa.',
      'Dominio disponible de tarifa estándar y hosting básico de la web y tienda durante el primer año.',
      'Diagnóstico de un proceso concreto y configuración inicial de n8n en el entorno acordado.',
      'Un flujo de automatización con hasta dos herramientas que tengan una API disponible y accesible.',
      'Validaciones de datos, aviso de fallos y pruebas del flujo con los escenarios acordados.',
      'Documentación del flujo y capacitación para administrar la tienda y operar la automatización.',
      'Cotización ajustada a la cantidad de productos y complejidad del catálogo, la pasarela y el proceso que se automatiza.',
    ],
    excludes: [
      'Comisiones de pagos y servicios externos; servidor de automatización, licencias, consumo de IA y tarifas de WhatsApp API.',
      'Automatización bancaria o empresarial compleja con UiPath.',
      'Sistemas sin API, extracción de sitios, ingeniería inversa y cambios en aplicaciones de terceros.',
      'Flujos adicionales, integraciones con ERP, marketplace multivendedor y atención permanente no acordados.',
    ],
    recurring: [
      'La web y tienda incluyen hosting básico el primer año; su renovación y la del dominio se cotizan después por separado.',
      'El servidor de automatización y las licencias o suscripciones necesarias se cotizan por separado desde el inicio.',
      'Comisiones de pagos, consumos de APIs, IA o mensajería y mantenimiento dependen de los proveedores y del uso.',
    ],
    requirements: [
      'Los contenidos, catálogo, reglas de envío y cuenta de pagos aprobada que requiere Vende Online.',
      'Descripción del proceso y ejemplos de datos de prueba sin información sensible innecesaria.',
      'Accesos autorizados y documentación de las APIs; responsables de aprobar la tienda y la automatización.',
      'Reglas de validación, destinatario de los avisos y criterio de éxito del flujo.',
    ],
    delivery: 'Primero acordamos y construimos la web, el catálogo y la tienda. Después implementamos el flujo de automatización y comprobamos sus validaciones y avisos. La propuesta confirma el volumen de productos, las integraciones, el precio final y el cronograma de la solución completa; no es únicamente un servicio de automatización.',
  },
];

export const formatPlanPrice = (value: number) => `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

/** Contact only, not a checkout or acceptance of the final scope. */
export function planWhatsAppUrl(plan: CommercialPlan) {
  const url = new URL(CONTACT_INFO.whatsappUrl);
  url.searchParams.set('text', `Hola TreesSide, quiero cotizar el plan ${plan.name}, desde ${formatPlanPrice(plan.price)} COP. Me gustaría confirmar el alcance, los costos adicionales y el plazo para mi negocio.`);
  return url.toString();
}
