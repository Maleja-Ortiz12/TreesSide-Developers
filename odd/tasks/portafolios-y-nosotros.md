# Portafolios y Sobre nosotros

Align services, technologies and projects with the three team portfolios (with project images),
and replace the team block on /nosotros with the team's purpose and passions.
Branch: `feat/portafolios-y-nosotros` (from `feat/paginas-por-seccion`, commit 0d0ccc6).

## Specs

- S1. "en los servicios y tecnologias verifica que no falten acorde a los portafolios que tenemos": every technology and service evidenced in the portfolios of Ronaldo (https://ronaldo-delgado.vercel.app/), Jorge (https://portafolio-xi-liart-92.vercel.app/) and María Alejandra (https://portafolio-bay-tau.vercel.app/) appears on /servicios; each new technology has its own logo (no initials fallback) and the existing 3D animation.
- S2. "igual en los proyectos, falta traer proyectos e imagenes de los proyectos": /proyectos lists the projects published in the three portfolios, each with the image its portfolio publishes (stored locally); projects whose portfolio has no image keep the brand image with a visible note.
- S3. Decision (L2): Ronaldo's employer projects Luhos, Gudfy and Tanku are included "como experiencia del integrante": marked as the member's work experience, never presented as TreesSide projects or clients.
- S4. Decision (L2): remove the template demo projects Spacerolloph VR and Business Analytics ("Quitarlos").
- S5. "en sobre nosotros quita la parte de nuestro equipo ya que este ya existe en la seccion de equipo": /nosotros no longer renders the team section; the team section stays on /equipo (its project lists follow S2/S3).
- S6. "y trae mas bien la informacion de lo que a cada uno en general nos apasiona y nuestro objetivo, como crear softwares que esten al alcance de todos, que ayuden a automatizar cosas para quitar los procesos manuales repetitivos, que queremos innovar, ayudar a microempresas y pequeños emprendimientos hasta grandes empresas para que Colombia sea un pais mas tecnologico y productivo y creemos que la tecnologia e innovacion es una herramienta para crecer como pais": /nosotros states that objective (accessible software, automating repetitive manual processes, innovation, serving micro and small businesses up to large companies, a more technological and productive Colombia, technology and innovation as a tool for the country to grow) and what each member is passionate about, based on their portfolios.

## Tasks

- T1 [S1] Services and technologies from portfolios — inline — commit: a70675e (done)
- T2 [S2, S3, S4] Projects with local images, member experience, demo projects removed — inline — commit: 3bbbe26 (done)
- T3 [S5, S6] /nosotros purpose and passions, team section removed — inline — commit: a15b248 (done)

## Log

- L1 (user, verbatim): "en los servicios y tecnologias verifica que no falten acorde a los portafolios que tenemos, igual en los proyectos, falta traer proyectos e imagenes de los proyectos y en sobre nosotros quita la parte de nuestro equipo ya que este ya existe en la seccion de equipo, y trae mas bien la informacion de lo que aa acad uno en general nos apsiona y nuestro objetivo, como crear softwares que esten al alcance de todos, que ayuden a automaizar cosas para quitar los procesos manuales repetitivos, que queremos innovar, ayudar a microempresas y pequeños empreendimientos hasta grandes empresas para que Colombia sea un pais mas tecnologico y productivo y creemos que la tecnologiA e inovacion es una herramienta para crecer como pais"
- L2 (user decisions): Luhos/Gudfy/Tanku → "Sí, como experiencia del integrante"; Spacerolloph VR and Business Analytics → "Quitarlos".
- L3 (evidence): portfolio sources fetched to `.atl/portfolios/` (gitignored). Ronaldo and María render server-side HTML; Jorge's content lives in `/assets/index-D_W1cOep.js`. María's in-development items (AgroSoft, Sinergia) and personal portfolio sites are excluded as not delivered projects.
- L4 (evidence): T1 a70675e, T2 3bbbe26, T3 a15b248. 47/47 tests pass, tsc and next build pass. Member passions are summarized from each portfolio and need the team's confirmation. Fixed leftover SoftZenkodoDevs brand on the about card. TeamSection component removed (no longer used).
- L5 (verification): RDD assess for 0d0ccc6..HEAD = medium, reviewDue false; independent gentle-ai-verify returned S2 FAIL (missing Jorge 'API de Tienda + Asistente IA'), S1 PARTIAL ('APIs REST' service dropped; HTML/CSS, Vite, Medusa, Framer Motion, Firebase, Excel missing), S5 PARTIAL (spec wording said /equipo unchanged, contradicting S3). Fixed: project added with its GitHub link, APIs REST restored, 6 technologies with logos added, clean project id slugs, data charts uncropped; S5 reworded (wording error, not a requirement change). Not added (libraries/test tools, judged too granular): NumPy, Seaborn, Matplotlib, MikroORM, Groq, Jest, xUnit.
