import { CONTACT_INFO, FEATURED_PROJECTS } from '@/data/content';
import { COMMERCIAL_PLANS } from '@/data/plans';
import { serviceCategory } from '@/data/serviceCategories';

export const ENQUIRY_NEEDS = [
  'Necesito una página web.',
  'Quiero vender por internet.',
  'Quiero organizar mi negocio.',
  'Quiero automatizar tareas.',
  'Necesito orientación.',
];

const KINDS = { servicio: 'Servicio', plan: 'Plan', demo: 'Demo conceptual', proyecto: 'Proyecto', opcion: 'Plan del servicio' };
type EnquiryKind = keyof typeof KINDS;
export type EnquiryContext = { kind: EnquiryKind; id: string; label: string }[];

// Demo slugs from the former Home demos, kept so existing `?demo=` links still resolve; titles come from the project catalog.
const DEMO_PROJECTS: Record<string, string> = {
  restaurante: 'equipo-la-lupe',
  radio: 'equipo-emisoras-latinas',
  logistica: 'equipo-calculadora-de-contenedores',
};

/** Query strings are untrusted: only catalog-backed selections become visible or get sent. */
export function readEnquiryContext(search: string): EnquiryContext {
  const params = new URLSearchParams(search);
  const context: EnquiryContext = [];
  for (const kind of Object.keys(KINDS) as EnquiryKind[]) {
    const id = params.get(kind);
    if (!id) continue;
    const label = kind === 'opcion' ? serviceCategory(params.get('servicio') ?? '')?.plans.items.find(plan => plan.name === id)?.name
      : kind === 'servicio' ? serviceCategory(id)?.label
      : kind === 'plan' ? COMMERCIAL_PLANS.find(plan => plan.id === id)?.name
      : FEATURED_PROJECTS.find(project => project.id === (kind === 'demo' ? DEMO_PROJECTS[id] : id))?.title;
    if (label) context.push({ kind, id, label });
  }
  return context;
}

export function enquiryLabel(entry: EnquiryContext[number]) {
  return `${KINDS[entry.kind]}: ${entry.label}`;
}

/** Compose at the boundary, never replace the visitor's editable text or consent. */
export function enquiryMessage(message: string, context: EnquiryContext) {
  return context.length ? `${message}\n\nConsulta sobre:\n${context.map(enquiryLabel).join('\n')}` : message;
}

export function enquiryWhatsAppUrl(context: EnquiryContext, draft: { mensaje: string; necesidad?: string }) {
  if (!context.length && !draft.mensaje && !draft.necesidad) return CONTACT_INFO.whatsappUrl;
  const url = new URL(CONTACT_INFO.whatsappUrl);
  const greeting = url.searchParams.get('text') ?? 'Hola TreesSide Developers';
  const message = [greeting, draft.necesidad, draft.mensaje].filter(Boolean).join('\n\n');
  url.searchParams.set('text', enquiryMessage(message, context));
  return url.toString();
}

/** Use the same validation as the consumer when producing a contextual form link. */
export function enquiryHref(selection: Partial<Record<EnquiryKind, string>>) {
  const params = new URLSearchParams(selection);
  const valid = new URLSearchParams(readEnquiryContext(params.toString()).map(entry => [entry.kind, entry.id]));
  return `/contacto${valid.size ? `?${valid}` : ''}`;
}
