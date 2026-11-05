import type { ServiceCategory } from './types';
import { ecommerce } from './ecommerce';
import { sistemasDeGestion } from './sistemas-de-gestion';
import { datosYAnalitica } from './datos-y-analitica';
import { logistica } from './logistica';
import { restaurantes } from './restaurantes';
import { streamingYRedes } from './streaming-y-redes';
import { videojuegos } from './videojuegos';
import { automatizacion } from './automatizacion';
import { inteligenciaArtificial } from './inteligencia-artificial';
import { reservasYCitas } from './reservas-y-citas';
import { agropecuario } from './agropecuario';
import { soporteTecnico } from './soporte-tecnico';
import { marketplaces } from './marketplaces';
import { infraestructura } from './infraestructura';
import { sitiosWeb } from './sitios-web';

/** Service category pages at /servicios/<slug>, in the order of their mockups (Images/*-1.png … *-15.png). */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  ecommerce, sistemasDeGestion, datosYAnalitica, logistica, restaurantes, streamingYRedes, videojuegos, automatizacion,
  inteligenciaArtificial, reservasYCitas, agropecuario, soporteTecnico, marketplaces, infraestructura, sitiosWeb,
];

export const serviceCategory = (slug: string) => SERVICE_CATEGORIES.find(category => category.slug === slug);
