import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';
import styles from './WhatsAppButton.module.css';

/** Always-visible shortcut to start a WhatsApp chat, the main contact channel in Colombia. */
export function WhatsAppButton() {
  return (
    <a
      href={CONTACT_INFO.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      data-whatsapp-float=""
      className={styles.button}
    >
      <MessageCircle size={26} aria-hidden="true" />
      <span className={styles.label} aria-hidden="true">WhatsApp</span>
    </a>
  );
}
