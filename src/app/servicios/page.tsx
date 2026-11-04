import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';
import { ServicesProcess } from '@/components/services/ServicesProcess';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata: Metadata = pageMetadata('/servicios', {
  title: 'Servicios | TreesSide Developers',
  description: 'Servicios de desarrollo web, bases de datos, soluciones cloud y aplicaciones a medida, junto con las tecnologías que usamos.',
});

export default function ServicesPage() {
  return (
    <SitePage offsetHeader={false} footer={<HomeClosing />}>
      <ServicesSection />
      <TechStackSection />
      <ServicesProcess />
    </SitePage>
  );
}
