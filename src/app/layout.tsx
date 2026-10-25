import type { Metadata } from 'next';
import { CONTACT_INFO, SERVICES, SITE_URL } from '@/data/content';
import { BASE_OPEN_GRAPH } from '@/lib/metadata';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TreesSide Developers | Transformamos ideas en soluciones digitales',
  description: 'En TreesSide Developers desarrollamos software a medida, combinando creatividad, tecnología y buenas prácticas: Desarrollo Web, Bases de Datos, Soluciones Cloud y Apps a Medida.',
  keywords: [
    'TreesSide Developers',
    'Desarrollo de Software',
    'Desarrollo Web',
    'Colombia',
    'React',
    'Next.js',
    'Node.js',
    'Cloud',
    'Power BI',
    'Software a medida'
  ],
  authors: [{ name: 'TreesSide Developers' }],
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'TreesSide Developers | Transformamos ideas en soluciones digitales',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TreesSide Developers | Transformamos ideas en soluciones digitales',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
  },
  icons: {
    icon: '/images/treesside-logo.jpg',
    apple: '/images/treesside-logo.jpg',
  }
};

// Lets search engines and AI assistants identify the company and how to reach it.
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TreesSide Developers',
  url: SITE_URL,
  logo: `${SITE_URL}/images/treesside-logo.jpg`,
  email: CONTACT_INFO.email,
  telephone: CONTACT_INFO.phone,
  address: { '@type': 'PostalAddress', addressCountry: 'CO' },
  areaServed: 'CO',
  knowsAbout: SERVICES.map(service => service.title),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    availableLanguage: ['es'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-419">
      <head>
        <link rel="icon" href="/images/treesside-logo.jpg" />
        {/* Scroll reveals start hidden until JavaScript animates them in; without it, show them as they are. */}
        <noscript><style>{'[data-reveal]{opacity:1 !important;transform:none !important}'}</style></noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          // Escaping "<" keeps the JSON from ever closing the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
