import type { Metadata } from 'next';
import { JetBrains_Mono, Outfit } from 'next/font/google';
import { CONTACT_INFO, SERVICES, SITE_URL } from '@/data/content';
import { BASE_OPEN_GRAPH, SHARE_IMAGE } from '@/lib/metadata';
import { StyledJsxRegistry } from '@/components/StyledJsxRegistry';
import './globals.css';

// Served from this site; a Google Fonts @import would add extra third-party requests before the first paint.
const outfit = Outfit({ subsets: ['latin'], weight: 'variable', display: 'swap', variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TreesSet Developers | Web, tiendas y software para tu negocio',
  description: 'Páginas web, tiendas virtuales y software a medida para recibir clientes, organizar tu negocio y automatizar tareas. Conoce nuestros proyectos y solicita una propuesta.',
  keywords: [
    'TreesSet Developers',
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
  authors: [{ name: 'TreesSet Developers' }],
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'TreesSet Developers | Web, tiendas y software para tu negocio',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TreesSet Developers | Web, tiendas y software para tu negocio',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
    images: [SHARE_IMAGE.url],
  },
  icons: {
    icon: '/images/treesside-icon-v2.png',
    apple: '/images/treesside-apple-v2.png',
  }
};

// Lets search engines and AI assistants identify the company and how to reach it.
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TreesSet Developers',
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
    <html lang="es-419" className={`${outfit.variable} ${mono.variable}`}>
      <head>
        {/* Scroll reveals start hidden until JavaScript animates them in; without it, show them as they are. */}
        <noscript><style>{'[data-reveal]{opacity:1 !important;transform:none !important}'}</style></noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          // Escaping "<" keeps the JSON from ever closing the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION).replace(/</g, '\\u003c') }}
        />
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
