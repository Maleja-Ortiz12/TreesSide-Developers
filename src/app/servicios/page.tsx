import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';

export const metadata: Metadata = {
  title: 'Servicios | TreesSide Developers',
  description: 'Servicios de desarrollo web, bases de datos, soluciones cloud y aplicaciones a medida, junto con las tecnologías que usamos.',
};

export default function ServicesPage() {
  return (
    <SitePage>
      <ServicesSection />
      <TechStackSection />
    </SitePage>
  );
}
