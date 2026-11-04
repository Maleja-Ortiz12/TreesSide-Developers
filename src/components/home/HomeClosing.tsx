import Image from 'next/image';
import Link from 'next/link';
import { Mail, Layers, MessageCircle, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';
import styles from './Home.module.css';
export function HomeClosing() {
  return <section className={styles.closing} aria-labelledby="closing-title"><div className={`container ${styles.closingInner}`}>
    <h2 id="closing-title">Lo que sigue,<br />lo construimos<br /><span className="text-gradient">contigo.</span></h2>
    <Image src="/images/mockup/home-roots.webp" alt="" aria-hidden="true" width={566} height={740} className={styles.roots} />
    <svg className={styles.path} viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path d="M0 200 C250 200 500 20 780 90 S920 140 1000 20" fill="none" stroke="#62ffd0" strokeWidth="2" /><g fill="#b3ffe3"><circle cx="220" cy="154" r="5" /><circle cx="430" cy="94" r="5" /><circle cx="630" cy="72" r="5" /></g></svg>
    <nav className={styles.contactPath} aria-label="Construyamos juntos"><a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a><a href={`mailto:${CONTACT_INFO.email}`}><Mail />Correo</a><Link href="/proyectos"><Layers />Proyectos</Link></nav>
    <Link href="/contacto" className={styles.talkCircle}><MessageCircle size={48} /><span>Hablemos <ArrowUpRight /></span></Link>
    <span className={styles.outline} aria-hidden="true">TreesSide</span>
  </div></section>;
}
