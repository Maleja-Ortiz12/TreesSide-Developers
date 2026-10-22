import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { ProjectsSection } from '@/components/ProjectsSection';

export const metadata: Metadata = {
  title: 'Proyectos | TreesSide Developers',
  description: 'Proyectos de TreesSide Developers y de los integrantes del equipo: aplicaciones web, móviles, videojuegos y automatizaciones.',
};

export default function ProjectsPage() {
  return (
    <SitePage>
      <ProjectsSection />
    </SitePage>
  );
}
