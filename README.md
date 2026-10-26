# TreesSide Developers — Frontend Web Oficial

Plataforma frontend oficial para **TreesSide Developers**, desarrollada con **Next.js 15 (App Router)**, **React 19**, **TypeScript** y diseño cyberpunk oscuro con acentos de neón esmeralda y cian, replicando fielmente el diseño de marca y mockup proporcionado.

Repositorio: https://github.com/Maleja-Ortiz12/TreesSide-Developers

## Estado actual

- El inicio combina el hero, un carrusel de proyectos, seis demos locales y un resumen de los planes.
- `/planes` presenta cuatro ofertas acumulativas: **Impulso Web desde $500.000 COP**, **Catálogo Administrable desde $900.000**, **Vende Online desde $1.490.000** y **Negocio Integral desde $3.490.000**. El alcance, impuestos aplicables, renovaciones y costos externos se detallan antes de cotizar. Los datos se editan en `src/data/plans.ts`.
- La tienda ofrecida se desarrolla con código a medida y pasarela externa. No tiene un tope fijo de productos: volumen, variantes y carga inicial se cotizan. El paquete integral incorpora web, panel, tienda y un flujo de automatización.
- `/casos` documenta La Lupe, Emisoras Latinas y TengoYa. `/contacto` incluye preguntas frecuentes y enlaza a `/politica-de-datos`.
- Hay sitemap, robots, metadatos por página, imagen Open Graph, datos estructurados y un acceso flotante a WhatsApp.
- Las animaciones con `motion` respetan la preferencia de movimiento reducido. Las secciones tienen un respaldo de visibilidad sin JavaScript.

### Configuración del formulario

Copia `.env.example` a `.env.local` y configura `NEXT_PUBLIC_FORMSPREE_FORM_ID` con el ID de un formulario de Formspree. En Netlify, configura la misma variable y vuelve a desplegar. El ID es público por diseño; no es una clave secreta.

Sin ese ID, el formulario **no envía mensajes** y ofrece correo y WhatsApp. Una vez configurado, realiza un envío de prueba para confirmar la recepción. Los archivos `.env*` quedan excluidos de Git, salvo `.env.example`.

Los datos legales de la política están pendientes de completar por el equipo. La página no sustituye una revisión legal.

---

## 🎨 Características Visuales y de Diseño

- **Paleta Cyberpunk Neón**:
  - Fondo oscuro profundo (`#070d17` / `#040810`)
  - Acentos de neón verde esmeralda (`#00f5a0`) y cian tecnológico (`#00d2ff`)
  - Tarjetas de vidrio (*glassmorphism*) con bordes y resplandores interactivos
  - Tipografía moderna: **Outfit** y **JetBrains Mono**
- **Interacción de botones**: Botones, enlaces de acción y navegación comparten realce al pasar el mouse, respuesta al presionar, foco visible con teclado y brillo para estados seleccionados. Se respetan controles deshabilitados y la preferencia de movimiento reducido.
- **Logo Oficial Integrado**:
  - Uso del logo oficial del árbol tecnológico en la cabecera, hero, banners, sección "Sobre Nosotros" y pie de página.
- **Páginas**: cada sección tiene su propia ruta para que el inicio no concentre todo el contenido:

  | Ruta | Contenido |
  | --- | --- |
  | `/` | Hero, carrusel, demos y resumen de planes |
  | `/servicios` | Servicios, planes y tecnologías que usamos |
  | `/planes` | Cuatro planes con precios, alcance y condiciones |
  | `/casos` | Casos de éxito y sus páginas de detalle |
  | `/proyectos` | Proyectos destacados y del equipo |
  | `/nosotros` | Objetivo del equipo, lo que nos apasiona y proceso |
  | `/equipo` | Perfiles ampliados del equipo |
  | `/contacto` | Contacto, formulario con Formspree y preguntas frecuentes |
  | `/politica-de-datos` | Tratamiento de datos personales |

