import type { ServiceCategory } from './types';
import { ecommerce } from './ecommerce';
import { sistemasDeGestion } from './sistemas-de-gestion';
import { datosYAnalitica } from './datos-y-analitica';
import { logistica } from './logistica';
import { restaurantes } from './restaurantes';
import { streamingYRedes } from './streaming-y-redes';
import { streaming } from './streaming';
import { redesSociales } from './redes-sociales';
import { videojuegos } from './videojuegos';
import { automatizacion } from './automatizacion';
import { inteligenciaArtificial } from './inteligencia-artificial';
import { reservasYCitas } from './reservas-y-citas';
import { agropecuario } from './agropecuario';
import { soporteTecnico } from './soporte-tecnico';
import { marketplaces } from './marketplaces';
import { infraestructura } from './infraestructura';
import { sitiosWeb } from './sitios-web';

/** Visible categories; Streaming and Social Media have independent pages and menu entries. */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  ecommerce, sistemasDeGestion, datosYAnalitica, logistica, restaurantes, streaming, redesSociales, videojuegos, automatizacion,
  inteligenciaArtificial, reservasYCitas, agropecuario, soporteTecnico, marketplaces, infraestructura, sitiosWeb,
];

/** Keep the former combined URL renderable without listing a third service in navigation or SEO. */
export const LEGACY_SERVICE_CATEGORIES: ServiceCategory[] = [streamingYRedes];

export const serviceCategory = (slug: string) => [...SERVICE_CATEGORIES, ...LEGACY_SERVICE_CATEGORIES].find(category => category.slug === slug);
