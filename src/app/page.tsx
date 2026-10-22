import { SitePage } from '@/components/SitePage';
import { Hero } from '@/components/Hero';

export default function HomePage() {
  return (
    <SitePage offsetHeader={false}>
      <Hero />
    </SitePage>
  );
}
