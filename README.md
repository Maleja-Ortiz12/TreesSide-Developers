# SoftZenkodoDevs — Frontend Web Oficial

Plataforma frontend oficial para **SoftZenkodoDevs**, desarrollada con **Next.js 15 (App Router)**, **React 19**, **TypeScript** y diseño cyberpunk oscuro con acentos de neón esmeralda y cian, replicando fielmente el diseño de marca y mockup proporcionado.

---

## 🎨 Características Visuales y de Diseño

- **Paleta Cyberpunk Neón**:
  - Fondo oscuro profundo (`#070d17` / `#040810`)
  - Acentos de neón verde esmeralda (`#00f5a0`) y cian tecnológico (`#00d2ff`)
  - Tarjetas de vidrio (*glassmorphism*) con bordes y resplandores interactivos
  - Tipografía moderna: **Outfit** y **JetBrains Mono**
- **Logo Oficial Integrado**:
  - Uso del logo oficial del árbol tecnológico en la cabecera, hero, banners, sección "Sobre Nosotros" y pie de página.
- **Vistas y Secciones**:
  1. **Navegación Sticky**: Cabecera de cristal con scrollspy activo, enlaces de anclaje suave y menú móvil responsivo.
  2. **Hero Principal (`#inicio`)**: Kicker `IDEAS > CÓDIGO > SOLUCIONES`, titular con degradado neón, botones de llamada a la acción (*Ver nuestros proyectos*, *Contáctanos*), árbol cyber interactivo y 4 tarjetas de aspectos destacados (*Desarrollo Web*, *Bases de Datos*, *Soluciones Cloud*, *Apps a Medida*).
  3. **Proyectos Destacados (`#proyectos`)**: Tarjetas de proyectos con imágenes fotorrealistas de alta resolución, filtros por categoría y modal interactivo para ver detalles completos:
     - **Spacerolloph VR** (`Unity + C#`)
     - **FloralTech** (`PHP + MySQL`)
     - **Business Analytics** (`SQL Server + Power BI`)
  4. **Servicios Tecnológicos (`#servicios`)**:
     - Ilustración 3D de laptop futurista con código resplandeciente y nube flotante.
     - 6 tarjetas de servicios detalladas con viñetas: *Desarrollo Web*, *Bases de Datos*, *Cloud & DevOps*, *Aplicaciones Móviles*, *Business Intelligence*, *Seguridad & Mantenimiento*.
  5. **Tecnologías que usamos**: Cuadrícula con logotipos vectoriales SVG nítidos de las 12 tecnologías: *C#, .NET, React, Node.js, MySQL, SQL Server, Laravel, Python, Power BI, Docker, Git, Linux*.
  6. **Banners CTA Intermedios**: Banners estilizados con el árbol cibernético resplandeciente invitando a iniciar proyectos.
  7. **Sobre Nosotros (`#sobre-nosotros`)**: Descripción de misión y 4 pilares: *Innovación Constante*, *Trabajo en Equipo*, *Calidad en el Código*, *Enfoque en el Cliente*.
  8. **Nuestro Proceso**: Línea de tiempo de 4 pasos con conectores animados (*Analizamos*, *Diseñamos*, *Desarrollamos*, *Entregamos*).
  9. **Contáctanos (`#contacto`)**: Tarjetas con datos directos de contacto (correo con función para copiar con un clic, ubicación en Colombia, WhatsApp directo) y formulario interactivo con validación y confirmación en tiempo real.
  10. **Pie de Página (`Footer`)**: Logotipo de marca, enlaces rápidos, redes sociales (GitHub, LinkedIn, YouTube, X) y lema *"Código que construye futuro"*.
  11. **Selector de Vistas Flotante**: Barra inferior que permite alternar entre la página completa unificada o aislar cada una de las 3 columnas del mockup de diseño.

---

## 📁 Estructura del Proyecto

```
SoftZenkodoDevs/
├── public/
│   └── images/
│       ├── logo.jpg               # Logo oficial del árbol de circuitos SoftZenkodoDevs
│       ├── spacerolloph-vr.jpg    # Render para proyecto Spacerolloph VR
│       ├── floraltech.jpg         # Fotografía para proyecto FloralTech
│       ├── business-analytics.jpg # Dashboard de Business Analytics
│       └── services-laptop.jpg    # Ilustración 3D de laptop para Servicios
├── src/
│   ├── app/
│   │   ├── globals.css            # Sistema de diseño, tokens de color, sombras y animaciones
│   │   ├── layout.tsx             # Metadatos SEO, OpenGraph y configuración HTML
│   │   └── page.tsx               # Ensamblado principal de la aplicación y lógica de vistas
│   ├── components/
│   │   ├── AboutSection.tsx       # Sección Sobre Nosotros y pilares de valor
│   │   ├── ContactSection.tsx     # Sección de contacto y formulario interactivo
│   │   ├── Footer.tsx             # Pie de página y enlaces sociales
│   │   ├── Hero.tsx               # Portada principal y tarjetas de características
│   │   ├── Logo.tsx               # Componente de marca y logotipo reactivo
│   │   ├── Navbar.tsx             # Barra de navegación con scrollspy y responsive drawer
│   │   ├── ProcessSection.tsx     # Flujo de proceso en 4 pasos
│   │   ├── ProjectModal.tsx       # Ventana modal de detalle para proyectos
│   │   ├── ProjectsSection.tsx    # Cuadrícula de proyectos con filtros
│   │   ├── ServicesSection.tsx    # 6 tarjetas de servicios y visual de laptop 3D
│   │   ├── TechLogos.tsx          # Iconos SVG nítidos para las 12 tecnologías
│   │   ├── TechStackSection.tsx   # Cuadrícula de tecnologías y banner CTA
│   │   └── ViewSwitcher.tsx       # Selector flotante de columnas del mockup
│   └── data/
│       └── content.ts             # Datos estructurados y tipados de la aplicación
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🚀 Comandos para Ejecutar

### 1. Iniciar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible de inmediato en [http://localhost:3000](http://localhost:3000).

### 2. Generar compilación de producción
```bash
npm run build
```

### 3. Iniciar servidor de producción
```bash
npm run start
```