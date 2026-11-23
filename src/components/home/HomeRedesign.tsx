import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Scissors, ShoppingBag, Workflow, Utensils } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { enquiryHref } from '@/lib/enquiry';
import { HomeDemos } from '@/components/HomeDemos';
import { HeroCollage } from './HeroCollage';
import styles from './HomeRedesign.module.css';

const services = [
  { slug: 'restaurantes', title: 'Web para restaurantes', Icon: Utensils, image: '/images/projects/la-lupe.webp', alt: 'Captura real de la web de La Lupe', benefit: 'Haz que encuentren tu restaurante, conozcan tu menú y te contacten fácilmente.' },
  { slug: 'ecommerce', title: 'Tiendas virtuales', Icon: ShoppingBag, image: '/images/services/ecommerce-hero.webp', alt: 'Ilustración conceptual de una tienda virtual', benefit: 'Acerca tus productos a más clientes con un catálogo organizado y una tienda a tu medida.' },
  { slug: 'automatizacion', title: 'Software y automatización', Icon: Workflow, image: '/images/services/automatizacion-hero.webp', alt: 'Ilustración conceptual de herramientas conectadas', benefit: 'Conecta tus herramientas, organiza la operación y dedica menos tiempo a tareas repetitivas.' },
];
const stages = [
  ['Descubrimos', 'necesidades, propuesta y alcance.'],
  ['Diseñamos', 'estructura y diseño para aprobación.'],
  ['Desarrollamos', 'construcción y avances revisables.'],
  ['Lanzamos', 'publicación y entrega según el alcance.'],
];

// An unbranded, non-interactive visual proposal — not a capture of a delivered salon website.
function SalonPreview() {
  return <div className={styles.salonPreview} role="img" aria-label="Propuesta visual genérica de un salón: servicios, instalaciones y profesionales">
    <div className={styles.salonMasthead}><strong>Estudio de belleza</strong><Scissors size={22} aria-hidden="true" /></div>
    <div className={styles.salonBody}>
      <div><span className={styles.salonEyebrow}>Tu estilo, tu espacio</span><strong>Un momento<br />para ti.</strong><p>Corte · Color · Cuidado</p></div>
      <div className={styles.mirror} aria-hidden="true"><Scissors size={52} strokeWidth={1} /></div>
    </div>
    <div className={styles.salonStrip}><span>Servicios</span><span>El salón</span><span>Nuestro equipo</span></div>
  </div>;
}

function HeroArtwork() {
  const real = (id: string) => {
    const project = FEATURED_PROJECTS.find(item => item.id === id)!;
    return <>
      <figcaption>{project.title} <span>Web real · Portafolio del equipo</span></figcaption>
      <Image src={project.image} alt={`Captura real de ${project.title}, portafolio del equipo`} width={1200} height={833} sizes="(max-width: 600px) 90vw, (max-width: 1060px) 75vw, 42vw" />
    </>;
  };
  const salon = <>
    <figcaption><span className={styles.conceptLabel}>Diseño conceptual</span> Peluquerías</figcaption>
    <SalonPreview />
  </>;
  const shop = <>
    <figcaption><span className={styles.conceptLabel}>Diseño conceptual</span> Comercio electrónico</figcaption>
    <Image src="/images/services/ecommerce-hero.webp" alt="Ilustración de una propuesta de tienda y catálogo, no un proyecto desarrollado" width={1689} height={957} sizes="(max-width: 600px) 70vw, (max-width: 1060px) 50vw, 27vw" />
  </>;
  const lupe = real('equipo-la-lupe');
  const frames = [[lupe, salon, shop], [real('equipo-bendita-gracia'), lupe, salon]].map((artwork, index) => <div key={index} className={styles.artworkFrame}>
    <figure className={styles.captureFrame}>{artwork[0]}</figure>
    <figure className={styles.salonFrame}>{artwork[1]}</figure>
    <figure className={styles.shopFrame}>{artwork[2]}</figure>
  </div>);
  return <HeroCollage frames={frames}>
    <Image className={styles.treeAccent} src="/images/mockup/about-branch.webp" alt="" aria-hidden="true" width={418} height={370} priority />
  </HeroCollage>;
}

