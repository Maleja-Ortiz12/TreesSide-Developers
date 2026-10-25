import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { Hero } from '@/components/Hero';
import { HomeDemos } from '@/components/HomeDemos';
import { PlansPreview } from '@/components/PlansSection';
import { ProjectCarousel } from '@/components/motion/ProjectCarousel';

export const metadata = pageMetadata('/', {
  title: 'TreesSide Developers | Transformamos ideas en soluciones digitales',
  description: 'En TreesSide Developers desarrollamos software a medida, combinando creatividad, tecnología y buenas prácticas: Desarrollo Web, Bases de Datos, Soluciones Cloud y Apps a Medida.',
});

export default function HomePage() {
  return (
    <SitePage offsetHeader={false}>
      <Hero />
      <ProjectCarousel />
      <HomeDemos />
      <PlansPreview />
    </SitePage>
  );
}
