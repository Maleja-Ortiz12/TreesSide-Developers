import { TEAM_MEMBERS } from './team';

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
  owner?: string;
  portfolioUrl?: string;
  imageLabel?: string;
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

const ORIGINAL_PROJECTS: Project[] = [
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

const PROJECT_CATEGORIES: Record<string, string> = {
  Ocho80: 'Tiempo real',
  'Radio Navidad': 'Radio web',
  'Floraltech E-Commerce': 'Web & E-Commerce',
  'Dimension Shift': 'Videojuegos',
  UptownHair: 'Aplicaciones de reservas',
};

const PROJECT_STACKS: Record<string, string> = {
  Ocho80: 'NestJS · React · Flutter',
  'Radio Navidad': 'Next.js · TypeScript',
  'Floraltech E-Commerce': 'PHP · MySQL',
  'Dimension Shift': 'Unity · C#',
  UptownHair: 'React · NestJS · MySQL',
};

const PERSONAL_PROJECTS: Project[] = TEAM_MEMBERS.flatMap(member =>
  member.projects.map(project => ({
    id: `equipo-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: project.name,
    tag: PROJECT_STACKS[project.name] ?? 'Proyecto del equipo',
    description: project.description,
    detailedDescription: project.description,
    image: '/images/treesside-logo.jpg',
    imageLabel: 'Imagen de marca · consulta el proyecto en el portafolio',
    category: PROJECT_CATEGORIES[project.name] ?? 'Otros proyectos',
    owner: member.name,
    portfolioUrl: member.portfolio,
  }))
);

// Floraltech is the same portfolio project, not a separate company commission.
export const FEATURED_PROJECTS: Project[] = [
  ...ORIGINAL_PROJECTS.filter(project => project.id !== 'floraltech'),
  ...PERSONAL_PROJECTS,
];

export const SERVICES: Service[] = [
  {
    id: 'desarrollo-web',
    title: 'Desarrollo Web',
    iconName: 'code',
    items: [
      'Interfaces con React, Next.js y TypeScript',
      'Backend con NestJS, Laravel y .NET',
      'Tiendas en línea, aplicaciones de reservas y APIs REST'
    ]
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de Datos',
    iconName: 'database',
    items: [
      'Modelado relacional en PostgreSQL y MySQL',
      'Consultas SQL y optimización',
      'Inventarios y sistemas de gestión'
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    iconName: 'cloud',
    items: [
      'Despliegues en Microsoft Azure',
      'Docker y contenedores',
      'CI/CD con GitHub Actions'
    ]
  },
  {
    id: 'aplicaciones-moviles',
    title: 'Aplicaciones Móviles',
    iconName: 'smartphone',
    items: [
      'Aplicaciones con Flutter y Dart',
      'React Native y Expo',
      'Reservas, gestión y aplicaciones conectadas a APIs'
    ]
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence',
    iconName: 'bar-chart',
    items: [
      'Reportes con SQL y Power BI',
      'ETL y modelado de datos',
      'Paneles de indicadores para decisiones de negocio'
    ]
  },
  {
    id: 'seguridad-mantenimiento',
    title: 'Seguridad & Mantenimiento',
    iconName: 'shield',
    items: [
      'Apoyo en monitoreo de alertas',
      'Documentación y seguimiento de incidencias',
      'Mantenimiento y actualizaciones'
    ]
  },
  {
    id: 'videojuegos', title: 'Videojuegos con Unity', iconName: 'code',
    items: ['Prototipos y juegos 3D con Unity y C#', 'Mecánicas de juego e interfaces', 'Experiencias interactivas']
  },
  {
    id: 'automatizacion', title: 'Automatización con n8n', iconName: 'code',
    items: ['Flujos de trabajo e integraciones', 'Automatización de reportes', 'Conexión entre APIs y herramientas de negocio']
  },
  {
    id: 'plataformas-conectadas', title: 'Plataformas conectadas', iconName: 'cloud',
    items: ['Radio web y administración de contenido', 'Sistemas de eventos con comunicación en tiempo real', 'Asistentes internos con Azure OpenAI y conocimiento aprobado']
  }
];

export const TECHNOLOGIES: Technology[] = [
  { name: 'JavaScript', category: 'Lenguaje', color: '#f7df1e' },
  { name: 'TypeScript', category: 'Lenguaje', color: '#3178c6' },
  { name: 'PHP', category: 'Lenguaje', color: '#8993be' },
  { name: 'Dart', category: 'Lenguaje', color: '#54c5f8' },
  { name: 'SQL', category: 'Lenguaje de consultas', color: '#38bdf8' },
  { name: 'C++', category: 'Lenguaje', color: '#00599c' },
  { name: 'Next.js', category: 'Frontend', color: '#ffffff' },
  { name: 'NestJS', category: 'Backend', color: '#e0234e' },
  { name: 'PostgreSQL', category: 'Base de datos', color: '#4169e1' },
  { name: 'Flutter', category: 'Móvil', color: '#54c5f8' },
  { name: 'React Native', category: 'Móvil', color: '#61dafb' },
  { name: 'Unity', category: 'Videojuegos', color: '#cbd5e1' },
  { name: 'n8n', category: 'Automatización', color: '#ff6d5a' },
  { name: 'Azure', category: 'Nube', color: '#0089d6' },
  { name: 'C#', category: 'Backend', color: '#9b4993' },
  { name: '.NET', category: 'Backend', color: '#512bd4' },
  { name: 'React', category: 'Frontend', color: '#61dafb' },
  { name: 'Node.js', category: 'Backend', color: '#339933' },
  { name: 'MySQL', category: 'Base de datos', color: '#00758f' },
  { name: 'SQL Server', category: 'Base de datos', color: '#cc292b' },
  { name: 'Laravel', category: 'Backend', color: '#ff2d20' },
  { name: 'Python', category: 'Lenguaje', color: '#3776ab' },
  { name: 'Power BI', category: 'Analítica', color: '#f2c811' },
  { name: 'Docker', category: 'DevOps', color: '#2496ed' },
  { name: 'Git', category: 'Herramientas', color: '#f05032' },
  { name: 'Linux', category: 'Sistema operativo', color: '#fcc624' }
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
  whatsappUrl: 'https://wa.me/573001234567?text=Hola%20TreesSide%20Developers,%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    x: 'https://x.com'
  }
};
