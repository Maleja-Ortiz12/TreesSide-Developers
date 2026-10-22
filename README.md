# TreesSide Developers — Frontend Web Oficial

Plataforma frontend oficial para **TreesSide Developers**, desarrollada con **Next.js 15 (App Router)**, **React 19**, **TypeScript** y diseño cyberpunk oscuro con acentos de neón esmeralda y cian, replicando fielmente el diseño de marca y mockup proporcionado.

---

## 🎨 Características Visuales y de Diseño

- **Paleta Cyberpunk Neón**:
  - Fondo oscuro profundo (`#070d17` / `#040810`)
  - Acentos de neón verde esmeralda (`#00f5a0`) y cian tecnológico (`#00d2ff`)
  - Tarjetas de vidrio (*glassmorphism*) con bordes y resplandores interactivos
  - Tipografía moderna: **Outfit** y **JetBrains Mono**
- **Logo Oficial Integrado**:
  - Uso del logo oficial del árbol tecnológico en la cabecera, hero, banners, sección "Sobre Nosotros" y pie de página.
- **Páginas**: cada sección tiene su propia ruta para que el inicio no concentre todo el contenido:

  | Ruta | Contenido |
  | --- | --- |
  | `/` | Hero principal |
  | `/servicios` | Servicios y tecnologías que usamos |
  | `/proyectos` | Proyectos destacados y del equipo |
  | `/nosotros` | Objetivo del equipo, lo que nos apasiona y proceso |
  | `/equipo` | Perfiles ampliados del equipo |
  | `/contacto` | Datos de contacto y formulario |

