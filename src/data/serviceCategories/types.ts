import type { LucideIcon } from 'lucide-react';

export type IconItem = { icon: LucideIcon; title: string; text: string };

export type ServicePlan = {
  name: string;
  /** Short label above the name, e.g. "Plan 1". */
  eyebrow?: string;
  /** Billing pill beside the name, e.g. "Implementación (pago único)". */
  badge?: string;
  icon: LucideIcon;
  summary: string;
  scopeLabel?: string;
  scope: string[];
  billing?: string;
  /** Highlighted card, as drawn in the mockup. */
  featured?: boolean;
  modes?: { title: string; text: string }[];
};

/** One service category page; every text comes from its mockup in `Images/`. */
export type ServiceCategory = {
  slug: string;
  label: string;
  icon: LucideIcon;
  metaTitle: string;
  metaDescription: string;
  hero: {
    badge?: string;
    title: string;
    highlight: string;
    /** Text after the highlighted part, if the headline continues. */
    titleEnd?: string;
    lead: string;
    cta: string;
    secondary?: { label: string; href: string };
    chips?: string[];
  };
  offers: { title: string; lead?: string; items: IconItem[] };
  /** Optional flow between offers and the conceptual view (restaurantes). */
  flow?: { title: string; lead: string; steps: IconItem[] };
  concept: { title: string; text: string; alt: string };
  plans: { title: string; lead: string; items: ServicePlan[]; notes: string[] };
  /** Real projects from FEATURED_PROJECTS shown as references, with their original images. */
  references?: { title: string; lead: string; projectIds: string[] };
  process: { title: string; lead: string; steps: IconItem[] };
  cta: { title: string; text: string; button: string };
};
