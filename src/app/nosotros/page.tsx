import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { AboutSection } from '@/components/AboutSection';
import { ProcessSection } from '@/components/ProcessSection';

export const metadata: Metadata = pageMetadata('/nosotros', {
  title: 'Sobre nosotros | TreesSide Developers',
  description: 'Software al alcance de todos, automatización e innovación desde Colombia, con la visión de crecer y llegar a mercados internacionales.',
});

export default function AboutPage() {
  return (
    <SitePage>
      <AboutSection />
      <ProcessSection />
    </SitePage>
  );
}
