import type { ComponentType } from 'react';
import type { ServiceCategory } from '@/data/serviceCategories/types';
import { RestaurantLayout } from './RestaurantLayout';
import { GamesLayout } from './GamesLayout';
import { StreamingLayout } from './StreamingLayout';
import { SocialLayout } from './SocialLayout';

/** Categories whose mockup has its own structure instead of the shared category template. */
export const CUSTOM_LAYOUTS: Record<string, ComponentType<{ category: ServiceCategory }>> = {
  restaurantes: RestaurantLayout,
  videojuegos: GamesLayout,
  streaming: StreamingLayout,
  'redes-sociales': SocialLayout,
};
