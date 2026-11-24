import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './AdminConceptShowcase.module.css';

const concepts = [
  { id: 'salon-admin', identity: 'ALBA · estudio de cabello', title: 'Tu equipo, en una misma agenda', detail: 'Empleados · Roles · Turnos · Disponibilidad', description: 'Un panel propuesto para coordinar profesionales, consultar horarios y encontrar espacios disponibles sin perder de vista las citas del día.', service: 'sistemas-de-gestion', label: 'Panel administrativo y reservas', action: 'Quiero organizar mi salón', alt: 'Panel conceptual ALBA: empleados identificados por rol, turnos y disponibilidad, agenda del día y detalle móvil de un turno. Datos de ejemplo.' },
  { id: 'restaurant-admin', identity: 'BRASA · cocina de barrio · Identidad ficticia', title: 'De la comanda al cierre de caja', detail: 'Pedidos · Caja · Cocina · Equipo', description: 'Una propuesta administrativa que conecta estados de pedidos, una caja ilustrativa, la cola de cocina y los responsables de cada estación.', service: 'restaurantes', label: 'App para restaurantes', action: 'Quiero organizar mi restaurante', alt: 'Panel conceptual BRASA: pedidos por estado, resumen de caja, cola de cocina, personal por estación y comandas en móvil. Datos de ejemplo; no corresponde a La Lupe.' },
];

export function AdminConceptShowcase() {
  return <section className={styles.showcase} aria-labelledby="admin-concepts-title">
    <header className={styles.header}><p>Más allá de la web pública</p><h3 id="admin-concepts-title">Así podría organizarse tu operación</h3><p>Interfaces estáticas diseñadas y renderizadas localmente, no sistemas en funcionamiento. No son funcionalidades entregadas a La Lupe ni a otro cliente.</p></header>
    {concepts.map(concept => <article key={concept.id} className={styles.card} data-home-admin-concept={concept.id}>
      <figure className={styles.visual}>
        <figcaption>Diseño conceptual · Datos de ejemplo</figcaption>
        <Image src={`/images/home-concepts/${concept.id}.webp`} alt={concept.alt} width={1600} height={1200} sizes="(max-width: 800px) 92vw, 70vw" />
      </figure>
      <div className={styles.copy}><p className={styles.identity}>{concept.identity}</p><h4>{concept.title}</h4><p className={styles.detail}>{concept.detail}</p><p>{concept.label}</p><p>{concept.description}</p><Link href={`/servicios/${concept.service}`}>{concept.action}<ArrowRight size={18} aria-hidden="true" /></Link></div>
    </article>)}
  </section>;
}
