'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT_INFO, SERVICES } from '@/data/content';
import { sendContact, type ContactResult } from '@/lib/contact';
import { Mail, MapPin, Phone, ArrowRight, MessageCircle, CheckCircle2, Copy, Check, AlertCircle, ChevronDown } from 'lucide-react';
import styles from './contact/Contact.module.css';

// Inlined at build time; set it in Netlify once the Formspree form exists.
const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
const EMPTY_FORM = { nombre: '', correo: '', necesidad: '', mensaje: '', consent: false, gotcha: '' };
// The optional "what do you need" answers are the services the team actually offers.
const NEEDS = [...SERVICES.map(service => service.title), 'Otro'];

export function ContactSection() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | ContactResult>('idle');
  const [copied, setCopied] = useState(false);
  const loading = status === 'sending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !formData.nombre || !formData.correo || !formData.mensaje || !formData.consent) return;
    setStatus('sending');
    const result = await sendContact(formData, FORMSPREE_FORM_ID);
    setStatus(result);
    // Keep what the visitor wrote unless the message really went out.
    if (result === 'sent') setFormData(EMPTY_FORM);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacto" className={styles.contact}>
      <div className={`container contact-grid ${styles.layout}`}>
        <div className={styles.intro}>
          <h1>Toda gran<br />solución empieza<br />con una <span className="text-gradient">conversación.</span></h1>
          <Image src="/images/mockup/contact-tree.webp" alt="" aria-hidden="true" width={395} height={310} priority className={styles.tree} />
          <h2>Cuéntanos tu idea.</h2>
          <p>Conversemos sobre lo que quieres construir, exploremos opciones y encontremos juntos la mejor forma de hacerlo realidad.</p>
          <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.whatsapp}`}>
            <MessageCircle size={22} aria-hidden="true" /> Prefiero hablar por WhatsApp <ArrowRight size={20} aria-hidden="true" />
          </a>
          <ul className={styles.direct}>
            <li><MapPin size={18} aria-hidden="true" />{CONTACT_INFO.location}</li>
            <li>
              <Mail size={18} aria-hidden="true" />
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
              <button type="button" onClick={copyEmail} className={styles.copy}
                aria-label={copied ? 'Correo copiado' : 'Copiar correo'} title="Copiar correo">
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </li>
            <li><Phone size={18} aria-hidden="true" /><a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">{CONTACT_INFO.phone}</a></li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeading}>
            <Mail size={40} strokeWidth={1.5} aria-hidden="true" />
            <div><h2>Envíanos un mensaje</h2><p>Cuéntanos sobre tu proyecto y te leemos.</p></div>
          </div>
          {status === 'sent' ? (
            <div className={styles.sent} role="status">
              <CheckCircle2 size={44} aria-hidden="true" />
              <h3>¡Mensaje enviado con éxito!</h3>
              <p>Gracias por escribirnos. Nuestro equipo en TreesSide Developers revisará tu requerimiento y te contactará a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="contact-name">Nombre</label>
              <input id="contact-name" type="text" required placeholder="Tu nombre" autoComplete="name"
                value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />

              <label htmlFor="contact-email">Correo electrónico</label>
              <input id="contact-email" type="email" required placeholder="Tu correo electrónico" autoComplete="email"
                value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />

              <label htmlFor="contact-need">¿Qué necesitas construir?</label>
              <div className={styles.select}>
                <select id="contact-need" value={formData.necesidad}
                  onChange={(e) => setFormData({ ...formData, necesidad: e.target.value })}>
                  <option value="">Selecciona una opción</option>
                  {NEEDS.map(need => <option key={need} value={need}>{need}</option>)}
                </select>
                <ChevronDown size={20} aria-hidden="true" />
              </div>

              <label htmlFor="contact-message">Cuéntanos sobre tu proyecto</label>
              <textarea id="contact-message" required rows={4} placeholder="Cuéntanos los detalles, objetivos o ideas que tengas en mente..."
                value={formData.mensaje} onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })} />

              {/* Honeypot: invisible to people, bots fill it and get dropped. */}
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot}
                value={formData.gotcha} onChange={(e) => setFormData({ ...formData, gotcha: e.target.value })} />

              <label className={styles.consent}>
                <input type="checkbox" required checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                <span>
                  Autorizo a TreesSide Developers a tratar mis datos personales para responder a mi mensaje, según la{' '}
                  <Link href="/politica-de-datos">política de tratamiento de datos</Link>.
                </span>
              </label>

              {(status === 'error' || status === 'not-configured') && (
                <div role="alert" className={styles.alert}>
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>
                    {status === 'error'
                      ? 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente a '
                      : 'El formulario todavía no está conectado. Mientras tanto, escríbenos a '}
                    <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                    {' o por '}
                    <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
                  </span>
                </div>
              )}

              <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submit}`}>
                {loading ? 'Enviando...' : 'Enviar mensaje'} <ArrowRight size={20} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
