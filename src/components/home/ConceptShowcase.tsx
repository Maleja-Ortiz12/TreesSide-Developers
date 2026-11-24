import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { enquiryHref } from '@/lib/enquiry';
import styles from './ConceptShowcase.module.css';

const concepts = [
  { id: 'salon', title: 'Peluquerías y salones de belleza', identity: 'ALBA · estudio de cabello', views: 'Inicio · Servicios · Móvil', description: 'Una propuesta de cómo podrían mostrarse tus servicios, instalaciones y profesionales, con el estilo de tu negocio.', action: 'Quiero algo similar', href: enquiryHref({ servicio: 'sitios-web' }), alt: 'Propuesta ficticia ALBA: inicio editorial con fotografía de salón, servicios de corte, color y cuidado, y versión móvil.' },
  { id: 'shop', title: 'Comercio electrónico', identity: 'TEC · tecnología cotidiana', views: 'Inicio · Catálogo · Móvil', description: 'Una propuesta visual de tienda y catálogo de productos para explorar cómo presentar lo que vendes.', action: 'Quiero una tienda virtual', href: enquiryHref({ servicio: 'ecommerce' }), alt: 'Propuesta ficticia TEC: tienda tecnológica grafito y cian con auriculares de stock, búsqueda y categorías, catálogo con guía de conexiones y versión móvil.' },
];

export function ConceptShowcase() {
  return <div className={styles.showcase}>
    {concepts.map(concept => <article key={concept.id} className={styles.card} data-home-concept={concept.id}>
      <figure className={styles.visual}>
        <figcaption className={styles.label}>Diseño conceptual <span>· Propuesta ficticia</span></figcaption>
        <Image src={`/images/home-concepts/${concept.id}.webp`} alt={concept.alt} width={1600} height={1200} sizes="(max-width: 800px) 92vw, 65vw" />
      </figure>
      <div className={styles.copy}>
        <p className={styles.identity}>{concept.identity}</p>
        <h3>{concept.title}</h3>
        <p className={styles.views}>{concept.views}</p>
        <p>{concept.description}</p>
        <Link className={styles.action} href={concept.href}>{concept.action} <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </article>)}
    <p className={styles.caption}>Identidades ficticias e interfaces diseñadas y renderizadas localmente con fotografías de stock. Son propuestas ilustrativas: no son sitios web desarrollados ni casos de clientes. Las fotografías no fueron generadas con IA.</p>
  </div>;
}
