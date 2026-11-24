import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ProjectCarousel } from '@/components/motion/ProjectCarousel';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata: Metadata = pageMetadata('/proyectos', {
  title: 'Proyectos | TreesSet Developers',
  description: 'Proyectos de TreesSet Developers y de los integrantes del equipo: aplicaciones web, móviles, videojuegos y automatizaciones.',
});

export default function ProjectsPage() {
  return (
    <SitePage footer={<HomeClosing />}>
      <ProjectCarousel />
      <ProjectsSection />
    </SitePage>
  );
}
