import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Workflow, Utensils } from 'lucide-react';
import { FEATURED_PROJECTS } from '@/data/content';
import { enquiryHref } from '@/lib/enquiry';
import { HomeDemos } from '@/components/HomeDemos';
import { HeroCollage } from './HeroCollage';
import { ConceptShowcase } from './ConceptShowcase';
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

function HeroArtwork() {
  // Match the existing strip's eligibility, except S5 expressly excludes UptownHair.
  const projects = FEATURED_PROJECTS.filter(project => !project.experience && project.image !== '/images/treesside-logo.jpg' && project.id !== 'equipo-uptownhair');
  const real = (project: (typeof projects)[number]) => <>
    <figcaption>{project.title} <span>Portafolio del equipo</span>{project.imageLabel && <span className={styles.conceptLabel}>Diseño conceptual · {project.imageLabel}</span>}</figcaption>
    <Image data-home-project={project.id} src={project.image} alt={`${project.imageLabel ? 'Ilustración conceptual' : 'Captura real'} de ${project.title}, portafolio del equipo`} style={{ objectFit: project.imageFit ?? 'cover' }} width={1200} height={833} sizes="(max-width: 600px) 90vw, (max-width: 1060px) 75vw, 42vw" />
  </>;
  const salon = <>
    <figcaption><span className={styles.conceptLabel}>Diseño conceptual</span> Peluquerías</figcaption>
    <Image src="/images/home-concepts/salon.webp" alt="Diseño conceptual ficticio de peluquería: inicio, servicios y móvil" style={{ aspectRatio: '4 / 3', objectFit: 'contain' }} width={1600} height={1200} sizes="(max-width: 600px) 70vw, 35vw" />
  </>;
  const shop = <>
    <figcaption><span className={styles.conceptLabel}>Diseño conceptual</span> Comercio electrónico</figcaption>
    <Image src="/images/home-concepts/shop.webp" alt="Diseño conceptual ficticio de comercio electrónico: inicio, catálogo y móvil" style={{ aspectRatio: '4 / 3', objectFit: 'contain' }} width={1600} height={1200} sizes="(max-width: 600px) 70vw, (max-width: 1060px) 50vw, 27vw" />
  </>;
  const lupe = projects.find(project => project.id === 'equipo-la-lupe')!;
  // Preserve the first paint; batch remaining projects in three slots without repeats.
  const compositions = [[real(lupe), salon, shop]];
  const remaining = projects.filter(project => project !== lupe);
  for (let index = 0; index < remaining.length; index += 3) {
    const batch = remaining.slice(index, index + 3).map(real);
    compositions.push([...batch, salon, shop].slice(0, 3));
  }
  const frames = compositions.map((artwork, index) => <div key={index} className={styles.artworkFrame}>
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
        <ConceptShowcase />
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
