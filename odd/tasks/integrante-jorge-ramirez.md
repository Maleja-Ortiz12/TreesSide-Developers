# Integrante Jorge Luis Ramírez

Add Jorge Luis Ramírez Trochez to the team with his portfolio projects and technologies as part of the company catalog.
Branch: `feat/portafolios-y-nosotros` (after a567f27). Source: https://www.jorgeramirez.site/ (fetched to `.atl/portfolios/ramirez/`, gitignored).

## Specs

- S1. "agrega a esta persona al equipo porfa": Jorge Luis Ramírez Trochez appears on /equipo with his portrait from the portfolio, role, description, skills, contributions, education/experience and portfolio link, and in "Lo que nos apasiona" on /nosotros.
- S2. "trae sus proyectos ... como parte de la empresa porfa": his portfolio projects (Emisoras Latinas, TengoYa, CarWeb, Histech, Christmas Radio Navidad, Robot Alejo 2.0, Migración Pega → UiPath) appear on /proyectos with their portfolio cover images stored locally; a project without an image keeps the brand image note.
- S3. Decision (L2): "Una tarjeta con ambos autores": Emisoras Latinas (with María Alejandra) and Christmas Radio Navidad = Ronaldo's Radio Navidad are one card each, crediting both members, with no duplicate card.
- S4. Decision (L2): "Sí, como experiencia laboral": Robot Alejo 2.0 and Migración Pega → UiPath are marked as his work experience, like Luhos, Gudfy and Tanku.
- S5. "trae sus ... tecnologias como parte de la empresa": technologies from his stack missing on /servicios (UiPath, Bizagi, SAP, NumPy, OpenAI) are added with their own logo and the 3D animation; services reflect RPA/process automation and AI, SEO.
- S6. Counts derived from data (home brand card "N desarrolladores") reflect the new member.

## Tasks

- T1 [S1, S6] Member profile, portrait and passion — inline — commit: 52c54f5 (done)
- T2 [S2, S3, S4] Projects with images, shared authorship, experience — inline — commit: 52c54f5 (done)
- T3 [S5] Technologies and services — inline — commit: pending

## Log

- L1 (user, verbatim): "agrega a esta persona al equipo porfa, trae sus proyectos y tecnologgias como parte de la empresa porfa" / "Jorge Luis Ramirez \nhttps://www.jorgeramirez.site/"
- L2 (user decisions): shared projects → "Una tarjeta con ambos autores"; employer work → "Sí, como experiencia laboral".
- L3 (evidence): The Pega migration cover (`/projects/migracion-pega-uipath/cover.webp`) returned an error, so it keeps the brand image. Christmas Radio Navidad cover shows the same Radio Navidad site as Ronaldo's project. Testimonials in his portfolio are not copied (not verifiable).
