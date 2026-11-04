import type { Project } from '@/data/content';

export const PROJECT_FILTERS = ['Todos', 'Restaurantes', 'Juegos', 'Datos', 'E-commerce'];

// Projects that belong to a group by what they are, not by their catalog category.
const GROUP_BY_ID: Record<string, string> = {
  'equipo-la-lupe': 'Restaurantes',
  'equipo-gametroz': 'Juegos',
  'equipo-ocho80': 'Juegos',
};
const GROUP_BY_CATEGORY: Record<string, string> = {
  Videojuegos: 'Juegos',
  'Análisis de datos': 'Datos',
  'Web & E-Commerce': 'E-commerce',
};

/** Filter group of a project, or undefined when it only appears under Todos. */
export function projectGroup(project: Project): string | undefined {
  return GROUP_BY_ID[project.id] ?? GROUP_BY_CATEGORY[project.category];
}

/** "Group · category" when the project has a group, otherwise just its category. */
export function projectGroupLabel(project: Project) {
  const group = projectGroup(project);
  return group ? `${group} · ${project.category}` : project.category;
}

const MOCKUP_LABEL = 'Ilustración conceptual · No es una captura real';

// Conceptual screens from Images/proyectos mockup.png. La Lupe and Floraltech keep their real images.
const MOCKUP_ART: Record<string, string> = {
  'equipo-emisoras-latinas': '/images/mockup/projects-emisoras.webp',
  'equipo-calculadora-de-contenedores': '/images/mockup/projects-calculadora.webp',
  'equipo-ocho80': '/images/mockup/projects-ocho80.webp',
};

// The mockup's five projects open the catalog, in the mockup's order.
const MOCKUP_ORDER = ['equipo-la-lupe', ...Object.keys(MOCKUP_ART), 'equipo-floraltech-e-commerce'];

/** Catalog order and images for /proyectos; project data itself stays untouched. */
export function withMockupArt(projects: Project[]): Project[] {
  const featured = MOCKUP_ORDER.flatMap(id => projects.filter(project => project.id === id));
  const rest = projects.filter(project => !MOCKUP_ORDER.includes(project.id));
  return [
    ...featured.map(project => MOCKUP_ART[project.id]
      ? { ...project, image: MOCKUP_ART[project.id], imageFit: 'cover' as const, imageLabel: MOCKUP_LABEL }
      : project),
    ...rest,
  ];
}
