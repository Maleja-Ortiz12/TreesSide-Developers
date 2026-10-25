import { SitePage } from '@/components/SitePage';
import { PlansSection } from '@/components/PlansSection';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/planes', {
  title: 'Planes y precios | TreesSide Developers',
  description: 'Cuatro planes acumulativos: Impulso Web desde $500.000 COP, Catálogo Administrable desde $900.000, Vende Online con código a medida y Negocio Integral con automatización. Consulta alcances, exclusiones y costos recurrentes.',
});

export default function PlansPage() {
  return (
    <SitePage>
      <PlansSection />
    </SitePage>
  );
}
