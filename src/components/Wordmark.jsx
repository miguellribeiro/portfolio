import { useId } from 'react';

/** Traço do "M" da marca (viewBox 0 0 32 32). Reutilizado no loader e no favicon. */
export const M_PATH = 'M5 26V9.6c0-2 2.5-2.8 3.7-1.2L16 18l7.3-9.6c1.2-1.6 3.7-.8 3.7 1.2V26';

/** Marca "M" isolada (gradiente da paleta). */
export function MMark({ size = 28, className = '', draw = false }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`mmark ${draw ? 'mmark--draw' : ''} ${className}`} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`mg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--c-primary)" />
          <stop offset="1" stopColor="var(--c-secondary)" />
        </linearGradient>
      </defs>
      <path d={M_PATH} pathLength="1" fill="none" stroke={`url(#mg-${id})`} strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Wordmark "Manpe": M desenhado + "anpe" na fonte de títulos + ponto em gradiente.
 * Componente único — para trocar o logo depois, altere só este arquivo (e public/favicon.svg).
 */
export default function Wordmark({ name = 'Manpe', size = 'md', draw = false, className = '' }) {
  return (
    <span className={`wordmark wordmark--${size} ${draw ? 'wordmark--draw' : ''} ${className}`} role="img" aria-label={name}>
      <MMark className="wordmark__m" draw={draw} />
      <span className="wordmark__rest" aria-hidden="true">{name.slice(1)}</span>
      <span className="wordmark__dot" aria-hidden="true" />
    </span>
  );
}
