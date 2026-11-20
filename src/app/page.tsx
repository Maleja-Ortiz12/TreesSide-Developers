import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { Hero } from '@/components/Hero';
import { HomeDemos } from '@/components/HomeDemos';
import { ProjectCarousel } from '@/components/motion/ProjectCarousel';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata = pageMetadata('/', {
  title: 'Tu negocio puede vender más y trabajar mejor con el software adecuado | TreesSide Developers',
  description: 'Creamos páginas web, tiendas y plataformas a medida para negocios que necesitan recibir clientes, organizar su operación y automatizar tareas',
});

export default function HomePage() {
  return (
    <SitePage offsetHeader={false} footer={<HomeClosing />}>
      <Hero />
      <ProjectCarousel />
      <HomeDemos />
    </SitePage>
  );
}
