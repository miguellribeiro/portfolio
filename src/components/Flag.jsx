import { useId } from 'react';

/** Bandeiras em SVG simplificadas (redondas). Emoji de bandeira não renderiza no Windows. */
const star = (cx, cy, r) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
  });
  return pts.join(' ');
};

const FLAGS = {
  BR: (
    <>
      <rect width="24" height="24" fill="#009C3B" />
      <path d="M12 4.2 21.2 12 12 19.8 2.8 12Z" fill="#FFDF00" />
      <circle cx="12" cy="12" r="4.6" fill="#002776" />
      <path d="M7.5 11.1c3-.9 6.2-.4 9 1.4" fill="none" stroke="#fff" strokeWidth=".9" />
    </>
  ),
  ES: (
    <>
      <rect width="24" height="24" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
      <rect x="6" y="9.6" width="2.6" height="4.4" rx=".6" fill="#AA151B" opacity=".85" />
    </>
  ),
  US: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />)}
      <rect width="11" height={(24 / 13) * 7} fill="#3C3B6E" />
      {[[2.2, 2.2], [5.5, 2.2], [8.8, 2.2], [3.8, 5], [7.2, 5], [2.2, 7.8], [5.5, 7.8], [8.8, 7.8], [3.8, 10.6], [7.2, 10.6]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r=".7" fill="#fff" />
      ))}
    </>
  ),
  EU: (
    <>
      <rect width="24" height="24" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i;
        return <polygon key={i} points={star(12 + 6.4 * Math.sin(a), 12 - 6.4 * Math.cos(a), 1.25)} fill="#FFCC00" />;
      })}
    </>
  ),
  MX: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <rect width="8" height="24" fill="#006847" />
      <rect x="16" width="8" height="24" fill="#CE1126" />
      <circle cx="12" cy="12" r="2.2" fill="#8C5A2B" opacity=".85" />
    </>
  ),
  CL: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <rect y="12" width="24" height="12" fill="#D52B1E" />
      <rect width="10" height="12" fill="#0039A6" />
      <polygon points={star(5, 6, 2.6)} fill="#fff" />
    </>
  ),
  CO: (
    <>
      <rect width="24" height="24" fill="#FCD116" />
      <rect y="12" width="24" height="6" fill="#003893" />
      <rect y="18" width="24" height="6" fill="#CE1126" />
    </>
  ),
  AR: (
    <>
      <rect width="24" height="24" fill="#74ACDF" />
      <rect y="8" width="24" height="8" fill="#fff" />
      <circle cx="12" cy="12" r="2" fill="#F6B40E" />
    </>
  ),
  LATAM: (
    <>
      <rect width="24" height="24" fill="#2E1623" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="#FF7AB3" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8" fill="none" stroke="#FF7AB3" strokeWidth="1.2" />
      <path d="M4 12h16M5.5 8h13M5.5 16h13" stroke="#FF7AB3" strokeWidth="1.1" />
    </>
  ),
};

/** Idioma da interface → bandeira. */
const ALIAS = { 'pt-BR': 'BR', pt: 'BR', es: 'ES', en: 'US' };

export default function Flag({ code, size = 20 }) {
  const id = useId().replace(/:/g, '');
  const key = FLAGS[code] ? code : ALIAS[code] || ALIAS[code.split('-')[0]];
  return (
    <svg className="flag" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs><clipPath id={`f-${id}`}><circle cx="12" cy="12" r="12" /></clipPath></defs>
      <g clipPath={`url(#f-${id})`}>{FLAGS[key] || <rect width="24" height="24" fill="#999" />}</g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgb(0 0 0 / .15)" />
    </svg>
  );
}