- **Secciones**:
  1. **Navegación Sticky**: Cabecera de cristal compartida por todas las páginas; resalta la página actual y tiene menú móvil responsivo.
  2. **Hero Principal (`/`)**: Kicker `IDEAS > CÓDIGO > SOLUCIONES`, titular con degradado neón, botones de llamada a la acción (*Ver nuestros proyectos* lleva a `/proyectos`, *Contáctanos* a `/contacto`), tarjeta de marca con el logo, *TreesSide* y su subtítulo *Developers*, el lema *Código que construye futuro*, cifras calculadas desde los datos (proyectos, tecnologías y desarrolladores) e inclinación 3D al pasar el mouse, y 4 tarjetas de aspectos destacados (*Desarrollo Web*, *Bases de Datos*, *Soluciones Cloud*, *Apps a Medida*).
  3. **Proyectos (`/proyectos`)**: Un carrusel en primer plano permite recorrer cada proyecto con imagen grande, autoría, tecnologías y acceso al detalle. Respeta el filtro activo y vuelve al primer proyecto al cambiar de categoría, con avance automático cada 5 segundos y una escena holográfica inspirada en el inicio del portafolio de Jorge Ramírez: captura principal flotante, profundidad por capas, balanceo suave, brillo y vistas pequeñas del proyecto anterior y siguiente. Incluye pausa/reanudación y flechas; arranca automáticamente al entrar a la página y no se detiene por pasar el mouse. Se pausa al entrar el foco, al abrir un detalle o al ocultar la pestaña; el botón Reanudar vuelve a activar el temporizador incluso con el mouse encima. Con movimiento reducido empieza pausado. Las tarjetas del catálogo tienen entrada escalonada y realce al pasar el mouse; las animaciones respetan *prefers-reduced-motion*. Catálogo generado desde `src/data/team.ts` con los proyectos publicados en los portafolios del equipo: Ronaldo (Ocho80, Radio Navidad, Calculadora de contenedores, Libres en Cristo Jesús), Jorge (Floraltech E-Commerce, Atherium 3D Game, Otaku Portal, API de Tienda + Asistente IA, Portfolio CMS, Dashboard BI · Superstore, EDA · Renta Ciudadana, Análisis de Ventas de Cafetería) y María Alejandra (Dimension Shift, UptownHair, Emisoras Latinas, Entre Lanas y Fragancias, Sistema de gestión de inventarios, Aplicación de gestión agropecuaria) y Jorge Ramírez (TengoYa, CarWeb, Histech). Un proyecto que publican dos integrantes aparece en una sola tarjeta con ambos autores y un enlace a cada portafolio: Emisoras Latinas (María Alejandra y Jorge Ramírez) y Radio Navidad (Ronaldo y Jorge Ramírez, que lo llama *Christmas Radio Navidad*); se declara con `sameAs` en `src/data/team.ts`. Luhos, Gudfy y Tanku (Ronaldo) y Robot Alejo 2.0 y Migración Pega → UiPath (Jorge Ramírez) se muestran como **Experiencia laboral**: son trabajos hechos como empleados de otras empresas, no proyectos de TreesSide. Las imágenes se tomaron de cada portafolio y se guardan en `public/images/projects/` (WebP, 960 px); los seis proyectos sin captura pública utilizable tienen ilustraciones propias, rotuladas **Ilustración conceptual · No es una captura real**. La Lupe utiliza una captura real de su inicio. Las portadas conceptuales pueden regenerarse con `node scripts/generate-project-covers.mjs`. Los filtros incluyen **Proyectos del equipo**, **Experiencia laboral** y cada categoría, y el detalle enlaza al portafolio del autor y, cuando existe, al proyecto en línea.
  4. **Servicios Tecnológicos (`/servicios`)**:
     - Ilustración 3D de laptop futurista con código resplandeciente y nube flotante.
     - 9 tarjetas con ejemplos de lo que el equipo puede construir, basados en sus portafolios: *Desarrollo Web* (comercio electrónico multivendedor, tiendas, aplicaciones de reservas, APIs REST y WordPress), *Bases de Datos*, *Cloud & DevOps* (Azure, GitHub Actions), *Aplicaciones Móviles* (Flutter, React Native), *Business Intelligence*, *Seguridad & Mantenimiento*, *Videojuegos con Unity*, *Automatización con n8n* y *Plataformas conectadas* (radio web, tiempo real, asistentes con Azure OpenAI).
  5. **Tecnologías que usamos (`/servicios`)**: Cuadrícula con las tecnologías declaradas en los portafolios del equipo: lenguajes (*JavaScript, TypeScript, PHP, Dart, SQL, C#, C++, Python*), frameworks (*Next.js, NestJS, React, Laravel, .NET, Node.js, Medusa, Flutter, React Native, Expo, Unity, HTML y CSS, Vite, Tailwind CSS, Bootstrap, Framer Motion, WordPress, Socket.IO*), datos (*PostgreSQL, MySQL, SQL Server, Prisma, Pandas, NumPy, Excel, Power BI*), automatización e IA (*UiPath, Bizagi, SAP, n8n, Power Automate, OpenAI*) y herramientas (*Azure, Firebase, Docker, GitHub Actions, Git, Linux*). Cada una tiene su logo SVG en `TechLogos.tsx` y una animación 3D (flotación continua, inclinación según el cursor y giro al pasar el mouse) que se desactiva con *prefers-reduced-motion*. Para agregar una, edítala en `TECHNOLOGIES` de `src/data/content.ts` y agrega su logo en `TechLogos.tsx`; sin logo se muestra una insignia con su abreviatura.
  6. **Banners CTA Intermedios**: Banners estilizados con el árbol cibernético resplandeciente invitando a iniciar proyectos.
  7. **Sobre Nosotros (`/nosotros`)**: Nuestro objetivo en 4 pilares (`PURPOSE_PILLARS` en `src/data/content.ts`): *Software al alcance de todos*, *Automatizar lo repetitivo*, *Innovar con propósito* y *Para empresas de todo tamaño* (de microempresas y pequeños emprendimientos a grandes empresas); el compromiso con el crecimiento tecnológico de Colombia y la visión de llegar a mercados internacionales, innovando y creciendo; y **Lo que nos apasiona**, con la pasión de cada integrante (campo `passion` en `src/data/team.ts`, resumido de su portafolio) y un enlace a `/equipo`. No repite la sección del equipo.
  8. **Nuestro Proceso (`/nosotros`)**: Línea de tiempo de 4 pasos con conectores animados (*Analizamos*, *Diseñamos*, *Desarrollamos*, *Entregamos*).
  9. **Contáctanos (`/contacto`)**: Tarjetas con datos directos de contacto (correo con función para copiar con un clic, ubicación en Colombia, WhatsApp directo) y formulario interactivo con validación y confirmación en tiempo real.
  10. **Pie de Página (`Footer`)**: Logotipo de marca, enlaces rápidos a cada página, correo, WhatsApp, ubicación y lema *"Código que construye futuro"*.

---

## 📁 Estructura del Proyecto

```
TreesSide Developers/
├── public/
│   └── images/
│       ├── treesside-logo.jpg     # Logo actual con TreesSide y subtítulo Developers
│       ├── logo.jpg               # Archivo original conservado; no se usa en la interfaz
│       ├── projects/              # Imágenes de proyectos tomadas de los portafolios (WebP)
│       ├── team/                  # Retratos del equipo (WebP)
│       └── services-laptop.jpg    # Ilustración 3D de laptop para Servicios
├── src/
│   ├── app/
│   │   ├── globals.css            # Sistema de diseño, tokens de color, sombras y animaciones
│   │   ├── layout.tsx             # Metadatos SEO, OpenGraph y configuración HTML
│   │   ├── page.tsx               # Inicio (hero)
│   │   ├── servicios/page.tsx     # Servicios y tecnologías
│   │   ├── proyectos/page.tsx     # Proyectos
│   │   ├── nosotros/page.tsx      # Sobre nosotros (objetivo y pasiones) y proceso
│   │   ├── equipo/page.tsx        # Perfiles ampliados del equipo
│   │   └── contacto/page.tsx      # Contacto
│   ├── components/
│   │   ├── AboutSection.tsx       # Objetivo, convicción y lo que apasiona a cada integrante
│   │   ├── ContactSection.tsx     # Sección de contacto y formulario interactivo
│   │   ├── Footer.tsx             # Pie de página y enlaces sociales
│   │   ├── Hero.tsx               # Portada principal y tarjetas de características
│   │   ├── Logo.tsx               # Componente de marca y logotipo reactivo
│   │   ├── Navbar.tsx             # Barra de navegación entre páginas y menú móvil
│   │   ├── ProcessSection.tsx     # Flujo de proceso en 4 pasos
│   │   ├── ProjectModal.tsx       # Ventana modal de detalle para proyectos
│   │   ├── ProjectsSection.tsx    # Cuadrícula de proyectos con filtros
│   │   ├── ServicesSection.tsx    # 6 tarjetas de servicios y visual de laptop 3D
│   │   ├── SitePage.tsx           # Estructura común: cabecera, contenido y pie
│   │   ├── TechLogos.tsx          # Logos SVG de cada tecnología
│   │   └── TechStackSection.tsx   # Cuadrícula de tecnologías 3D y banner CTA
│   └── data/
│       └── content.ts             # Datos estructurados y tipados de la aplicación
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## Idioma

La interfaz utiliza español latinoamericano neutral (`lang="es-419"`): **Conoce**, **Abre**, **Elige** y **Explora**, sin voseo regional. Los nombres propios, marcas y tecnologías conservan su escritura original.

## Identidad visual y retratos

La marca se presenta como **TreesSide**, con **Developers** debajo como subtítulo. `src/components/Logo.tsx` controla esa composición en el header y footer. El nuevo recurso `public/images/treesside-logo.jpg` conserva el árbol e incorpora el nuevo nombre; `public/images/logo.jpg` se conserva como original, sin usarse en la interfaz. Los metadatos y textos visibles usan TreesSide Developers.

Los correos, dominios y destinos de contacto existentes se mantienen: el cambio de nombre no implica que exista un dominio nuevo. El saludo de WhatsApp usa el nuevo nombre.

El retrato de Jorge conserva la proporción vertical original (288×384 en la copia optimizada) y se muestra con `photoFit: 'contain'` en `src/data/team.ts`, sin el recorte cuadrado que generaba zoom. Las demás fotos mantienen su encuadre.

## 🚀 Comandos para Ejecutar

### 1. Iniciar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible de inmediato en [http://localhost:3000](http://localhost:3000).

La página **Nuestro equipo** está en `/equipo`, accesible desde el menú principal, el pie de página y el enlace de **Lo que nos apasiona** en `/nosotros`. Cada tarjeta cerrada es horizontal (foto a la izquierda; rol, nombre, descripción y botones a la derecha), con dos tarjetas por fila en escritorio y apiladas en celular; todas tienen el mismo tamaño y los botones quedan alineados abajo. Presenta fotos grandes, áreas de aporte, formación y proyectos personales publicados en los portafolios; no atribuye esos proyectos a TreesSide Developers y marca como *Experiencia laboral* los productos de otras empresas. Comparte el header de todas las páginas (logo, menú de escritorio y móvil), que enlaza a cada página de sección. El enlace Equipo permanece activo en la página del equipo. Los perfiles, enlaces y datos ampliados se editan en `src/data/team.ts`; La galería de la página propia está en `src/components/TeamGallery.tsx` y `src/components/TeamGallery.module.css`. La ruta y sus metadatos están en `src/app/equipo/page.tsx`. Incluye fotos extraídas de los tres portafolios y optimizadas localmente a WebP de hasta 384px en `public/images/team/`, tecnologías declaradas en los portafolios. El perfil de Jorge incluye desarrollo de software, datos y automatización; su información se extrajo del código JavaScript público de su portafolio, porque el HTML inicial no contiene el contenido renderizado. Las fotos se muestran con carga diferida y dimensiones reservadas, sin depender de servidores externos. No se generan porcentajes de habilidades.

En `/equipo`, los integrantes aparecen en una cuadrícula adaptable, con foto grande y descripción breve debajo. El título **Talento que crece** no fija una cantidad: se agregan perfiles en `src/data/team.ts`, sin añadir selectores CSS por integrante. **Ver perfil** cambia a una vista donde solo aparece la tarjeta seleccionada, centrada y ocupando todo el ancho del contenedor; no desplaza la fila ni utiliza desplazamiento horizontal. La foto y descripción quedan a la izquierda y la información a la derecha, en el flujo normal de la página. **Volver al equipo** restaura la cuadrícula y devuelve el foco al botón del integrante seleccionado. Hasta 760px, foto e información se apilan para mantener la lectura. Los botones tienen `aria-expanded` y `aria-controls`; los perfiles no seleccionados y su contenido están ocultos. Los controles funcionan con clic, toque y teclado (Enter/Espacio).

Las fotos tienen un diseño CSS 3D con placa posterior desplazada, relieve, sombras, perspectiva, reflejo frontal y flotación suave; reaccionan al mouse también en la vista seleccionada, sin mover el texto. Los cambios de vista incluyen una salida breve, entrada con desvanecimiento y escala, y aparición progresiva de la información; la cuadrícula reaparece de forma escalonada. No se reconstruyen modelos 3D de los rostros. Una escultura de capas flotantes aporta movimiento decorativo, sin WebGL ni dependencias adicionales. El resumen del inicio conserva sus tarjetas y animaciones anteriores. La inclinación se desactiva en pantallas táctiles; con `prefers-reduced-motion: reduce` el cambio es inmediato y se eliminan las animaciones y transiciones de la galería. Los enlaces a los portafolios permanecen accesibles en ambas vistas y abren en otra pestaña.

Para comprobar las fotos y conservar los enlaces del equipo, con el servidor local iniciado:
```bash
node --test "tests/*.test.mjs"
```
Puedes cambiar el servidor mediante `TEST_BASE_URL`.

Para comprobar en un navegador que ninguna página se desplaza hacia los lados en celulares (360 y 390 px), con el servidor de producción iniciado y Microsoft Edge instalado (o la ruta de otro Chromium en `BROWSER_EXECUTABLE`):
```bash
node scripts/check-mobile-browser.mjs
```
En celulares y pantallas táctiles, las entradas al hacer scroll solo se desvanecen, sin inclinación 3D.

### 2. Generar compilación de producción
```bash
npm run build
```

### 3. Iniciar servidor de producción
```bash
npm run start
```