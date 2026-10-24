'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './demos.module.css';

const SERVICES = ['Corte', 'Color', 'Peinado'];
const SLOTS = ['09:00', '11:00', '15:00'];

export function BookingDemo() {
  const [service, setService] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const ready = Boolean(service && slot) && !confirmed;
  return (
    <div className={styles.simulator}>
      <p className={styles.label}>Salón de ejemplo · Elige servicio y horario</p>
      <div className={styles.choices} role="group" aria-label="Servicios de ejemplo">
        {SERVICES.map(name => (
          <button type="button" key={name} aria-pressed={service === name} disabled={confirmed} onClick={() => setService(name)}>{name}</button>
        ))}
      </div>
      <div className={styles.choices} role="group" aria-label="Horarios de ejemplo">
        {SLOTS.map(time => (
          <button type="button" key={time} aria-pressed={slot === time} disabled={confirmed} onClick={() => setSlot(time)}>{time}</button>
        ))}
      </div>
      <p className={styles.status} role="status">
        {confirmed ? `Turno de ejemplo confirmado: ${service} a las ${slot}`
          : service || slot ? `Seleccionado: ${service ?? 'elige un servicio'} · ${slot ?? 'elige un horario'}`
          : 'Elige un servicio y un horario para probar la reserva.'}
      </p>
      <button type="button" className="btn btn-secondary" disabled={!ready} onClick={() => { if (ready) setConfirmed(true); }}>
        Confirmar turno
      </button>
      <button type="button" className={styles.reset} onClick={() => { setService(null); setSlot(null); setConfirmed(false); }}>
        <RotateCcw size={14} aria-hidden="true" />Reiniciar reserva
      </button>
    </div>
  );
}
