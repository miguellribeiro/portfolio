import { useId } from 'react';

/* Logo v3 "Manpe": M cursivo cuja perna direita vira a cauda de um cometa (atrás do M)
   terminando num planeta dourado. Geometria = manpe-symbol-{dark,light}.svg (viewBox -2 0 68 64);
   as cores vêm de --logo-* (styles.css), trocadas por [data-theme] sem flash.
   O "por trás" do M é uma máscara (não um contorno na cor do fundo), então não há
   halo sobre o vidro translúcido do header nem em fundos diferentes do --c-bg. */
const TAIL = 'M42.4 52.4 42.6 53.7 43.1 55.1 43.9 56.3 44.8 57.4 45.9 58.2 47.1 58.9 48.4 59.3 49.7 59.5 51.1 59.6 52.4 59.4 53.8 59.1 55.1 58.6 56.4 57.9 57.7 57.0 58.9 56.0 60.0 54.8 61.0 53.5 61.9 52.0 62.7 50.3 63.4 48.5 63.9 46.5 64.3 44.3 64.5 42.2 64.5 40.1 64.3 38.0 63.9 35.9 63.4 33.9 62.7 31.9 61.9 29.9 60.9 28.1 59.7 26.2 58.4 24.5 57.0 22.9 55.5 21.3 53.8 19.9 52.0 18.6 50.1 17.4 48.1 16.3 46.0 15.4 43.7 14.6 41.4 14.0 39.0 13.5 36.6 13.3 34.0 13.2 31.9 13.3 29.9 13.4 27.9 13.6 25.9 13.8 24.0 14.1 22.1 14.5 20.3 15.0 18.6 15.5 16.9 16.1 15.3 16.7 13.7 17.5 12.2 18.3 10.8 19.2 9.4 20.1 8.1 21.2 7.0 22.3 5.9 23.5 4.8 24.7 3.9 26.1 3.1 27.5 2.4 29.0 1.8 30.5 4.2 31.5 4.8 30.1 5.5 28.8 6.2 27.6 7.1 26.4 8.0 25.4 9.0 24.3 10.0 23.4 11.2 22.5 12.4 21.7 13.7 21.0 15.1 20.3 16.5 19.6 18.0 19.1 19.5 18.6 21.2 18.1 22.8 17.8 24.6 17.4 26.4 17.2 28.2 17.0 30.1 16.9 32.0 16.8 34.0 16.8 36.3 16.9 38.5 17.2 40.6 17.6 42.6 18.2 44.5 18.9 46.4 19.8 48.1 20.7 49.7 21.8 51.3 23.0 52.7 24.3 54.0 25.6 55.2 27.1 56.2 28.6 57.2 30.1 58.0 31.8 58.7 33.4 59.2 35.1 59.6 36.8 59.8 38.5 60.0 40.2 59.9 42.0 59.7 43.7 59.4 45.5 58.9 47.0 58.4 48.4 57.8 49.7 57.1 50.7 56.3 51.7 55.5 52.4 54.7 53.1 53.9 53.5 53.1 53.9 52.3 54.2 51.6 54.3 50.9 54.4 50.3 54.3 49.7 54.2 49.3 54.0 48.9 53.8 48.6 53.5 48.4 53.2 48.2 52.8 48.0 52.4 47.9 51.6Z';
const M_PATH = 'M4.2 52.0 C7.2 52.0 10.2 47.0 12.7 40.0 C15.4 32.0 18.6 22.0 21.4 18.0 C25.7 12.0 30.3 14.0 30.0 20.0 C30.3 28.0 30.8 35.0 30.9 39.0 C34.6 31.0 39.6 22.0 43.6 17.0 C47.7 12.0 52.3 14.0 50.8 21.0 C48.4 32.0 45.9 44.0 45.2 52.0';
const JOINT = 'M42.4 52.4 42.6 53.7 43.1 55.1 43.9 56.3 44.8 57.4 45.9 58.2 47.1 58.9 48.4 59.3 49.7 59.5 50.3 54.3 49.7 54.2 49.3 54.0 48.9 53.8 48.6 53.5 48.4 53.2 48.2 52.8 48.0 52.4 47.9 51.6Z';

/** Símbolo do logo (M + cometa). Decorativo: o nome acessível vem de quem o usa. */
export function MMark({ className = '' }) {
  const id = `wm${useId().replace(/:/g, '')}`;
  return (
    <svg className={`mmark ${className}`} viewBox="-2 0 68 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="mmark__s1" />
          <stop offset="1" className="mmark__s2" />
        </linearGradient>
        <linearGradient id={`${id}-t`} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" className="mmark__s2" />
          <stop offset="1" className="mmark__s3" />
        </linearGradient>
        <radialGradient id={`${id}-h`}>
          <stop offset="0" className="mmark__s3" stopOpacity=".5" />
          <stop offset="1" className="mmark__s3" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-k`} maskUnits="userSpaceOnUse" x="-2" y="0" width="68" height="64">
          <rect x="-2" y="0" width="68" height="64" fill="#fff" />
          <path d={M_PATH} fill="none" stroke="#000" strokeWidth="8.6" strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <g className="mmark__comet">
        <path d={TAIL} fill={`url(#${id}-t)`} mask={`url(#${id}-k)`} />
      </g>
      <path className="mmark__m" d={M_PATH} pathLength="1" fill="none" stroke={`url(#${id}-m)`} strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
      <g className="mmark__comet">
        <path className="mmark__joint" d={JOINT} />
        <g className="mmark__planet">
          <circle cx="3" cy="31" r="8" fill={`url(#${id}-h)`} />
          <circle className="mmark__head" cx="3" cy="31" r="3.6" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Wordmark "Manpe": símbolo (M + cometa) + "anpe" em texto real na fonte de títulos.
 * Componente único — para trocar o logo depois, altere só este arquivo (e public/favicon.svg).
 */
export default function Wordmark({ name = 'Manpe', size = 'md', draw = false, className = '' }) {
  return (
    <span className={`wordmark wordmark--${size} ${draw ? 'wordmark--draw' : ''} ${className}`} role="img" aria-label={name}>
      <MMark className="wordmark__m" />
      <span className="wordmark__rest" aria-hidden="true">{name.slice(1)}</span>
    </span>
  );
}
