import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';
import { ClosingPath } from './ClosingPath';
import styles from './Home.module.css';

const footerLinks = [
  ['Inicio', '/'], ['Servicios', '/servicios'], ['Planes', '/planes'],
  ['Proyectos', '/proyectos'], ['Casos de éxito', '/casos'],
  ['Sobre Nosotros', '/nosotros'], ['Equipo', '/equipo'], ['Contacto', '/contacto'],
];

export function HomeClosing() {
  return (
    <footer className={styles.closing} aria-labelledby="closing-title">
      <div className={`container ${styles.closingInner}`}>
        <h2 id="closing-title">Lo que sigue,<br />lo construimos<br /><span className="text-gradient">contigo.</span></h2>
        <ClosingPath />
        {/* Roots art has the circle cut out; the sphere is drawn in CSS so it stays sharp at any size. */}
        <div className={styles.sphereStage}>
          <Image src="/images/mockup/closing-roots.webp" alt="" aria-hidden="true" width={566} height={740} className={styles.roots} />
          <span className={styles.sphereShadow} aria-hidden="true" />
          <Link href="/contacto" className={styles.sphere} data-talk-sphere="">
            <MessageCircle size={52} strokeWidth={1.8} aria-hidden="true" />
            <span>Hablemos <ArrowUpRight size={30} aria-hidden="true" /></span>
          </Link>
        </div>
        <span className={styles.outline} aria-hidden="true">TreesSide</span>
      </div>
      <div className={`container ${styles.footerDetails}`}>
        <div className={styles.footerBrand}>
          <strong>TreesSide Developers · {CONTACT_INFO.location}</strong>
          <p>Desarrollamos soluciones de software a medida con tecnologías modernas y enfoque en calidad y escalabilidad.</p>
        </div>
        <nav className={styles.footerLinks} aria-label="Enlaces rápidos">
          {footerLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className={styles.footerContact}>
          <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
          <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {CONTACT_INFO.phone}</a>
        </div>
        <div className={styles.footerLegal}>
          <p>© 2025 TreesSide Developers. Todos los derechos reservados. · <Link href="/politica-de-datos">Política de datos</Link></p>
          <span>Código que construye futuro</span>
        </div>
      </div>
    </footer>
  );
}
