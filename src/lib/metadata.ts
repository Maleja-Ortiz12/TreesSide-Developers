import type { Metadata } from 'next';

/** Open Graph fields every page shares; Next replaces (does not merge) a parent openGraph object. */
export const BASE_OPEN_GRAPH = {
  siteName: 'TreesSide Developers',
  locale: 'es_CO',
  type: 'website',
} as const;

// A page that sets its own openGraph stops inheriting src/app/opengraph-image, so it is listed explicitly.
const SHARE_IMAGE = {
  url: '/opengraph-image',
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