- **Secciones**:
  1. **Navegación Sticky**: Cabecera de cristal compartida por todas las páginas; resalta la página actual y tiene menú móvil responsivo.
  2. **Hero Principal (`/`)**: Kicker `IDEAS > CÓDIGO > SOLUCIONES`, titular con degradado neón, botones de llamada a la acción (*Ver nuestros proyectos* lleva a `/proyectos`, *Contáctanos* a `/contacto`), árbol cyber interactivo y 4 tarjetas de aspectos destacados (*Desarrollo Web*, *Bases de Datos*, *Soluciones Cloud*, *Apps a Medida*).
  3. **Proyectos (`/proyectos`)**: Catálogo generado desde `src/data/team.ts` con los proyectos publicados en los portafolios del equipo: Ronaldo (Ocho80, Radio Navidad, Calculadora de contenedores, Libres en Cristo Jesús), Jorge (Floraltech E-Commerce, Atherium 3D Game, Otaku Portal, API de Tienda + Asistente IA, Portfolio CMS, Dashboard BI · Superstore, EDA · Renta Ciudadana, Análisis de Ventas de Cafetería) y María Alejandra (Dimension Shift, UptownHair, Emisoras Latinas, Entre Lanas y Fragancias, Sistema de gestión de inventarios, Aplicación de gestión agropecuaria). Luhos, Gudfy y Tanku se muestran como **Experiencia laboral** de Ronaldo: son productos de otras empresas en los que participó como empleado, no proyectos de TreesSide. Las imágenes se tomaron de cada portafolio y se guardan en `public/images/projects/` (WebP, 960 px); los proyectos cuyo portafolio no publica imagen usan la imagen de marca con una nota visible. Los filtros incluyen **Proyectos del equipo**, **Experiencia laboral** y cada categoría, y el detalle enlaza al portafolio del autor y, cuando existe, al proyecto en línea.
  4. **Servicios Tecnológicos (`/servicios`)**:
     - Ilustración 3D de laptop futurista con código resplandeciente y nube flotante.
     - 9 tarjetas con ejemplos de lo que el equipo puede construir, basados en sus portafolios: *Desarrollo Web* (comercio electrónico multivendedor, tiendas, aplicaciones de reservas, APIs REST y WordPress), *Bases de Datos*, *Cloud & DevOps* (Azure, GitHub Actions), *Aplicaciones Móviles* (Flutter, React Native), *Business Intelligence*, *Seguridad & Mantenimiento*, *Videojuegos con Unity*, *Automatización con n8n* y *Plataformas conectadas* (radio web, tiempo real, asistentes con Azure OpenAI).
  5. **Tecnologías que usamos (`/servicios`)**: Cuadrícula con las tecnologías declaradas en los portafolios del equipo: lenguajes (*JavaScript, TypeScript, PHP, Dart, SQL, C#, C++, Python*), frameworks (*Next.js, NestJS, React, Laravel, .NET, Node.js, Medusa, Flutter, React Native, Expo, Unity, HTML y CSS, Vite, Tailwind CSS, Bootstrap, Framer Motion, WordPress, Socket.IO*), datos (*PostgreSQL, MySQL, SQL Server, Prisma, Pandas, Excel, Power BI*) y herramientas (*n8n, Power Automate, Azure, Firebase, Docker, GitHub Actions, Git, Linux*). Cada una tiene su logo SVG en `TechLogos.tsx` y una animación 3D (flotación continua, inclinación según el cursor y giro al pasar el mouse) que se desactiva con *prefers-reduced-motion*. Para agregar una, edítala en `TECHNOLOGIES` de `src/data/content.ts` y agrega su logo en `TechLogos.tsx`; sin logo se muestra una insignia con su abreviatura.
  6. **Banners CTA Intermedios**: Banners estilizados con el árbol cibernético resplandeciente invitando a iniciar proyectos.
  7. **Sobre Nosotros (`/nosotros`)**: Nuestro objetivo en 4 pilares (`PURPOSE_PILLARS` en `src/data/content.ts`): *Software al alcance de todos*, *Automatizar lo repetitivo*, *Innovar con propósito* y *Para empresas de todo tamaño* (de microempresas y pequeños emprendimientos a grandes empresas); la convicción de que la tecnología y la innovación son herramientas para que Colombia crezca; y **Lo que nos apasiona**, con la pasión de cada integrante (campo `passion` en `src/data/team.ts`, resumido de su portafolio) y un enlace a `/equipo`. No repite la sección del equipo.
  8. **Nuestro Proceso (`/nosotros`)**: Línea de tiempo de 4 pasos con conectores animados (*Analizamos*, *Diseñamos*, *Desarrollamos*, *Entregamos*).
  9. **Contáctanos (`/contacto`)**: Tarjetas con datos directos de contacto (correo con función para copiar con un clic, ubicación en Colombia, WhatsApp directo) y formulario interactivo con validación y confirmación en tiempo real.
  10. **Pie de Página (`Footer`)**: Logotipo de marca, enlaces rápidos a cada página, redes sociales (GitHub, LinkedIn, YouTube, X) y lema *"Código que construye futuro"*.

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

La página **Nuestro equipo** está en `/equipo`, accesible desde el menú principal, el pie de página y el enlace de **Lo que nos apasiona** en `/nosotros`. Presenta fotos grandes, áreas de aporte, formación y proyectos personales publicados en los portafolios; no atribuye esos proyectos a TreesSide Developers y marca como *Experiencia laboral* los productos de otras empresas. Comparte el header de todas las páginas (logo, menú de escritorio y móvil), que enlaza a cada página de sección. El enlace Equipo permanece activo en la página del equipo. Los perfiles, enlaces y datos ampliados se editan en `src/data/team.ts`; La galería de la página propia está en `src/components/TeamGallery.tsx` y `src/components/TeamGallery.module.css`. La ruta y sus metadatos están en `src/app/equipo/page.tsx`. Incluye fotos extraídas de los tres portafolios y optimizadas localmente a WebP de hasta 384px en `public/images/team/`, tecnologías declaradas en los portafolios. El perfil de Jorge incluye desarrollo de software, datos y automatización; su información se extrajo del código JavaScript público de su portafolio, porque el HTML inicial no contiene el contenido renderizado. Las fotos se muestran con carga diferida y dimensiones reservadas, sin depender de servidores externos. No se generan porcentajes de habilidades.

En `/equipo`, los integrantes aparecen en una cuadrícula adaptable, con foto grande y descripción breve debajo. El título **Talento que crece** no fija una cantidad: se agregan perfiles en `src/data/team.ts`, sin añadir selectores CSS por integrante. **Ver perfil** cambia a una vista donde solo aparece la tarjeta seleccionada, centrada y ocupando todo el ancho del contenedor; no desplaza la fila ni utiliza desplazamiento horizontal. La foto y descripción quedan a la izquierda y la información a la derecha, en el flujo normal de la página. **Volver al equipo** restaura la cuadrícula y devuelve el foco al botón del integrante seleccionado. Hasta 760px, foto e información se apilan para mantener la lectura. Los botones tienen `aria-expanded` y `aria-controls`; los perfiles no seleccionados y su contenido están ocultos. Los controles funcionan con clic, toque y teclado (Enter/Espacio).

Las fotos tienen un diseño CSS 3D con placa posterior desplazada, relieve, sombras, perspectiva, reflejo frontal y flotación suave; reaccionan al mouse también en la vista seleccionada, sin mover el texto. Los cambios de vista incluyen una salida breve, entrada con desvanecimiento y escala, y aparición progresiva de la información; la cuadrícula reaparece de forma escalonada. No se reconstruyen modelos 3D de los rostros. Una escultura de capas flotantes aporta movimiento decorativo, sin WebGL ni dependencias adicionales. El resumen del inicio conserva sus tarjetas y animaciones anteriores. La inclinación se desactiva en pantallas táctiles; con `prefers-reduced-motion: reduce` el cambio es inmediato y se eliminan las animaciones y transiciones de la galería. Los enlaces a los portafolios permanecen accesibles en ambas vistas y abren en otra pestaña.

Para comprobar las fotos y conservar los enlaces del equipo, con el servidor local iniciado:
```bash
node --test tests/*.test.mjs
```
Puedes cambiar el servidor mediante `TEST_BASE_URL`.

### 2. Generar compilación de producción
```bash
npm run build
```

### 3. Iniciar servidor de producción
```bash
npm run start
```