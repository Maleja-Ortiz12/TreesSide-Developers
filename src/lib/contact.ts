export interface ContactData {
  nombre: string;
  correo: string;
  mensaje: string;
  consent: boolean;
  /** Honeypot field: hidden from people, so only bots fill it. */
  gotcha: string;
}

export type ContactResult = 'sent' | 'not-configured' | 'consent-required' | 'error';

// Formspree form IDs are short alphanumeric hashes; anything else must not reach the URL.
const FORM_ID = /^[A-Za-z0-9]+$/;

/** Sends the contact form to Formspree. Reports `sent` only when Formspree accepted the message. */
export async function sendContact(
  data: ContactData,
  formId: string | undefined,
  fetchImpl: (url: string, init: RequestInit) => Promise<{ ok: boolean }> = fetch,
): Promise<ContactResult> {
  if (!formId || !FORM_ID.test(formId)) return 'not-configured';
  if (!data.consent) return 'consent-required';
  if (data.gotcha) return 'sent';
  try {
    const response = await fetchImpl(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: data.nombre,
        email: data.correo,
        mensaje: data.mensaje,
        _subject: `Nuevo mensaje de ${data.nombre} desde el sitio de TreesSide`,
        consentimiento: `Acepta la política de tratamiento de datos personales (${new Date().toISOString()})`,
      }),
    });
    return response.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}
