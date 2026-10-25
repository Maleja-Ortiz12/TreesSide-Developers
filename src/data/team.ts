export interface MemberProject {
  name: string;
  description: string;
  category: string;
  stack: string;
  /** Local screenshot, project image or explicitly labeled conceptual illustration. */
  image?: string;
  imageFit?: 'cover' | 'contain';
  /** Visible provenance notice; conceptual artwork must never be presented as a real screenshot. */
  imageLabel?: string;
  /** Work done as an employee of another company, shown as the member's experience. */
  experience?: boolean;
  link?: string;
  /** Name of the same project as listed by another member; both are credited on one card. */
  sameAs?: string;
}

export interface TeamMember {
  name: string;
  photo: string;
  photoFit?: 'contain';
  role: string;
  description: string;
  skills: string[];
  portfolio: string;
  contributions: string[];
  education: string;
  /** What the member is passionate about, summarized from their portfolio. */
  passion: string;
  projects: MemberProject[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ronaldo Delgado Correa', photo: '/images/team/ronaldo-delgado.webp',
    role: 'Full Stack · Mobile · IA aplicada',
    description: 'Conecta interfaces, APIs y datos para construir aplicaciones web y móviles, con integraciones cloud e inteligencia artificial aplicada.',
    skills: ['React', 'Next.js', 'NestJS', '.NET / C#', 'PostgreSQL', 'Flutter', 'Azure'],
    portfolio: 'https://ronaldo-delgado.vercel.app/',
    contributions: [
      'Desarrollo de interfaces web y aplicaciones móviles conectadas a APIs REST.',
      'Modelado de datos relacionales e integración de servicios con Node.js y .NET.',
      'Despliegues en Microsoft Azure e integración de asistentes con Azure OpenAI.',
    ],
    education: 'Ingeniero de Sistemas, Universidad de Cundinamarca. Formación complementaria en desarrollo Full Stack y Unity 3D.',
    passion: 'Le apasiona partir de una necesidad concreta y convertirla en una solución completa que conecta interfaces, APIs, datos e inteligencia artificial aplicada.',
    projects: [
      { name: 'Ocho80', description: 'Proyecto propio de rifas y bingo digital con NestJS, React, Flutter y comunicación en tiempo real.', category: 'Tiempo real', stack: 'NestJS · React · Flutter', image: '/images/projects/ocho80.webp' },
      { name: 'Radio Navidad', description: 'Proyecto propio de radio web con reproducción en vivo y administración de contenido visual.', category: 'Radio web', stack: 'Next.js · TypeScript', image: '/images/projects/radio-navidad.webp' },
      { name: 'Calculadora de contenedores', description: 'Aplicación móvil que calcula orientación de cajas, capas, palés, capacidad y peso, con vistas SVG de la distribución de carga.', category: 'Aplicaciones móviles', stack: 'Expo · React Native', image: '/images/projects/calculadora-contenedores.webp', imageLabel: 'Ilustración conceptual · No es una captura real' },
      { name: 'Libres en Cristo Jesús', description: 'Sistema de gestión congregacional con registro de personas y roles, asistencia mediante QR y exportaciones a Excel y PDF.', category: 'Sistemas de gestión', stack: 'NestJS · Next.js · PostgreSQL', image: '/images/projects/libres-en-cristo.webp', imageLabel: 'Ilustración conceptual · No es una captura real' },
      { name: 'La Lupe', description: 'Sitio web para un restaurante de comida mexicana con menú, platos destacados y catering.', category: 'Sitios web', stack: 'Next.js', image: '/images/projects/la-lupe.webp', imageFit: 'contain', link: 'https://lalupe.co/', sameAs: 'La Lupe' },
      { name: 'Luhos', description: 'Plataforma que centraliza la administración de servicios de hotelería y propiedades: limpieza, mantenimiento y gestión de scooters.', category: 'Sistemas de gestión', stack: '.NET 8 · React · Flutter · Azure', image: '/images/projects/luhos.webp', experience: true },
      { name: 'Gudfy', description: 'Comercio electrónico multivendedor de productos digitales con compra y acceso a códigos desde la cuenta del comprador.', category: 'Web & E-Commerce', stack: 'Medusa · Next.js · PostgreSQL', image: '/images/projects/gudfy.webp', experience: true },
      { name: 'Tanku', description: 'Plataforma multivendedor que combina comercio electrónico, comunicación en tiempo real y funciones sociales.', category: 'Web & E-Commerce', stack: 'Medusa · Next.js · Socket.IO', image: '/images/projects/tanku.webp', experience: true },
    ],
  },
  {
    name: 'Jorge Luis Puentes Brochero', photo: '/images/team/jorge-puentes.webp',
    photoFit: 'contain' as const,
    role: 'Desarrollo de software · Datos · Automatización',
    description: 'Ingeniero de Sistemas y Computación con experiencia práctica en desarrollo de software, análisis y gestión de datos, modelado de bases de datos relacionales y automatización de procesos.',
    skills: ['C# / .NET', 'PHP', 'Laravel', 'React', 'Node.js', 'SQL / MySQL', 'Flutter', 'Python', 'n8n'],
    portfolio: 'https://portafolio-xi-liart-92.vercel.app/',
    contributions: [
      'Desarrollo de aplicaciones web con React, PHP y Laravel, y servicios con C# y .NET.',
      'Análisis y gestión de datos, modelado de bases de datos relacionales y trabajo con SQL y MySQL.',
      'Optimización de procesos mediante flujos de automatización con n8n.',
    ],
    education: 'Ingeniería en Sistemas y Computación, Universidad de Cundinamarca — Extensión Chía. Según su portafolio, formación entre enero de 2022 y septiembre de 2026.',
    passion: 'Le apasionan los datos y la automatización: analizar información para tomar mejores decisiones y crear flujos que eliminan el trabajo manual.',
    projects: [
      { name: 'Floraltech E-Commerce', description: 'Tienda en línea con carrito, pasarela de pagos simulada y panel administrativo, presentada en su portafolio.', category: 'Web & E-Commerce', stack: 'PHP · MySQL · Bootstrap', image: '/images/projects/floraltech.webp', link: 'https://floraltech.rf.gd/Original-Floraltech/' },
      { name: 'Atherium 3D Game', description: 'Videojuego de ambientación medieval desarrollado en Unity con mecánicas interactivas y 3D.', category: 'Videojuegos', stack: 'Unity · C#', image: '/images/projects/atherium.webp', link: 'https://jorgepb.itch.io/atherium' },
      { name: 'Otaku Portal', description: 'Página web sobre tendencias, noticias y análisis de videojuegos.', category: 'Sitios web', stack: 'WordPress · PHP · MySQL', image: '/images/projects/otaku-portal.webp', link: 'http://elportaldelotaku.infinityfree.me/' },
      { name: 'API de Tienda + Asistente IA', description: 'API REST por capas para gestionar productos, categorías y clientes, con un asistente RAG que consulta el catálogo en tiempo real.', category: 'APIs e inteligencia artificial', stack: '.NET 8 · EF Core · PostgreSQL', image: '/images/projects/tienda-api.webp', imageLabel: 'Ilustración conceptual · No es una captura real', link: 'https://github.com/jorge-puentes-b/tienda-api-efcore' },
      { name: 'Portfolio CMS', description: 'Sistema dinámico de gestión de contenidos para portafolios con editor visual modular.', category: 'Sitios web', stack: 'PHP · JavaScript · Bootstrap', image: '/images/projects/portfolio-cms.webp' },
      { name: 'Dashboard BI · Superstore', description: 'Dashboard interactivo para analizar ventas, ganancias, clientes y pedidos, con vistas por región, categoría y ubicación.', category: 'Análisis de datos', stack: 'Power BI · DAX · Power Query', image: '/images/projects/dashboard-superstore.webp', imageFit: 'contain' },
      { name: 'EDA · Renta Ciudadana', description: 'Exploración de datos públicos sobre familias focalizadas en Colombia: calidad de datos y distribución por departamento y municipio.', category: 'Análisis de datos', stack: 'Python · Pandas · Seaborn', image: '/images/projects/eda-renta-ciudadana.webp', imageFit: 'contain' },
      { name: 'Análisis de Ventas de Cafetería', description: 'Limpieza y análisis de transacciones para explorar productos, categorías y tendencias diarias, con visualizaciones de ingresos y ventas.', category: 'Análisis de datos', stack: 'Python · Pandas · NumPy', image: '/images/projects/ventas-cafeteria.webp', imageFit: 'contain' },
    ],
  },
  {
    name: 'María Alejandra Ortiz Páez', photo: '/images/team/maria-alejandra-ortiz.webp',
    role: 'Desarrolladora de Software Junior',
    description: 'Desarrollo web, móvil y videojuegos con una visión de seguridad, respaldada por experiencia práctica en ciberseguridad.',
    skills: ['React', 'NestJS', 'Laravel', 'Flutter', 'Unity / C#', 'PostgreSQL'],
    portfolio: 'https://portafolio-bay-tau.vercel.app/',
    contributions: [
      'Desarrollo de proyectos web con React, NestJS y Laravel, y aplicaciones móviles con Flutter.',
      'Creación de videojuegos con Unity y C#.',
      'Experiencia práctica en monitoreo de alertas de seguridad, documentación y automatización de reportes.',
    ],
    education: 'Formación en Tecnología en Análisis y Desarrollo de Software, SENA. Según su portafolio, certificación en trámite. Formación complementaria en backend con NestJS.',
    passion: 'Le apasiona crear software seguro, desde aplicaciones web y móviles hasta videojuegos, y apoyar las ideas de emprendedores con innovación y automatización.',
    projects: [
      { name: 'Dimension Shift', description: 'Videojuego de peleas 3D con escenarios aleatorios y dos niveles, desarrollado con Unity y C#.', category: 'Videojuegos', stack: 'Unity · C#', image: '/images/projects/dimension-shift.webp' },
      { name: 'UptownHair', description: 'Aplicación de reservas para salones de belleza con React, NestJS, TypeScript y MySQL.', category: 'Aplicaciones de reservas', stack: 'React · NestJS · MySQL', image: '/images/projects/uptownhair.webp' },
      { name: 'Emisoras Latinas', description: 'Plataforma de streaming con más de 15.000 emisoras latinas en vivo, directorio completo y reproductor optimizado.', category: 'Radio web', stack: 'Next.js · Web Audio API', image: '/images/projects/emisoras-latinas-cover.webp' },
      { name: 'Entre Lanas y Fragancias', description: 'Sistema de gestión para tiendas textiles: comercio electrónico y panel administrativo.', category: 'Web & E-Commerce', stack: 'Next.js · Laravel · PostgreSQL', image: '/images/projects/entre-lanas-y-fragancias.webp' },
      { name: 'Sistema de gestión de inventarios', description: 'Aplicación web para el control de inventario orientada a pequeños negocios.', category: 'Sistemas de gestión', stack: 'PHP · Laravel', image: '/images/projects/gestion-inventarios.webp', imageLabel: 'Ilustración conceptual · No es una captura real' },
      { name: 'La Lupe', description: 'Sitio web para un restaurante de comida mexicana con menú y precios, platos destacados y cotización de catering por WhatsApp.', category: 'Sitios web', stack: 'Next.js', image: '/images/projects/la-lupe.webp', imageFit: 'contain', link: 'https://lalupe.co/' },
      { name: 'Aplicación de gestión agropecuaria', description: 'Aplicación móvil para agrónomos y ganaderos: ganadería, cultivos, gastos y finanzas agrícolas.', category: 'Aplicaciones móviles', stack: 'Flutter · Dart', image: '/images/projects/gestion-agropecuaria.webp', imageLabel: 'Ilustración conceptual · No es una captura real' },
    ],
  },
  {
    name: 'Jorge Luis Ramírez Trochez', photo: '/images/team/jorge-ramirez.webp',
    role: 'Automation Engineer · Python · IA',
    description: 'Automation Engineer de Bogotá especializado en automatización de procesos (RPA), inteligencia artificial y desarrollo de software, que transforma procesos manuales en soluciones inteligentes.',
    skills: ['UiPath', 'Python', 'Bizagi', 'SAP', 'SQL', 'OpenAI', 'Power BI', 'Next.js', 'Azure'],
    portfolio: 'https://www.jorgeramirez.site/',
    contributions: [
      'Robots de software con UiPath, ReFramework y Orchestrator, integrados con C#, Python y APIs REST.',
      'Análisis de datos con Python, Pandas y SQL, e integración de inteligencia artificial con OpenAI.',
      'Plataformas web con Next.js y SEO técnico, AEO y GEO para buscadores y motores de IA.',
    ],
    education: 'Según su portafolio: Desarrollador RPA UiPath en banca (2026 – actualidad), Analista de Automatización RPA en la industria del papel (2023 – 2026) y Auxiliar de Zona Franca con SAP (2019 – 2023). Ubicado en Bogotá, Colombia.',
    passion: 'Le apasiona convertir procesos manuales en soluciones inteligentes que reducen tiempos, eliminan errores y generan valor real para las empresas.',
    projects: [
      { name: 'TengoYa', description: 'Marketplace nacional de servicios locales que conecta profesionales verificados con clientes en más de 1.122 municipios de Colombia mediante contacto directo por WhatsApp.', category: 'Marketplaces', stack: 'Next.js · SEO · AEO', image: '/images/projects/tengoya.webp' },
      { name: 'CarWeb', description: 'Plataforma para la compra, venta y promoción digital de vehículos en Colombia, con catálogo administrable, filtros avanzados y SEO para el sector automotor.', category: 'Marketplaces', stack: 'Next.js · SEO', image: '/images/projects/carweb.webp' },
      { name: 'Histech', description: 'Plataforma corporativa para una empresa de transformación tecnológica, con portafolio integral de servicios y proyección en LATAM y EE. UU.', category: 'Sitios web', stack: 'Next.js · SEO · B2B', image: '/images/projects/histech.webp' },
      { name: 'Emisoras Latinas', description: 'Plataforma de radios online en vivo con miles de visitas diarias.', category: 'Radio web', stack: 'Next.js · SEO · AEO · GEO', image: '/images/projects/emisoras-latinas-cover.webp', sameAs: 'Emisoras Latinas' },
      { name: 'Christmas Radio Navidad', description: 'Plataforma de streaming de música navideña 24/7, accesible desde cualquier dispositivo sin registro ni instalaciones.', category: 'Radio web', stack: 'Next.js · SEO', image: '/images/projects/radio-navidad.webp', sameAs: 'Radio Navidad' },
      { name: 'Robot Alejo 2.0', description: 'Robot desatendido en UiPath que automatizó el 100% del proceso PICI2, eliminó la digitación manual y redujo un 45% los tiempos de respuesta.', category: 'Automatización RPA', stack: 'UiPath · Python · SQL', image: '/images/projects/robot-alejo.webp', experience: true },
      { name: 'Migración Pega → UiPath', description: 'Migración de procesos legados de Pega hacia UiPath en banca, sin interrumpir la operación.', category: 'Automatización RPA', stack: 'UiPath · ReFramework · Orchestrator', image: '/images/projects/migracion-pega-uipath.webp', imageLabel: 'Ilustración conceptual · No es una captura real', experience: true },
    ],
  },
];
