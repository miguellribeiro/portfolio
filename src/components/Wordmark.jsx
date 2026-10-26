import { useId } from 'react';

/* Logo A1 "manpe": símbolo de macaco minimalista + "manpe" minúsculo em Bricolage Grotesque 700.
   Geometria = manpe-symbol-{dark,light}.svg (viewBox 4 25 92 72, gerada por build.py do pacote final-a1);
   as cores vêm de --logo-* (styles.css), trocadas por [data-theme] sem flash e sem SVG duplicado. */
const PATHS = [
  'M21 72 V48 A14.5 14.5 0 0 1 50 48 A14.5 14.5 0 0 1 79 48 V72', // cabeça/"m"
  'M50 48 V63', // nariz
  'M21 41 A11 11 0 1 0 21 63 M79 41 A11 11 0 1 1 79 63', // orelhas
  'M30 83 Q50 91 70 83', // sorriso
];

/** Símbolo do logo (macaco A1). Decorativo: o nome acessível vem de quem o usa. */
export function MonkeyMark({ className = '' }) {
  const id = `mk${useId().replace(/:/g, '')}`;
  return (
    <svg className={`mkmark ${className}`} viewBox="4 25 92 72" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="10" y1="30" x2="90" y2="92">
          <stop offset="0" className="mkmark__s1" />
          <stop offset="1" className="mkmark__s2" />
        </linearGradient>
      </defs>
      <g className="mkmark__lines" fill="none" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {PATHS.map((d) => <path key={d} d={d} pathLength="1" />)}
      </g>
      <g className="mkmark__eyes">
        <rect x="32.1" y="54.6" width="6.8" height="6.8" rx="1.5" />
        <rect x="61.1" y="54.6" width="6.8" height="6.8" rx="1.5" />
      </g>
    </svg>
  );
}

/**
 * Wordmark "manpe": símbolo + "manpe" em texto real (Bricolage carregada pelo site), afastado
 * ~1/3 da altura do símbolo, como no lockup. `symbolOnly` para usos pequenos (< ~24px de altura).
 * `decorative`: dentro de um link/status que já tem o nome acessível (anunciado uma única vez);
 * senão o conjunto vira role="img" com aria-label = nome da marca.
 * Componente único — para trocar o logo depois, altere só este arquivo (e os ícones em public/).
 */
export default function Wordmark({ name = 'Manpe', size = 'md', draw = false, symbolOnly = false, decorative = false, className = '' }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name };
  return (
    <span className={`wordmark wordmark--${size} ${symbolOnly ? 'wordmark--symbol' : ''} ${draw ? 'wordmark--draw' : ''} ${className}`} {...a11y}>
      <MonkeyMark className="wordmark__mark" />
      {!symbolOnly && <span className="wordmark__text" aria-hidden="true">{name.toLowerCase()}</span>}
    </span>
  );
}
