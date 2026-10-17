export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  category: string;
  detailedDescription?: string;
  features?: string[];
  client?: string;
  year?: string;
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  items: string[];
}

export interface ValuePillar {
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface Technology {
  name: string;
  category: string;
  color: string;
}

export const QUICK_FEATURES = [
  {
    icon: 'code',
    title: 'Desarrollo Web',
    desc: 'Aplicaciones modernas, escalables y seguras.'
  },
  {
    icon: 'database',
    title: 'Bases de Datos',
    desc: 'Diseño, optimización y administración de datos.'
  },
  {
    icon: 'cloud',
    title: 'Soluciones Cloud',
    desc: 'Despliegues, integración y automatización.'
  },
  {
    icon: 'cpu',
    title: 'Apps a Medida',
    desc: 'Ideas únicas, soluciones personalizadas.'
  }
];

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'spacerolloph-vr',
    title: 'Spacerolloph VR',
    tag: 'Unity + C#',
    description: 'Plataforma de remodelación de hogares en realidad virtual.',
    image: '/images/spacerolloph-vr.jpg',
    category: 'Realidad Virtual',
    detailedDescription: 'Spacerolloph VR permite a arquitectos, diseñadores de interiores y propietarios visualizar remodelaciones espaciales en tiempo real a escala 1:1 antes de iniciar obras físicas.',
    features: [
      'Renderizado fotorrealista en tiempo real',
      'Configurador de materiales y mobiliario interactivo',
      'Soporte para visores Meta Quest y PCVR',
      'Cálculo de presupuestos dinámicos según selección'
    ],
    client: 'Arquitectura & Diseño Studio',
    year: '2024'
  },
  {
    id: 'floraltech',
    title: 'FloralTech',
    tag: 'PHP + MySQL',
    description: 'Sistema de gestión para floristería (e-commerce, inventario, reportes).',
    image: '/images/floraltech.jpg',
    category: 'Web & E-Commerce',
    detailedDescription: 'Una solución integral de punto de venta (POS) y tienda online para floristerías de alta gama con control de pedidos perecederos, entregas programadas y reportes financieros.',
    features: [
      'Catálogo de flores y arreglos con control de caducidad',
      'E-commerce integrado con pasarela de pagos seguros',
      'Módulo de logística y rutas de entrega en tiempo real',
      'Facturación electrónica y reportes de ventas automáticos'
    ],
    client: 'Red Floral Colombia',
    year: '2024'
  },
  {
    id: 'business-analytics',
    title: 'Business Analytics',
    tag: 'SQL Server + Power BI',
    description: 'Análisis de datos y visualización interactiva para toma de decisiones.',
    image: '/images/business-analytics.jpg',
    category: 'Business Intelligence',
    detailedDescription: 'Ecosistema de inteligencia de negocios para empresas corporativas, centralizando millones de transacciones en dashboards intuitivos con analítica predictiva de KPIs.',
    features: [
      'Pipelines ETL automatizados para ingesta multi-fuente',
      'Dashboards ejecutivos con métricas de ventas y rentabilidad',
      'Modelado de datos en SQL Server con optimización de índices',
      'Alertas tempranas automatizadas ante desviaciones de metas'
    ],
    client: 'Corporación Financiera Andina',
    year: '2024'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'desarrollo-web',
    title: 'Desarrollo Web',
    iconName: 'code',
    items: [
      'Frontend (React, Vue, Angular)',
      'Backend (Node.js, Laravel, .NET)',
      'APIs y microservicios'
    ]
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de Datos',
    iconName: 'database',
    items: [
      'Diseño de esquemas',
      'Consultas y optimización',
      'Migración de datos'
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    iconName: 'cloud',
    items: [
      'Deploy en la nube',
      'Docker y contenedores',
      'CI/CD y automatización'
    ]
  },
  {
    id: 'aplicaciones-moviles',
    title: 'Aplicaciones Móviles',
    iconName: 'smartphone',
    items: [
      'Android / iOS',
      'React Native / Flutter',
      'Integración con APIs'
    ]
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    iconName: 'bar-chart',
    items: [
      'Power BI / Tableau',
      'ETL y modelado de datos',
      'Dashboards interactivos'
    ]
  },
  {
    id: 'seguridad-mantenimiento',
    title: 'Seguridad & Mantenimiento',
    iconName: 'shield',
    items: [
      'Pruebas y auditorías',
      'Monitoreo y soporte',
      'Actualizaciones'
    ]
  }
];

export const TECHNOLOGIES: Technology[] = [
  { name: 'C#', category: 'Backend', color: '#9b4993' },
  { name: '.NET', category: 'Backend', color: '#512bd4' },
  { name: 'React', category: 'Frontend', color: '#61dafb' },
  { name: 'Node.js', category: 'Backend', color: '#339933' },
  { name: 'MySQL', category: 'Database', color: '#00758f' },
  { name: 'SQL Server', category: 'Database', color: '#cc292b' },
  { name: 'Laravel', category: 'Backend', color: '#ff2d20' },
  { name: 'Python', category: 'Language', color: '#3776ab' },
  { name: 'Power BI', category: 'Analytics', color: '#f2c811' },
  { name: 'Docker', category: 'DevOps', color: '#2496ed' },
  { name: 'Git', category: 'Tools', color: '#f05032' },
  { name: 'Linux', category: 'System', color: '#fcc624' }
];

export const VALUE_PILLARS: ValuePillar[] = [
  {
    title: 'Innovación Constante',
    description: 'Exploramos nuevas tecnologías para construir productos de vanguardia.',
    iconName: 'sparkles'
  },
  {
    title: 'Trabajo en Equipo',
    description: 'Colaboración cercana contigo y entre nosotros para asegurar el éxito.',
    iconName: 'users'
  },
  {
    title: 'Calidad en el Código',
    description: 'Arquitecturas limpias, escalables y con las mejores prácticas del sector.',
    iconName: 'check-circle'
  },
  {
    title: 'Enfoque en el Cliente',
    description: 'Tus objetivos y el valor para tus usuarios son el norte de cada entrega.',
    iconName: 'target'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Analizamos',
    description: 'Entendemos tus necesidades.'
  },
  {
    step: 2,
    title: 'Diseñamos',
    description: 'Planificamos la mejor solución.'
  },
  {
    step: 3,
    title: 'Desarrollamos',
    description: 'Construimos con metodologías ágiles.'
  },
  {
    step: 4,
    title: 'Entregamos',
    description: 'Soporte y mejora continua.'
  }
];

export const CONTACT_INFO = {
  email: 'correo@softzenkododevs.com',
  location: 'Colombia',
  phone: '+57 300 123 4567',
  whatsappUrl: 'https://wa.me/573001234567?text=Hola%20SoftZenkodoDevs,%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    x: 'https://x.com'
  }
};
