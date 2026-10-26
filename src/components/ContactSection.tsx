'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONTACT_INFO } from '@/data/content';
import { sendContact, type ContactResult } from '@/lib/contact';
import { Mail, MapPin, Phone, Send, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';

// Inlined at build time; set it in Netlify once the Formspree form exists.
const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
const EMPTY_FORM = { nombre: '', correo: '', mensaje: '', consent: false, gotcha: '' };

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
    <section id="contacto" style={{
      padding: '80px 0 100px',
      position: 'relative'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 245, 160, 0.07) 0%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h2 className="section-title">
            Contáctanos
          </h2>
          <p className="section-subtitle">
            ¿Tienes un proyecto en mente o quieres más información? Escríbenos, estaremos encantados de ayudarte.
          </p>
        </div>

        {/* 2 Columns: Contact Info & Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '40px',
          alignItems: 'start'
        }} className="contact-grid">
          {/* Left Column: Direct Info Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Email Card */}
            <div
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(0, 210, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} color="var(--primary-cyan)" />
                </div>
                <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Correo Directo
                  </span>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    style={{
                      display: 'block',
                      fontSize: '0.98rem',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <button
                onClick={copyEmail}
                title="Copiar correo"
                style={{
                  flexShrink: 0,
                  background: 'transparent',
                  border: 'none',
                  color: copied ? 'var(--primary-green)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '6px'
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {/* Location Card */}
            <div
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(0, 245, 160, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={22} color="var(--primary-green)" />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Ubicación
                </span>
                <p style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 500 }}>
                  {CONTACT_INFO.location}
                </p>
              </div>
            </div>

            {/* Phone / WhatsApp Card */}
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(0, 210, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={22} color="var(--primary-cyan)" />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Teléfono / WhatsApp
                </span>
                <p style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 500 }}>
                  {CONTACT_INFO.phone}
                </p>
              </div>
            </a>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="glass-card" style={{ padding: '36px 32px' }}>
            {status === 'sent' ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(0, 245, 160, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(0, 245, 160, 0.4)'
                }}>
                  <CheckCircle2 size={36} color="var(--primary-green)" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px' }}>
                  Gracias por escribirnos. Nuestro equipo en TreesSide Developers revisará tu requerimiento y te contactará a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      background: 'rgba(7, 13, 23, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 210, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Correo"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      background: 'rgba(7, 13, 23, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 210, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mensaje"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      background: 'rgba(7, 13, 23, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 210, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Honeypot: invisible to people, bots fill it and get dropped. */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.gotcha}
                  onChange={(e) => setFormData({ ...formData, gotcha: e.target.value })}
                  style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0 }}
                />

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--primary-green)', flexShrink: 0 }}
                  />
                  <span>
                    Autorizo a TreesSide Developers a tratar mis datos personales para responder a mi mensaje, según la{' '}
                    <Link href="/politica-de-datos" style={{ color: 'var(--primary-cyan)', textDecoration: 'underline' }}>
                      política de tratamiento de datos
                    </Link>.
                  </span>
                </label>

                {(status === 'error' || status === 'not-configured') && (
                  <div role="alert" style={{ display: 'flex', gap: '10px', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.08)', color: '#fde68a', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                    <span>
                      {status === 'error'
                        ? 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente a '
                        : 'El formulario todavía no está conectado. Mientras tanto, escríbenos a '}
                      <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: '#ffffff', textDecoration: 'underline' }}>{CONTACT_INFO.email}</a>
                      {' o por '}
                      <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>WhatsApp</a>.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    marginTop: '6px'
                  }}
                >
                  <Send size={18} />
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
