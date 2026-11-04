import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { HomeClosing } from '@/components/home/HomeClosing';
import { Navbar } from '@/components/Navbar';
import { TeamGallery } from '@/components/TeamGallery';
import { MotionShell } from '@/components/motion/MotionShell';
import { Reveal } from '@/components/motion/Reveal';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata('/equipo', {
  title: 'Nuestro equipo | TreesSide Developers',
  description: 'Conoce a los integrantes de TreesSide Developers: sus habilidades, formación, proyectos y portafolios profesionales.',
});

export default function TeamPage() {
  return (
    <MotionShell>
      <Navbar />
      <main className={styles.main}><Reveal first><TeamGallery /></Reveal></main>
      <HomeClosing />
    </MotionShell>
  );
}
