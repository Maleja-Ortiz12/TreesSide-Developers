import type { Metadata } from 'next';

/** Open Graph fields every page shares; Next replaces (does not merge) a parent openGraph object. */
export const BASE_OPEN_GRAPH = {
  siteName: 'TreesSide Developers',
  locale: 'es_CO',
  type: 'website',
} as const;

// Published as a static file: WhatsApp and other crawlers download it as is, without generating it on each request.
export const SHARE_IMAGE = {
  url: '/images/treesside-share.png',
  type: 'image/png',
  width: 1200,
  height: 630,
  alt: 'TreesSide Developers · Transformamos ideas en soluciones digitales',
};

/** Page metadata whose canonical and share URL point to the page itself instead of the home page. */
export function pageMetadata(path: string, { title, description }: { title: string; description: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, title, description, url: path, images: [SHARE_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE.url] },
  };
}
