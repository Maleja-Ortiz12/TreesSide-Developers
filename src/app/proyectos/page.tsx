import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ProjectsSection } from '@/components/ProjectsSection';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata: Metadata = pageMetadata('/proyectos', {
  title: 'Proyectos | TreesSide Developers',
  description: 'Proyectos de TreesSide Developers y de los integrantes del equipo: aplicaciones web, móviles, videojuegos y automatizaciones.',
});

export default function ProjectsPage() {
  return (
    <SitePage offsetHeader={false} footer={<HomeClosing />}>
      <ProjectsSection />
    </SitePage>
  );
}
