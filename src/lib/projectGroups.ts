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

// Keep the mockup's opening order without substituting its small screen crops for project media.
const MOCKUP_ORDER = ['equipo-la-lupe', 'equipo-emisoras-latinas', 'equipo-calculadora-de-contenedores', 'equipo-ocho80', 'equipo-floraltech-e-commerce'];

/** Catalog ordering only; every project retains its original media and provenance. */
export function withMockupArt(projects: Project[]): Project[] {
  return [
    ...MOCKUP_ORDER.flatMap(id => projects.filter(project => project.id === id)),
    ...projects.filter(project => !MOCKUP_ORDER.includes(project.id)),
  ];
}
