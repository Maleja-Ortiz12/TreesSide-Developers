import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { TeamGallery } from '@/components/TeamGallery';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Nuestro equipo | TreesSide Developers',
  description: 'Conoce a los integrantes de TreesSide Developers: sus habilidades, formación, proyectos y portafolios profesionales.',
};

export default function TeamPage() {
  return (
    <>
      <Navbar activeSection="equipo" />
      <main className={styles.main}><TeamGallery /></main>
      <footer className={styles.footer}>
        <div className="container">
          <p>TreesSide Developers · Código que construye futuro</p>
          <Link href="/">Explorar nuestros servicios y proyectos</Link>
        </div>
      </footer>
    </>
  );
}
