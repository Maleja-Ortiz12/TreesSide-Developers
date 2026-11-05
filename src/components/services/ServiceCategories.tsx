import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/serviceCategories';
import styles from './Services.module.css';

// Entry point to the category pages; "Volver a servicios" on each page lands here.
export function ServiceCategories() {
  return (
    <section id="categorias" className={styles.categories} aria-labelledby="categories-title">
      <div className="container">
        <p className={styles.eyebrow}>SERVICIOS POR CATEGORÍA</p>
        <h2 id="categories-title">Soluciones para <span className="text-gradient">cada tipo de negocio</span></h2>
        <ul className={styles.categoryGrid}>
          {SERVICE_CATEGORIES.map(({ slug, label, icon: Icon, hero }) => (
            <li key={slug}>
              <Link href={`/servicios/${slug}`} className={styles.categoryCard}>
                <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                <span className={styles.categoryLabel}>{label}</span>
                <span className={styles.categoryText}>{hero.title} {hero.highlight}{hero.titleEnd && ` ${hero.titleEnd}`}</span>
                <span className={styles.categoryMore}>Ver servicio <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
