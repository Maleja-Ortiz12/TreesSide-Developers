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
  authors?: { name: string; portfolio: string }[];
  projectUrl?: string;
  imageLabel?: string;
  imageFit?: 'cover' | 'contain';
  experience?: boolean;
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

const slug = (name: string) =>
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const TEAM_PROJECTS: Project[] = TEAM_MEMBERS.flatMap(member =>
  member.projects.filter(project => !project.sameAs).map(project => {
    // Members who list the same project are credited on this single card.
    const coAuthors = TEAM_MEMBERS.filter(other =>
      other !== member && other.projects.some(item => item.sameAs === project.name));
    const authors = [member, ...coAuthors].map(author => ({ name: author.name, portfolio: author.portfolio }));
    return {
      id: `equipo-${slug(project.name)}`,
      title: project.name,
      tag: project.stack,
      description: project.description,
      detailedDescription: project.description,
      image: project.image ?? '/images/treesside-logo.jpg',
      imageFit: project.imageFit,
      imageLabel: project.imageLabel ?? (project.image ? undefined : 'Imagen de marca · consulta el proyecto en el portafolio'),
      category: project.category,
      owner: authors.map(author => author.name).join(' y '),
      authors,
      portfolioUrl: member.portfolio,
      projectUrl: project.link,
      experience: project.experience,
    };
  })
);

// Own projects first; employer work follows as the member's experience.
export const FEATURED_PROJECTS: Project[] = [
  ...TEAM_PROJECTS.filter(project => !project.experience),
  ...TEAM_PROJECTS.filter(project => project.experience),
];

export const SERVICES: Service[] = [
  {
    id: 'desarrollo-web',
    title: 'Desarrollo Web',
    iconName: 'code',
    items: [
      'Interfaces con React, Next.js, TypeScript y Tailwind CSS',
      'Backend con NestJS, Laravel y .NET',
      'Comercio electrónico multivendedor, tiendas en línea, aplicaciones de reservas y APIs REST',
      'Sitios y gestores de contenido con WordPress',
      'SEO técnico, AEO y GEO para buscadores y motores de IA'
    ]
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de Datos',
    iconName: 'database',
    items: [
      'Modelado relacional en PostgreSQL, MySQL y SQL Server',
      'Consultas SQL y optimización',
      'Prisma, TypeORM y Entity Framework Core',
      'Sistemas de gestión: inventarios, operaciones por rol y asistencia con QR'
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    iconName: 'cloud',
    items: [
      'Despliegues en Microsoft Azure: App Service, Static Web Apps y Blob Storage',
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
      'Dashboards en Power BI con DAX y Power Query',
      'Análisis exploratorio de datos con Python y Pandas',
      'Paneles de indicadores para decisiones de negocio'
    ]
  },
  {
    id: 'seguridad-mantenimiento',
    title: 'Seguridad & Mantenimiento',
    iconName: 'shield',
    items: [
      'Autenticación JWT y control por roles',
      'Monitoreo con SIEM y WAF; apoyo en controles NIST e ISO 27001',
      'Documentación, seguimiento de incidencias y mantenimiento'
    ]
  },
  {
    id: 'videojuegos', title: 'Videojuegos con Unity', iconName: 'code',
    items: ['Prototipos y juegos 3D con Unity y C#', 'Mecánicas de juego e interfaces', 'Experiencias interactivas']
  },
  {
    id: 'automatizacion', title: 'Automatización con n8n', iconName: 'code',
    items: ['RPA con UiPath: robots desatendidos y Orchestrator', 'Flujos con n8n y Power Automate', 'Modelado de procesos con Bizagi', 'Automatización de reportes e integración con SAP y APIs']
  },
  {
    id: 'plataformas-conectadas', title: 'Plataformas conectadas', iconName: 'cloud',
    items: ['Radio web y administración de contenido', 'Chat y eventos en tiempo real con Socket.IO', 'Asistentes internos con Azure OpenAI y conocimiento aprobado']
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
  { name: 'Linux', category: 'Sistema operativo', color: '#fcc624' },
  { name: 'Tailwind CSS', category: 'Frontend', color: '#38bdf8' },
  { name: 'Bootstrap', category: 'Frontend', color: '#7952b3' },
  { name: 'WordPress', category: 'Gestor de contenido', color: '#21759b' },
  { name: 'Socket.IO', category: 'Tiempo real', color: '#e2e8f0' },
  { name: 'Prisma', category: 'Base de datos', color: '#5a67d8' },
  { name: 'Pandas', category: 'Análisis de datos', color: '#e70488' },
  { name: 'Expo', category: 'Móvil', color: '#e2e8f0' },
  { name: 'GitHub Actions', category: 'DevOps', color: '#2088ff' },
  { name: 'Power Automate', category: 'Automatización', color: '#0066ff' },
  { name: 'HTML y CSS', category: 'Frontend', color: '#e34f26' },
  { name: 'Vite', category: 'Frontend', color: '#bd34fe' },
  { name: 'Framer Motion', category: 'Animación', color: '#e2e8f0' },
  { name: 'Medusa', category: 'Comercio electrónico', color: '#e2e8f0' },
  { name: 'Firebase', category: 'Notificaciones', color: '#ffca28' },
  { name: 'Excel', category: 'Analítica', color: '#217346' },
  { name: 'UiPath', category: 'Automatización RPA', color: '#fa4616' },
  { name: 'Bizagi', category: 'Procesos de negocio', color: '#1fa7e0' },
  { name: 'SAP', category: 'ERP', color: '#0faaff' },
  { name: 'NumPy', category: 'Análisis de datos', color: '#4dabcf' },
  { name: 'OpenAI', category: 'Inteligencia artificial', color: '#e2e8f0' }
];

export const PURPOSE_PILLARS: ValuePillar[] = [
  {
    title: 'Software al alcance de todos',
    description: 'Creamos software accesible y a la medida de cada necesidad, para que la tecnología no sea un privilegio de pocos.',
    iconName: 'globe'
  },
  {
    title: 'Automatizar lo repetitivo',
    description: 'Automatizamos tareas para quitar los procesos manuales repetitivos y liberar tiempo para lo que realmente aporta valor.',
    iconName: 'workflow'
  },
  {
    title: 'Innovar con propósito',
    description: 'Queremos innovar: buscamos nuevas formas de resolver problemas reales con tecnología moderna.',
    iconName: 'lightbulb'
  },
  {
    title: 'Para empresas de todo tamaño',
    description: 'Acompañamos desde microempresas y pequeños emprendimientos hasta grandes empresas.',
    iconName: 'building'
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

export const SITE_URL = 'https://softzenkododevs.com';

export const CONTACT_INFO = {
  email: 'correo@softzenkododevs.com',
  location: 'Colombia',
  phone: '+57 305 717 3986',
  whatsappUrl: 'https://wa.me/573057173986?text=Hola%20TreesSide%20Developers,%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto',
};
