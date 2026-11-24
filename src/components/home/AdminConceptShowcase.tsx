import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './AdminConceptShowcase.module.css';

const concepts = [
  { id: 'salon-admin', image: 'salon-admin-app', width: 1536, height: 1024, identity: 'ALBA · estudio de cabello', title: 'Tu equipo, en una misma agenda', detail: 'Empleados · Roles · Turnos · Disponibilidad', description: 'Un panel propuesto para coordinar profesionales, consultar horarios y encontrar espacios disponibles sin perder de vista las citas del día.', service: 'sistemas-de-gestion', serviceTitle: 'Sistemas de gestión', label: 'Panel administrativo y reservas', action: 'Quiero organizar mi salón', alt: 'Panel conceptual ALBA: empleados identificados por rol, turnos y disponibilidad, agenda del día y detalle móvil de un turno. Datos de ejemplo.' },
  { id: 'restaurant-admin', image: 'restaurant-admin-app', width: 1536, height: 1024, identity: 'BRASA · cocina de barrio · Identidad ficticia', title: 'De la comanda al cierre de caja', detail: 'Pedidos · Caja · Cocina · Equipo', description: 'Una propuesta administrativa que conecta estados de pedidos, una caja ilustrativa, la cola de cocina y los responsables de cada estación.', service: 'restaurantes', serviceTitle: 'App para restaurantes', label: 'App para restaurantes', action: 'Quiero organizar mi restaurante', alt: 'Panel conceptual BRASA: pedidos por estado, resumen de caja, cola de cocina, personal por estación y comandas en móvil. Datos de ejemplo; no corresponde a La Lupe.' },
  { id: 'pulcrivo', image: 'pulcrivo', identity: 'Pulcrivo · Propuesta visual', title: 'Cada propiedad, cada servicio, bajo control', detail: 'Limpieza · Mantenimiento · Equipo · Propiedades', description: 'Una propuesta de app personalizada para empresas de limpieza y alquileres: registro de entrada y salida de la jornada con ubicación, evidencias de mantenimiento y aseo, y reporte de implementos faltantes por propiedad. Son funciones propuestas, no una aplicación en funcionamiento.', service: 'logistica', serviceTitle: 'Logística para limpieza y alquileres', label: 'Operación y seguimiento del equipo', action: 'Explorar logística empresarial', alt: 'Diseño conceptual Pulcrivo generado con IA y aportado como referencia: agenda de servicios, equipo, reportes y evidencias, con vista móvil. Datos de ejemplo.', width: 1536, height: 1024 },
];

export function AdminConceptShowcase() {
  return <section className={styles.showcase} aria-labelledby="admin-concepts-title">
    <header className={styles.header}><p>Más allá de la web pública</p><h3 id="admin-concepts-title">Así podría organizarse tu operación</h3><p>Interfaces estáticas diseñadas y renderizadas localmente, no sistemas en funcionamiento. Pulcrivo utiliza una imagen generada con IA aportada como referencia. No son funcionalidades entregadas a La Lupe ni a otro cliente.</p></header>
    {concepts.map(concept => <article key={concept.id} className={styles.card} data-home-admin-concept={concept.id}>
      <h4 className={styles.serviceTitle}>{concept.serviceTitle}</h4>
      <figure className={styles.visual}>
        <figcaption>Diseño conceptual · Datos de ejemplo</figcaption>
        <Image src={`/images/home-concepts/${concept.image}.webp`} alt={concept.alt} width={'width' in concept ? concept.width : 1600} height={'height' in concept ? concept.height : 1200} sizes="(max-width: 800px) 92vw, 70vw" />
      </figure>
      <div className={styles.copy}><p className={styles.identity}>{concept.identity}</p><h5>{concept.title}</h5><p className={styles.detail}>{concept.detail}</p><p>{concept.label}</p><p>{concept.description}</p><Link href={`/servicios/${concept.service}`}>{concept.action}<ArrowRight size={18} aria-hidden="true" /></Link></div>
    </article>)}
  </section>;
}
