import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { ContactSection } from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Contacto | TreesSide Developers',
  description: 'Cuéntanos tu idea y construyamos juntos tu próximo proyecto de software.',
};

export default function ContactPage() {
  return (
    <SitePage>
      <ContactSection />
    </SitePage>
  );
}
