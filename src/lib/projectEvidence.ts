import type { Project } from '@/data/content';

/** Client attribution must be explicit; an author's portfolio is not a company contract. */
export function projectEvidenceLabel(project: Project) {
  if (project.experience) return 'Experiencia laboral';
  if (project.client) return 'Proyecto para cliente';
  return 'Proyecto personal del equipo';
}
