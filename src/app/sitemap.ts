import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/content';
import { CASE_STUDIES } from '@/data/cases';

const ROUTES = [
  '', '/servicios', '/planes', '/proyectos', '/casos', ...CASE_STUDIES.map(item => `/casos/${item.slug}`),
  '/nosotros', '/equipo', '/contacto', '/politica-de-datos',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(route => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : route === '/politica-de-datos' ? 0.3 : 0.8,
  }));
}
