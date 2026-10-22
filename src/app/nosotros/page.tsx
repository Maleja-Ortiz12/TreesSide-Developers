import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { AboutSection } from '@/components/AboutSection';
import { ProcessSection } from '@/components/ProcessSection';

export const metadata: Metadata = {
  title: 'Sobre nosotros | TreesSide Developers',
  description: 'Nuestro objetivo: software al alcance de todos, automatización de procesos e innovación para que Colombia sea un país más tecnológico y productivo.',
};

export default function AboutPage() {
  return (
    <SitePage>
      <AboutSection />
      <ProcessSection />
    </SitePage>
  );
}
