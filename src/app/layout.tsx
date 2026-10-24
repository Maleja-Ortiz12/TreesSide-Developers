import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
    title: 'TreesSide Developers | Transformamos ideas en soluciones digitales',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
    url: 'https://softzenkododevs.com',
    siteName: 'TreesSide Developers',
    locale: 'es_CO',
    type: 'website',
  },
  icons: {
    icon: '/images/treesside-logo.jpg',
    apple: '/images/treesside-logo.jpg',
  }
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
      <body>{children}</body>
    </html>
  );
}
