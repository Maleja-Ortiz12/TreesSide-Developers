import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { HomeRedesign } from '@/components/home/HomeRedesign';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata = pageMetadata('/', {
  title: 'Tu negocio puede vender más y trabajar mejor | TreesSide Developers',
  description: 'Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas',
});

export default function HomePage() {
  return (
    <SitePage offsetHeader={false} footer={<HomeClosing showClosing={false} />}>
      <HomeRedesign />
    </SitePage>
  );
}
