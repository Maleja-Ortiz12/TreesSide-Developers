import { SitePage } from '@/components/SitePage';
import { Hero } from '@/components/Hero';
import { HomeDemos } from '@/components/HomeDemos';

export default function HomePage() {
  return (
    <SitePage offsetHeader={false}>
      <Hero />
      <HomeDemos />
    </SitePage>
  );
}
