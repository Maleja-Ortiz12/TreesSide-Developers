import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { TeamGallery } from '@/components/TeamGallery';
import { MotionShell } from '@/components/motion/MotionShell';
import { Reveal } from '@/components/motion/Reveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Nuestro equipo | TreesSide Developers',
  description: 'Conoce a los integrantes de TreesSide Developers: sus habilidades, formación, proyectos y portafolios profesionales.',
};

export default function TeamPage() {
  return (
    <MotionShell>
      <Navbar />
      <main className={styles.main}><Reveal><TeamGallery /></Reveal></main>
      <footer className={styles.footer}>
        <div className="container">
          <p>TreesSide Developers · Código que construye futuro</p>
          <Link href="/">Explorar nuestros servicios y proyectos</Link>
        </div>
      </footer>
    </MotionShell>
  );
}
