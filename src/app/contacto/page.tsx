import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ContactSection } from '@/components/ContactSection';
import { FaqSection } from '@/components/FaqSection';

export const metadata: Metadata = pageMetadata('/contacto', {
  title: 'Contacto | TreesSide Developers',
  description: 'Cuéntanos tu idea y construyamos juntos tu próximo proyecto de software.',
});

export default function ContactPage() {
  return (
    <SitePage>
      <ContactSection />
      <FaqSection />
    </SitePage>
  );
}
