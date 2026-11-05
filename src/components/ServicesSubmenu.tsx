'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/serviceCategories';
import styles from './ServicesSubmenu.module.css';

type Props = { mobile?: boolean; active: boolean; className: string; children: ReactNode };

// "Servicios" opens its categories on hover (desktop) or click/tap; without JS the link still reaches /servicios.
export function ServicesSubmenu({ mobile = false, active, className, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = mobile ? 'services-submenu-mobile' : 'services-submenu';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('pointerdown', close); clearTimeout(closeTimer.current); };
  }, []);

  const hover = (next: boolean) => {
    if (mobile) return;
    clearTimeout(closeTimer.current);
    if (next) setOpen(true); else closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={root} className={mobile ? styles.mobile : styles.desktop} data-open={open || undefined}
      onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          root.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
        }
      }}>
      <Link href="/servicios" className={`${className}${active ? ' is-active' : ''}`} aria-current={pathname === '/servicios' ? 'page' : undefined}
        aria-haspopup="true" aria-expanded={open} aria-controls={panelId}
        onClick={event => { event.preventDefault(); setOpen(value => (mobile ? !value : true)); }}>
        {children}
        {mobile && <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />}
      </Link>
      <nav id={panelId} aria-label="Categorías de servicios" className={styles.panel}>
        <Link href="/servicios" className={styles.all} onClick={() => setOpen(false)}>Todos los servicios</Link>
        <div className={styles.links}>
          {SERVICE_CATEGORIES.map(({ slug, label }) => (
            <Link key={slug} href={`/servicios/${slug}`} aria-current={pathname === `/servicios/${slug}` ? 'page' : undefined}
              onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
