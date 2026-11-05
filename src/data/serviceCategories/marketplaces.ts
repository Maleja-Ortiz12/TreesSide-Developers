import { CircleCheck, CodeXml, Layers, LayoutList, Pencil, Puzzle, Search, Settings, ShoppingCart, Store, Users } from 'lucide-react';
import type { ServiceCategory } from './types';

// Copy from Images/Servicios y planes para marketplaces-13.png.
export const marketplaces: ServiceCategory = {
  slug: 'marketplaces',
  label: 'Marketplaces',
  icon: Store,
  metaTitle: 'Desarrollo de marketplaces a la medida | TreesSide Developers',
  metaDescription: 'Desarrollamos marketplaces a la medida para que vendedores y compradores publiquen, exploren y gestionen su intercambio en un mismo lugar, con roles e integraciones.',
  hero: {
    badge: 'Marketplaces',
    title: 'Conecta una comunidad',
    highlight: 'alrededor de tu plataforma.',
    lead: 'Desarrollamos marketplaces a la medida para que vendedores y compradores se encuentren, publiquen, exploren y gestionen su intercambio en un mismo lugar.',
    cta: 'Solicita una consultoría',
  },
  offers: {
    title: '¿Qué puedes hacer en tu marketplace?',
    items: [
      { icon: Pencil, title: 'Publicaciones', text: 'Crea y gestiona publicaciones de múltiples vendedores.' },
      { icon: Search, title: 'Búsqueda', text: 'Encuentra fácilmente productos o servicios con filtros útiles.' },
      { icon: Users, title: 'Roles', text: 'Define roles como administrador, vendedor y comprador.' },
      { icon: Puzzle, title: 'Integraciones', text: 'Conecta tu plataforma con servicios externos según tus necesidades.' },
    ],
  },
  concept: {
    title: 'Un marketplace multi-vendedor, claro y administrable.',
    text: 'Referencia conceptual de una plataforma donde múltiples vendedores publican sus productos o servicios, los usuarios exploran con filtros y gestionan sus interacciones de forma organizada.',
    alt: 'Vista conceptual: marketplace con buscador, menú de categorías, vendedores, pedidos y favoritos, y productos publicados por distintos vendedores.',
  },
  plans: {
    title: 'Planes propuestos',
    lead: 'Te proponemos tres planes de implementación, que se ajustan al alcance y nivel de funcionalidad que necesitas para tu marketplace.',
    items: [
      { icon: LayoutList, name: 'Directorio especializado', badge: 'Implementación (único pago)', summary: 'Un punto de encuentro digital para visibilizar vendedores, productos o servicios de un sector específico.', scopeLabel: 'Alcance del plan', scope: ['Perfiles de vendedores o negocios.', 'Publicaciones de productos o servicios.', 'Filtros de búsqueda por categorías y atributos.', 'Opciones de contacto (formulario o enlaces).'] },
      { icon: Settings, name: 'Marketplace administrable', badge: 'Implementación (único pago)', summary: 'Una plataforma con control y gestión centralizada para operar un marketplace de múltiples vendedores.', scopeLabel: 'Alcance del plan', scope: ['Paneles por rol (administrador, vendedor y comprador).', 'Moderación de publicaciones (revisión, aprobación y desactivación).', 'Gestión de publicaciones (crear, editar, activar, desactivar).'] },
      { icon: ShoppingCart, name: 'Plataforma transaccional', badge: 'Implementación (único pago)', summary: 'Un marketplace completo para gestionar la experiencia de compra de principio a fin, con transacciones en línea según el alcance definido.', scopeLabel: 'Alcance del plan', scope: ['Gestión de pedidos (creación, seguimiento y estado).', 'Pagos en línea (integración según el alcance).', 'Reglas comerciales (comisiones, condiciones de venta, políticas operativas, según el negocio).'] },
    ],
    notes: ['Comisiones, validaciones e integraciones se definen antes de construir.', 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.'],
  },
  process: {
    title: 'Proceso de entrega',
    lead: 'Un proceso claro y colaborativo en 4 etapas para llevar tu marketplace de la idea a la operación.',
    steps: [
      { icon: Layers, title: 'Modelo', text: 'Definimos el alcance, los roles, las reglas del negocio y la estructura.' },
      { icon: Pencil, title: 'Experiencia', text: 'Diseñamos la experiencia de usuario (UX/UI) y la estructura de la plataforma.' },
      { icon: CodeXml, title: 'Integración', text: 'Desarrollamos la plataforma e integramos los servicios necesarios según el alcance.' },
      { icon: CircleCheck, title: 'Validación', text: 'Probamos, ajustamos detalles y preparamos la entrega.' },
    ],
  },
  cta: { title: '¿Quieres definir el plan ideal para tu marketplace?', text: 'Conversamos sobre tu idea, el alcance y las funcionalidades que necesitas.', button: 'Agenda una consultoría' },
};