export function HomeRedesign() {
  return <div className={styles.home}>
    <section id="inicio" className={styles.hero} aria-labelledby="home-title">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>TreesSide Developers · Software a tu medida</p>
          <h1 id="home-title">Tu negocio puede vender más y <span>trabajar mejor</span></h1>
          <p className={styles.heroLead}>Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas</p>
          <div className={styles.actions}>
            <Link className="btn btn-primary" href="/contacto">Cotizar mi proyecto <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="btn btn-secondary" href="/proyectos">Ver nuestro trabajo</Link>
          </div>
        </div>
        <HeroArtwork />
        <p className={styles.heroSignature}>Diseño, desarrollo y acompañamiento en un solo equipo.</p>
      </div>
    </section>

    <section id="soluciones" className={styles.lightSection} aria-labelledby="solutions-title">
      <div className="container">
        <h2 id="solutions-title">¿Qué necesita tu negocio?</h2>
        <p className={styles.sectionLead}>Empecemos por lo que necesitas resolver. Definimos juntos el alcance de tu solución.</p>
        <div className={styles.serviceGrid}>{services.map(({ slug, title, Icon, image, alt, benefit }) => <article key={slug} className={styles.serviceCard} data-home-solution={slug}>
          <Image src={image} alt={alt} width={600} height={340} sizes="(max-width: 600px) 90vw, (max-width: 1060px) 45vw, 30vw" className={styles.serviceImage} />
          <div className={styles.serviceBody}>
            <Icon className={styles.serviceIcon} size={30} aria-hidden="true" />
            <h3>{title}</h3><p>{benefit}</p>
            <Link href={`/servicios/${slug}`}>Explorar solución <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </article>)}</div>
        <p className={styles.caption}>Las imágenes ilustrativas muestran posibilidades del servicio, no funcionalidades entregadas a un cliente.</p>
      </div>
    </section>

    <section id="trabajo" className={styles.workSection} aria-labelledby="work-title">
      <div className="container">
        <p className={styles.eyebrow}>Una web que puedes conocer</p>
        <h2 id="work-title">Conoce nuestro trabajo</h2>
        <article className={styles.realProject} data-project-card="equipo-la-lupe">
          <figure className={styles.projectCapture}>
            <Image src="/images/projects/la-lupe.webp" alt="Web real de La Lupe, restaurante mexicano: presentación y platos destacados" width={1200} height={833} sizes="(max-width: 1060px) 90vw, 55vw" />
            <figcaption>Captura real de la web de La Lupe</figcaption>
          </figure>
          <div className={styles.projectCopy}>
            <span className={styles.realLabel}>Web para restaurante</span>
            <h3>La Lupe</h3>
            <p>La Lupe es un restaurante mexicano. Su web acerca la identidad del restaurante y su cocina a quienes quieren conocerlo.</p>
            <ul>{['Presentación del restaurante', 'Menú', 'Platos destacados', 'Contacto por WhatsApp'].map(feature => <li key={feature}>{feature}</li>)}</ul>
            <div className={styles.actions}>
              <Link href="/proyectos#equipo-la-lupe" className="btn btn-primary">Ver proyecto <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href={enquiryHref({ servicio: 'restaurantes' })} className="btn btn-secondary">Quiero una web para mi negocio</Link>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="propuestas" className={styles.conceptsSection} aria-labelledby="concepts-title">
      <div className="container">
        <h2 id="concepts-title">Así podría verse tu negocio</h2>
        <p className={styles.sectionLead}>Explora propuestas visuales que podemos adaptar a la identidad y las necesidades de tu negocio</p>
        <div className={styles.conceptGrid}>
          <article className={styles.conceptCard}>
            <div className={styles.conceptVisual}><span className={styles.conceptLabel}>Diseño conceptual</span><SalonPreview /></div>
            <div className={styles.conceptCopy}>
              <h3>Peluquerías y salones de belleza</h3>
              <p>Una propuesta de cómo podrían mostrarse tus servicios, instalaciones y profesionales, con el estilo de tu negocio.</p>
              <Link className={styles.lightButton} href={enquiryHref({ servicio: 'sitios-web' })}>Quiero algo similar <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </article>
          <article className={styles.conceptCard}>
            <div className={styles.conceptVisual}>
              <span className={styles.conceptLabel}>Diseño conceptual</span>
              <Image src="/images/services/ecommerce-hero.webp" alt="Imagen ilustrativa de una propuesta de comercio electrónico" width={1689} height={957} sizes="(max-width: 600px) 90vw, 45vw" />
            </div>
            <div className={styles.conceptCopy}>
              <h3>Comercio electrónico</h3>
              <p>Una propuesta visual de tienda y catálogo de productos para explorar cómo presentar lo que vendes.</p>
              <Link className={styles.lightButton} href={enquiryHref({ servicio: 'ecommerce' })}>Quiero una tienda virtual <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
        <p className={styles.caption}>Son propuestas ilustrativas: no son sitios web desarrollados ni casos de clientes.</p>
      </div>
    </section>

    <HomeDemos />

    <section id="proceso-home" className={styles.lightSection} aria-labelledby="process-title">
      <div className={`container ${styles.processLayout}`}>
        <h2 id="process-title">Así construimos contigo</h2>
        <ol className={styles.stages}>{stages.map(([title, description], index) => <li key={title}>
          <span aria-hidden="true">{index + 1}</span><h3>{title}</h3><p>{description}</p>
        </li>)}</ol>
      </div>
    </section>

    <section id="siguiente-paso" className={styles.nextStep} aria-labelledby="next-title">
      <div className="container">
        <h2 id="next-title">El próximo paso de tu negocio empieza aquí</h2>
        <Link href="/contacto" className="btn btn-primary">Cuéntanos tu proyecto <ArrowRight size={19} aria-hidden="true" /></Link>
      </div>
    </section>
  </div>;
}
