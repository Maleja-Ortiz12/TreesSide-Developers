import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { AboutMockup } from '@/components/about/AboutMockup';
import { AboutProcess } from '@/components/about/AboutProcess';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata: Metadata = pageMetadata('/nosotros', {
  title: 'Sobre nosotros | TreesSide Developers',
  description: 'Software al alcance de todos, automatización e innovación desde Colombia, con la visión de crecer y llegar a mercados internacionales.',
});

export default function AboutPage() {
  return (
    <SitePage footer={<HomeClosing />}>
      <AboutMockup />
      <AboutProcess />
    </SitePage>
  );
}
