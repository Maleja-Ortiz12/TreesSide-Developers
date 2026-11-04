import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SitePage } from '@/components/SitePage';
import { ContactSection } from '@/components/ContactSection';
import { ContactTopics } from '@/components/contact/ContactTopics';
import { FaqSection } from '@/components/FaqSection';
import { HomeClosing } from '@/components/home/HomeClosing';

export const metadata: Metadata = pageMetadata('/contacto', {
  title: 'Contacto | TreesSide Developers',
  description: 'Cuéntanos tu idea y construyamos juntos tu próximo proyecto de software.',
});

export default function ContactPage() {
  return (
    <SitePage footer={<HomeClosing />}>
      <ContactSection />
      <ContactTopics />
      <FaqSection />
    </SitePage>
  );
}
