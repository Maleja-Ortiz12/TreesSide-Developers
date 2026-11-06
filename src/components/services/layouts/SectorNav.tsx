import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './SectorNav.module.css';

/** Standard breadcrumb and return link, without an extra sector-category row. */
export function SectorNav({ label }: { slug: string; label: string }) {
  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <nav aria-label="Ruta de navegación" className={styles.crumbs}>
          <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
          <Link href="/servicios">Servicios</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        <Link href="/servicios#categorias" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> Volver a categorías</Link>
      </div>
    </div>
  );
}
