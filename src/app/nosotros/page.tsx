import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { AboutSection } from '@/components/AboutSection';
import { TeamSection } from '@/components/TeamSection';
import { ProcessSection } from '@/components/ProcessSection';

export const metadata: Metadata = {
  title: 'Sobre nosotros | TreesSide Developers',
  description: 'Quiénes somos, el equipo detrás de TreesSide Developers y cómo trabajamos cada proyecto.',
};

export default function AboutPage() {
  return (
    <SitePage>
      <AboutSection />
      <TeamSection />
      <ProcessSection />
    </SitePage>
  );
}
