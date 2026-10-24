import type { Metadata } from 'next';
import { SitePage } from '@/components/SitePage';
import { CONTACT_INFO } from '@/data/content';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Política de tratamiento de datos personales | TreesSide Developers',
  description: 'Cómo TreesSide Developers recolecta, usa y protege los datos personales que recibe a través de su sitio web, conforme a la Ley 1581 de 2012.',
};

const EFFECTIVE_DATE = '24 de octubre de 2026';

export default function PrivacyPolicyPage() {
  return (
    <SitePage>
      <article className={`container ${styles.policy}`}>
        <span className="kicker">LEGAL</span>
        <h1>Política de tratamiento de datos personales</h1>
        <p className={styles.lead}>
          En cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás
          normas concordantes, TreesSide Developers informa cómo trata los datos personales que recibe a través de este sitio web.
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <ul>
          <li><strong>Nombre:</strong> TreesSide Developers</li>
          <li><strong>Domicilio:</strong> {CONTACT_INFO.location}</li>
          <li><strong>Correo electrónico:</strong> <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
          <li><strong>Teléfono / WhatsApp:</strong> {CONTACT_INFO.phone}</li>
        </ul>

        <h2>2. Datos que recolectamos</h2>
        <p>
          A través del formulario de contacto recolectamos únicamente tu nombre, tu correo electrónico y el mensaje que nos
          escribes. No recolectamos datos sensibles ni datos de niñas, niños o adolescentes.
        </p>

        <h2>3. Finalidad del tratamiento</h2>
        <p>Usamos tus datos exclusivamente para:</p>
        <ul>
          <li>Responder tu mensaje, solicitud de información o cotización.</li>
          <li>Hacer seguimiento a la conversación comercial que tú iniciaste.</li>
        </ul>
        <p>No vendemos, alquilamos ni compartimos tus datos con terceros para fines publicitarios.</p>

        <h2>4. Encargado del tratamiento y transmisión internacional</h2>
        <p>
          Los mensajes del formulario se envían mediante Formspree, Inc., proveedor que actúa como encargado del tratamiento
          y procesa la información en servidores ubicados en Estados Unidos. Al aceptar esta política autorizas esa
          transmisión, que se limita a entregarnos tu mensaje.
        </p>

        <h2>5. Derechos del titular</h2>
        <p>Como titular de los datos tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorización que nos otorgaste.</li>
          <li>Ser informado sobre el uso que les damos a tus datos.</li>
          <li>Revocar la autorización y solicitar la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
          <li>Acceder gratuitamente a tus datos personales.</li>
        </ul>

        <h2>6. Atención de consultas y reclamos</h2>
        <p>
          El equipo de TreesSide Developers atiende las solicitudes sobre datos personales en{' '}
          <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>. Indica tu nombre, el correo con el que nos
          escribiste y lo que solicitas.
        </p>
        <ul>
          <li><strong>Consultas:</strong> las respondemos en un plazo máximo de diez (10) días hábiles desde su recibo.</li>
          <li>
            <strong>Reclamos</strong> (corrección, actualización, supresión o revocatoria): los atendemos en un plazo máximo de
            quince (15) días hábiles desde su recibo. Si necesitamos más tiempo, te informaremos el motivo y la fecha de respuesta.
          </li>
        </ul>

        <h2>7. Conservación de los datos</h2>
        <p>
          Conservamos tus datos mientras sea necesario para atender tu solicitud y la relación comercial que se derive de ella,
          o hasta que solicites su supresión.
        </p>

        <h2>8. Vigencia</h2>
        <p>
          Fecha de entrada en vigencia: {EFFECTIVE_DATE}. Cualquier cambio sustancial a esta política se publicará en esta página.
        </p>
      </article>
    </SitePage>
  );
}
