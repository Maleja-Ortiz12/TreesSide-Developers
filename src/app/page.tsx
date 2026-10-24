import { SitePage } from '@/components/SitePage';
import { Hero } from '@/components/Hero';
import { HomeDemos } from '@/components/HomeDemos';
import { ProjectCarousel } from '@/components/motion/ProjectCarousel';

export default function HomePage() {
  return (
    <SitePage offsetHeader={false}>
      <Hero />
      <ProjectCarousel />
      <HomeDemos />
    </SitePage>
  );
}
