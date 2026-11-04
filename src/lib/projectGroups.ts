import type { Project } from '@/data/content';

const WEB_CATEGORIES = ['Sitios web', 'Web & E-Commerce', 'Radio web', 'Marketplaces'];
const DATA_CATEGORIES = ['Análisis de datos'];

export const PROJECT_FILTERS = ['Todos', 'Web', 'Aplicaciones', 'Datos'];

// The mockup filters by three broad groups; every real category falls in exactly one of them.
export function projectGroup(project: Project) {
  if (WEB_CATEGORIES.includes(project.category)) return 'Web';
  if (DATA_CATEGORIES.includes(project.category)) return 'Datos';
  return 'Aplicaciones';
}

const MOCKUP_LABEL = 'Ilustración conceptual · No es una captura real';

// Artwork cropped from Images/Mockups pagina.png, shown first and in the mockup's order.
const MOCKUP_ART: Record<string, string> = {
  'equipo-la-lupe': '/images/mockup/la-lupe.webp',
  'equipo-emisoras-latinas': '/images/mockup/emisoras-latinas.webp',
  'equipo-calculadora-de-contenedores': '/images/mockup/calculadora-contenedores.webp',
  'equipo-ocho80': '/images/mockup/ocho80.webp',
  'equipo-floraltech-e-commerce': '/images/mockup/floraltech.webp',
};

/** Catalog order and images for /proyectos; project data itself stays untouched. */
export function withMockupArt(projects: Project[]): Project[] {
  const order = Object.keys(MOCKUP_ART);
  const featured = order.flatMap(id => projects.filter(project => project.id === id));
  const rest = projects.filter(project => !order.includes(project.id));
  return [
    ...featured.map(project => ({ ...project, image: MOCKUP_ART[project.id], imageFit: 'cover' as const, imageLabel: MOCKUP_LABEL })),
    ...rest,
  ];
}
