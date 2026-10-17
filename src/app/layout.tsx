import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoftZenkodoDevs | Transformamos ideas en soluciones digitales',
  description: 'En SoftZenkodoDevs desarrollamos software a medida, combinando creatividad, tecnología y buenas prácticas: Desarrollo Web, Bases de Datos, Soluciones Cloud y Apps a Medida.',
  keywords: [
    'SoftZenkodoDevs',
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
  authors: [{ name: 'SoftZenkodoDevs' }],
  openGraph: {
    title: 'SoftZenkodoDevs | Transformamos ideas en soluciones digitales',
    description: 'Desarrollo de software a medida, aplicaciones web, soluciones cloud e inteligencia de negocios.',
    url: 'https://softzenkododevs.com',
    siteName: 'SoftZenkodoDevs',
    locale: 'es_CO',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/logo.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
