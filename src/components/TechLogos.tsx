import React from 'react';

export function TechLogo({ name }: { name: string }) {
  switch (name) {
    case 'JavaScript':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect width="128" height="128" rx="14" fill="#f7df1e" />
          <text x="112" y="110" fill="#1a1a1a" fontSize="54" fontWeight="800" textAnchor="end" fontFamily="sans-serif">JS</text>
        </svg>
      );
    case 'TypeScript':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect width="128" height="128" rx="14" fill="#3178c6" />
          <text x="112" y="110" fill="#ffffff" fontSize="54" fontWeight="800" textAnchor="end" fontFamily="sans-serif">TS</text>
        </svg>
      );
    case 'PHP':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <ellipse cx="64" cy="64" rx="62" ry="34" fill="#777bb3" />
          <text x="64" y="77" fill="#ffffff" fontSize="38" fontWeight="800" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">php</text>
        </svg>
      );
    case 'Dart':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#01579b" d="M32 96L12 76c-3-3-4-6-4-10V38l44 44z" />
          <path fill="#40c4ff" d="M8 38L38 8h26l52 52v34L94 116z" />
          <path fill="#0175c2" d="M38 8l78 78v30H86z" opacity="0.55" />
          <path fill="#01579b" d="M32 96h54l30 20H52z" />
        </svg>
      );
    case 'SQL':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#0e7490" d="M20 30v68c0 10 20 18 44 18s44-8 44-18V30z" />
          <ellipse cx="64" cy="30" rx="44" ry="18" fill="#38bdf8" />
          <text x="64" y="88" fill="#ffffff" fontSize="30" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">SQL</text>
        </svg>
      );
    case 'C++':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#00599c" d="M115.4 30.7L67.1 2.9c-1.9-1.1-4.3-1.1-6.2 0L12.6 30.7c-1.9 1.1-3.1 3.2-3.1 5.4v55.8c0 2.2 1.2 4.3 3.1 5.4l48.3 27.9c1.9 1.1 4.3 1.1 6.2 0l48.3-27.9c1.9-1.1 3.1-3.2 3.1-5.4V36.1c0-2.2-1.2-4.3-3.1-5.4z" />
          <text x="64" y="78" fill="#ffffff" fontSize="40" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">C++</text>
        </svg>
      );
    case 'Next.js':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <circle cx="64" cy="64" r="60" fill="#000000" stroke="#ffffff" strokeWidth="4" />
          <path d="M46 90V38l44 56" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" />
          <path d="M84 38v34" stroke="#ffffff" strokeWidth="9" />
        </svg>
      );
    case 'NestJS':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <circle cx="64" cy="64" r="60" fill="#e0234e" />
          <path fill="#ffffff" d="M34 92V40l10-10 6 14 14-6 14 6 6-14 10 10v52c-8 8-20 12-30 12s-22-4-30-12z" />
          <circle cx="52" cy="62" r="5" fill="#e0234e" />
          <circle cx="76" cy="62" r="5" fill="#e0234e" />
          <path d="M58 80l6 5 6-5" fill="none" stroke="#e0234e" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'PostgreSQL':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#336791" d="M64 10C34 10 16 30 16 56c0 18 8 32 20 40 2 10 6 22 14 22 6 0 8-8 8-18 2 0 10 0 12 0 0 10 2 18 8 18 8 0 12-12 14-22 12-8 20-22 20-40 0-26-18-46-48-46z" />
          <path fill="#ffffff" d="M84 54c8 2 14 10 12 22-2 8-8 10-12 8l2-14z" />
          <circle cx="50" cy="52" r="7" fill="#ffffff" />
          <circle cx="50" cy="52" r="3" fill="#1e293b" />
          <circle cx="76" cy="52" r="7" fill="#ffffff" />
          <circle cx="76" cy="52" r="3" fill="#1e293b" />
        </svg>
      );
    case 'Flutter':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#54c5f8" d="M78 6L18 66l18 18L114 6z" />
          <path fill="#54c5f8" d="M78 62H114L66 110 48 92z" />
          <path fill="#01579b" d="M66 110l12 12h36L84 92z" />
          <path fill="#29b6f6" d="M48 92l18-18 18 18-18 18z" />
        </svg>
      );
    case 'React Native':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect x="30" y="6" width="68" height="116" rx="12" fill="#0f172a" stroke="#61dafb" strokeWidth="5" />
          <g transform="translate(64 62) scale(2.3)">
            <circle r="2.4" fill="#61dafb" />
            <g stroke="#61dafb" strokeWidth="1.3" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </g>
        </svg>
      );
    case 'Unity':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#f8fafc" d="M64 8l48 28-48 28-48-28z" />
          <path fill="#94a3b8" d="M16 36l48 28v56L16 92z" />
          <path fill="#cbd5e1" d="M112 36L64 64v56l48-28z" />
          <path d="M64 8v56M16 36l48 28 48-28" fill="none" stroke="#0f172a" strokeWidth="3" />
        </svg>
      );
    case 'n8n':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path d="M22 64h28l14-24h22M64 64l14 24h22" fill="none" stroke="#ff6d5a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="64" r="12" fill="#ff6d5a" />
          <circle cx="54" cy="64" r="10" fill="#ff6d5a" />
          <circle cx="102" cy="40" r="12" fill="#ff6d5a" />
          <circle cx="102" cy="88" r="12" fill="#ff6d5a" />
        </svg>
      );
    case 'Azure':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#0089d6" d="M56 12h30L42 116H10z" />
          <path fill="#35c1f1" d="M90 12l32 104H56l28-20-26-30z" />
          <path fill="#0078d4" d="M58 66l26 30-28 20H10z" />
        </svg>
      );
    case 'C#':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36" fill="currentColor">
          <path fill="#9b4993" d="M115.4 30.7L67.1 2.9c-1.9-1.1-4.3-1.1-6.2 0L12.6 30.7c-1.9 1.1-3.1 3.2-3.1 5.4v55.8c0 2.2 1.2 4.3 3.1 5.4l48.3 27.9c1.9 1.1 4.3 1.1 6.2 0l48.3-27.9c1.9-1.1 3.1-3.2 3.1-5.4V36.1c0-2.2-1.2-4.3-3.1-5.4z" />
          <path fill="#ffffff" d="M64 36c-15.5 0-28 12.5-28 28s12.5 28 28 28c8.9 0 16.8-4.2 21.9-10.7l-9.1-5.8c-3.1 4.3-8 6.9-12.8 6.9-9.9 0-18-8.1-18-18s8.1-18 18-18c4.8 0 9.7 2.6 12.8 6.9l9.1-5.8C80.8 40.2 72.9 36 64 36z" />
          <path fill="#ffffff" d="M88 56h3v-4h4v4h4v3h-4v4h4v3h-4v4h-3v-4h-4v4h-3v-4h-4v-3h4v-4h-4v-3h4v-4h3v4h4zm0 7h4v-4h-4v4z" />
        </svg>
      );
    case '.NET':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36" fill="currentColor">
          <circle cx="64" cy="64" r="56" fill="#512bd4" />
          <text x="64" y="74" fill="#ffffff" fontSize="32" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">.NET</text>
        </svg>
      );
    case 'React':
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" width="36" height="36">
          <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'Node.js':
      return (
        <svg viewBox="0 0 256 289" width="36" height="36">
          <path fill="#339933" d="M128 0L24.8 59.6v119.2L128 238.4l103.2-59.6V59.6L128 0zm68 158.4c-3.4 5.9-8.5 10.7-14.8 14.1-13 7.1-29.2 6.8-42.5-.6-13.3-7.5-21.4-21.5-21.4-36.9 0-14.7 7.7-28.3 20.2-35.8 13.1-7.9 29.8-8.2 43.1-.9 6.2 3.4 11.4 8.2 15 14.2l-16.7 9.6c-2.2-3.6-5.3-6.4-9-8.5-8.2-4.5-18.4-4.3-26.4.5-8.1 4.8-13 13.5-13 22.9 0 9.8 5.2 18.7 13.6 23.4 8.2 4.6 18.2 4.4 26.2-.5 4-2.5 7.2-5.7 9.4-9.6l16.7 9.6z" />
        </svg>
      );
    case 'MySQL':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#00758f" d="M102 70c-2.4-7.2-7.5-13.1-14.3-16.5-6.8-3.4-14.9-3.9-22.1-1.3-4.5 1.6-8.6 4.3-11.8 7.8-3.2-3.5-7.3-6.2-11.8-7.8-7.2-2.6-15.3-2.1-22.1 1.3-6.8 3.4-11.9 9.3-14.3 16.5-1.2 3.6-1.5 7.4-0.9 11.2 1.4 8.6 7.4 15.8 15.5 18.7 8.1 2.9 17.2 1.3 23.9-4.1l9.7-7.8 9.7 7.8c6.7 5.4 15.8 7 23.9 4.1 8.1-2.9 14.1-10.1 15.5-18.7 0.6-3.8 0.3-7.6-0.9-11.2z" />
          <path fill="#f29111" d="M64 45c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
        </svg>
      );
    case 'SQL Server':
      return (
        <svg viewBox="0 0 64 64" width="36" height="36">
          <ellipse cx="32" cy="18" rx="22" ry="9" fill="#e74c3c" />
          <path d="M10 18v14c0 5 10 9 22 9s22-4 22-9V18c0 5-10 9-22 9s-22-4-22-9z" fill="#c0392b" />
          <path d="M10 32v14c0 5 10 9 22 9s22-4 22-9V32c0 5-10 9-22 9s-22-4-22-9z" fill="#962d22" />
        </svg>
      );
    case 'Laravel':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#ff2d20" d="M120.3 35.1L82.1 13.5c-1.3-.7-2.9-.7-4.2 0L39.7 35.1c-1.3.7-2.1 2.1-2.1 3.6v43.2c0 1.5.8 2.9 2.1 3.6l38.2 21.6c1.3.7 2.9.7 4.2 0l38.2-21.6c1.3-.7 2.1-2.1 2.1-3.6V38.7c0-1.5-.8-2.9-2.1-3.6zM80 20.8l30.4 17.2-12.7 7.2L67.3 28 80 20.8zm-4.2 8.7l30.4 17.2-12.7 7.2L63.1 36.7l12.7-7.2zm-30 17.4l12.7-7.2 30.4 17.2-12.7 7.2-30.4-17.2zm-4.2 7.7l12.7-7.2 30.4 17.2-12.7 7.2-30.4-17.2zM43.9 76.5V47.9l12.7 7.2v28.6l-12.7-7.2zm34 19.2L47.5 78.5l12.7-7.2 30.4 17.2-12.7 7.2zm38.2-21.6l-12.7 7.2-30.4-17.2 12.7-7.2 30.4 17.2zm0-8.6l-12.7 7.2V44.1l12.7-7.2v28.6z" />
        </svg>
      );
    case 'Python':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#3776ab" d="M63.5 12c-27.1 0-25.5 11.8-25.5 11.8l.1 12.2h26.1v3.7H29.5S14 37.9 14 65.1s13.6 26.2 13.6 26.2h8.1v-11.4s-.4-13.6 13.4-13.6h23.1s13 0 13-12.6V26.4s1.8-14.4-21.7-14.4zm-14 7.6c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4z" />
          <path fill="#ffd438" d="M64.5 116c27.1 0 25.5-11.8 25.5-11.8l-.1-12.2H63.8v-3.7h34.7s15.5 1.8 15.5-25.4-13.6-26.2-13.6-26.2h-8.1v11.4s.4 13.6-13.4 13.6H55.8s-13 0-13 12.6v27.3s-1.8 14.4 21.7 14.4zm14-7.6c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z" />
        </svg>
      );
    case 'Power BI':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect x="20" y="58" width="22" height="52" rx="4" fill="#f2c811" />
          <rect x="52" y="38" width="22" height="72" rx="4" fill="#f2c811" />
          <rect x="84" y="18" width="22" height="92" rx="4" fill="#f2c811" />
        </svg>
      );
    case 'Docker':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#2496ed" d="M123.6 57.3c-1.3-.9-5.1-3.2-13.8-2.6-1.7-5.9-6-10.4-12.2-12.6l-1.8-.6-.9 1.7c-3.1 5.9-4.3 12.6-3.4 19.3-3.6 1.8-8.2 2.8-13.4 2.8H7.3c-2.4 0-4.5 1.3-5.5 3.5-1 2.2-.6 4.7.9 6.5C13.2 88.5 30.5 98.6 51 98.6c43.6 0 75.3-25.8 75.3-57.8 0-1.7-.1-3.4-.3-5.1.7-.4 1.3-.9 1.7-1.4 1.1-1.3 1.1-2.9 0-3.9-1.2-1-2.9-1-4.1-.1zM48 40h12v12H48zm16 0h12v12H64zm-32 0h12v12H32zm16-16h12v12H48zm16 0h12v12H64zm0 32h12v12H64zm-16 0h12v12H48zm-16 0h12v12H32zm-16 0h12v12H16z" />
        </svg>
      );
    case 'Git':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#f05032" d="M124.7 57.7L70.3 3.3c-4.4-4.4-11.5-4.4-15.9 0L39.7 18 56 34.3c3.4-1.1 7.4-.3 10.1 2.4 2.8 2.8 3.5 6.8 2.4 10.3l15.6 15.6c3.4-1.1 7.5-.3 10.2 2.4 3.9 3.9 3.9 10.3 0 14.3s-10.3 3.9-14.3 0c-2.9-2.9-3.7-7.2-2.3-10.8L63.3 54.1v27.2c1.9 1.2 3.4 3 4.2 5.3 2.1 5.9-1 12.4-6.9 14.5s-12.4-1-14.5-6.9c-2.1-5.9 1-12.4 6.9-14.5 2.1-.7 4.3-.8 6.3-.2V52.8c-2-.6-3.9-1.9-5.1-3.7L38.4 64.9v28.2c2.1 1.2 3.8 3.1 4.7 5.5 2.2 6.1-.9 12.9-7.1 15.1-6.1 2.2-12.9-.9-15.1-7.1-2.2-6.1.9-12.9 7.1-15.1 2.3-.8 4.7-.9 6.9-.2V62.4c-2.3-.7-4.4-2.1-5.8-4.1L3.3 84.1c-4.4 4.4-4.4 11.5 0 15.9l54.4 54.4c4.4 4.4 11.5 4.4 15.9 0l51.1-51.1c4.4-4.4 4.4-11.5 0-15.9z" />
        </svg>
      );
    case 'Linux':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <ellipse cx="64" cy="74" rx="34" ry="42" fill="#ffffff" />
          <ellipse cx="64" cy="74" rx="26" ry="34" fill="#1e293b" />
          <ellipse cx="64" cy="80" rx="19" ry="24" fill="#ffffff" />
          <circle cx="64" cy="36" r="22" fill="#1e293b" />
          <ellipse cx="56" cy="34" rx="4" ry="6" fill="#ffffff" />
          <circle cx="57" cy="35" r="2.5" fill="#000000" />
          <ellipse cx="72" cy="34" rx="4" ry="6" fill="#ffffff" />
          <circle cx="71" cy="35" r="2.5" fill="#000000" />
          <polygon points="56,40 72,40 64,48" fill="#f59e0b" />
          <ellipse cx="44" cy="112" rx="14" ry="6" fill="#f59e0b" />
          <ellipse cx="84" cy="112" rx="14" ry="6" fill="#f59e0b" />
        </svg>
      );
    case 'Tailwind CSS':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#38bdf8" d="M64 28c-15 0-24 7.5-28 22.5 5.6-7.5 12.2-10.3 19.6-8.4 4.3 1.1 7.3 4.2 10.7 7.6C71.8 55.3 78 61.6 92 61.6c15 0 24-7.5 28-22.5-5.6 7.5-12.2 10.3-19.6 8.4-4.3-1.1-7.3-4.2-10.7-7.6C84.2 34.3 78 28 64 28zM36 61.6c-15 0-24 7.5-28 22.5 5.6-7.5 12.2-10.3 19.6-8.4 4.3 1.1 7.3 4.2 10.7 7.6 5.5 5.6 11.7 11.9 25.7 11.9 15 0 24-7.5 28-22.5-5.6 7.5-12.2 10.3-19.6 8.4-4.3-1.1-7.3-4.2-10.7-7.6-5.5-5.6-11.7-11.9-25.7-11.9z" />
        </svg>
      );
    case 'Bootstrap':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect x="8" y="8" width="112" height="112" rx="24" fill="#7952b3" />
          <text x="64" y="90" fill="#ffffff" fontSize="72" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">B</text>
        </svg>
      );
    case 'WordPress':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <circle cx="64" cy="64" r="58" fill="#21759b" />
          <circle cx="64" cy="64" r="50" fill="none" stroke="#ffffff" strokeWidth="5" />
          <text x="64" y="86" fill="#ffffff" fontSize="64" fontWeight="700" textAnchor="middle" fontFamily="Georgia, serif">W</text>
        </svg>
      );
    case 'Socket.IO':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <path fill="#e2e8f0" d="M52 60l30-28-14 34zM76 68L46 96l14-34z" />
        </svg>
      );
    case 'Prisma':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#5a67d8" d="M70 6l48 96-66 20L10 92z" />
          <path fill="#c3dafe" d="M70 6L52 122l66-20z" opacity="0.45" />
        </svg>
      );
    case 'Pandas':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect x="34" y="8" width="14" height="34" fill="#150458" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="34" y="54" width="14" height="66" fill="#150458" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="80" y="8" width="14" height="66" fill="#150458" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="80" y="86" width="14" height="34" fill="#150458" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="57" y="46" width="14" height="14" fill="#ffca00" />
          <rect x="57" y="68" width="14" height="14" fill="#e70488" />
        </svg>
      );
    case 'Expo':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#e2e8f0" d="M58 24c3-5 9-5 12 0l52 88c2 4-1 8-6 6-14-6-28-46-40-64-4-6-8-6-12 0-12 18-26 58-40 64-5 2-8-2-6-6z" />
        </svg>
      );
    case 'GitHub Actions':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <circle cx="28" cy="64" r="16" fill="none" stroke="#2088ff" strokeWidth="8" />
          <path d="M44 64h28M72 64l20-28M72 64l20 28" fill="none" stroke="#2088ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="100" cy="28" r="12" fill="#2088ff" />
          <circle cx="100" cy="100" r="12" fill="#2088ff" />
        </svg>
      );
    case 'Power Automate':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#0066ff" d="M8 20h64l40 44-40 44H8l40-44z" />
          <path fill="#4da3ff" d="M48 20h64L80 64z" opacity="0.85" />
        </svg>
      );
    case 'HTML y CSS':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#e34f26" d="M8 6h56v116L18 108z" />
          <path fill="#1572b6" d="M64 6h56l-10 102-46 14z" />
          <text x="64" y="76" fill="#ffffff" fontSize="40" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">5|3</text>
        </svg>
      );
    case 'Vite':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#41d1ff" d="M8 20l56 102 56-102-56 10z" opacity="0.9" />
          <path fill="#bd34fe" d="M76 8L44 16l-6 48 14-2-6 34 34-48-16 2z" />
        </svg>
      );
    case 'Framer Motion':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#bb4bff" d="M24 8h80v40H64z" />
          <path fill="#e2e8f0" d="M24 48h40l40 40H24z" />
          <path fill="#0099ff" d="M24 88h40v40z" />
        </svg>
      );
    case 'Medusa':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#e2e8f0" d="M64 6l52 30v56l-52 30-52-30V36z" />
          <circle cx="64" cy="64" r="22" fill="#0f172a" />
        </svg>
      );
    case 'Firebase':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <path fill="#ffa000" d="M20 104L36 8l22 40z" />
          <path fill="#f57c00" d="M58 48L70 24l38 80z" />
          <path fill="#ffca28" d="M20 104l88 0-44 22z" />
        </svg>
      );
    case 'Excel':
      return (
        <svg viewBox="0 0 128 128" width="36" height="36">
          <rect x="34" y="12" width="84" height="104" rx="8" fill="#21a366" />
          <rect x="10" y="30" width="62" height="68" rx="6" fill="#107c41" />
          <path d="M24 46l24 36M48 46L24 82" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <span aria-hidden="true" data-tech-fallback="true" style={{
          width: 36, height: 36, display: 'grid', placeItems: 'center',
          border: '1px solid var(--border-cyan)', borderRadius: 8,
          fontSize: 11, fontWeight: 700, color: 'var(--primary-cyan)'
        }}>{name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}</span>
      );
  }
}
