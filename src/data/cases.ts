export interface CaseStudy {
  slug: string;
  /** Title of the catalog project; authors and cover image come from the catalog. */
  project: string;
  summary: string;
  context: string;
  challenge: string[];
  solution: string[];
  technologies: string[];
  /** Only facts already published in the catalog or on the live site; the team confirms any new figure. */
  results: string[];
  liveUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'la-lupe',
    project: 'La Lupe',
    summary: 'Sitio web para un restaurante de comida mexicana: carta con precios, platos estrella y cotización de catering por WhatsApp.',
    context: 'La Lupe es un restaurante de comida mexicana que ofrece fajitas, taquizas y platos para compartir, y además lleva su comida a fiestas en casa.',
    challenge: [
      'Mostrar la carta completa con precios, fácil de consultar desde el celular.',
      'Destacar los platos estrella con fotos reales del restaurante.',
      'Convertir el interés por el catering en solicitudes de cotización concretas.',
    ],
    solution: [
      'Menú digital con precios y un enlace directo a cada plato.',
      'Carrusel de platos estrella con fotos reales y acceso al menú.',
      'Sección de catering para fiestas en casa con un botón que abre WhatsApp con el mensaje de cotización ya escrito.',
      'Imágenes optimizadas para que el sitio cargue rápido en el celular.',
    ],
    technologies: ['Next.js', 'Optimización de imágenes', 'Enlaces directos a WhatsApp'],
    results: [
      'El menú con precios está publicado en lalupe.co y cada plato se puede compartir con su propio enlace.',
      'Las solicitudes de catering llegan directo al WhatsApp del restaurante con el mensaje de cotización ya escrito.',
    ],
    liveUrl: 'https://lalupe.co/',
  },
  {
    slug: 'emisoras-latinas',
    project: 'Emisoras Latinas',
    summary: 'Plataforma de radio latina en vivo con un directorio de miles de emisoras y un reproductor optimizado.',
    context: 'Emisoras Latinas es una plataforma para escuchar radio latina en vivo con un directorio de emisoras y un reproductor optimizado.',
    challenge: [
      'Reunir miles de emisoras en un solo lugar y que sea fácil encontrar la indicada.',
      'Reproducir audio en vivo de forma estable.',
      'Atraer visitas desde buscadores y asistentes de inteligencia artificial.',
    ],
    solution: [
      'Directorio completo con más de 15.000 emisoras latinas en vivo.',
      'Reproductor optimizado con Web Audio API.',
      'Estrategia de SEO, AEO y GEO para buscadores y motores de IA.',
    ],
    technologies: ['Next.js', 'Web Audio API', 'SEO · AEO · GEO'],
    results: [
      'Más de 15.000 emisoras latinas disponibles en vivo en un solo directorio.',
      'La plataforma recibe miles de visitas diarias.',
    ],
  },
  {
    slug: 'tengoya',
    project: 'TengoYa',
    summary: 'Marketplace nacional que conecta profesionales verificados con clientes de todo Colombia por WhatsApp.',
    context: 'TengoYa es un marketplace nacional de servicios locales en Colombia.',
    challenge: [
      'Conectar a los clientes con profesionales confiables cerca de ellos.',
      'Llegar a todo el país, no solo a las ciudades principales.',
      'Que el contacto sea inmediato, sin formularios largos.',
    ],
    solution: [
      'Marketplace de servicios locales con profesionales verificados.',
      'Contacto directo con cada profesional por WhatsApp.',
      'Arquitectura SEO y AEO para aparecer en búsquedas locales y en asistentes de IA.',
    ],
    technologies: ['Next.js', 'SEO', 'AEO'],
    results: [
      'Cobertura en más de 1.122 municipios de Colombia.',
      'Clientes y profesionales se contactan directo por WhatsApp.',
    ],
  },
];

export const caseForProject = (title: string) => CASE_STUDIES.find(item => item.project === title);
export const caseHref = (title: string) => {
  const found = caseForProject(title);
  return found ? `/casos/${found.slug}` : undefined;
};
