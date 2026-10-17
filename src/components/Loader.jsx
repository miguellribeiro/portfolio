import { useEffect, useState } from 'react';
import { useEffects } from '../engine/effects.js';
import { useI18n } from '../i18n/context.js';

const KEY = 'portfolio.loaded';
const MIN = 420; // tempo mínimo para o traço do monograma
const MAX = 560; // + 140ms de fade = máx. 700ms

function firstVisit() {
  try { return !sessionStorage.getItem(KEY); } catch { return false; }
}

/**
 * Loader inicial: monograma em SVG desenhado com stroke-dashoffset, varredura em
 * gradiente e fade. Só na 1ª visita da sessão; fica sobre o conteúdo já renderizado
 * e sai quando as fontes carregam (document.fonts.ready), em no máx. ~700ms.
 */
export default function Loader({ monogram = 'MR' }) {
  const { loader } = useEffects();
  const { t } = useI18n();
  const [state, setState] = useState(() => (loader && firstVisit() ? 'in' : 'done'));

  useEffect(() => {
    if (state !== 'in') return undefined;
    const root = document.documentElement;
    root.classList.add('is-loading');
    try { sessionStorage.setItem(KEY, '1'); } catch { /* modo privado */ }
    const t0 = performance.now();
    let done = false;
    const leave = () => {
      if (done) return;
      done = true;
      setState('out');
      root.classList.remove('is-loading');
    };
    const cap = setTimeout(leave, MAX);
    (document.fonts?.ready || Promise.resolve()).then(() => {
      setTimeout(leave, Math.max(0, MIN - (performance.now() - t0)));
    });
    return () => { clearTimeout(cap); root.classList.remove('is-loading'); };
  }, [state]);

  useEffect(() => {
    if (state !== 'out') return undefined;
    const id = setTimeout(() => setState('done'), 160);
    return () => clearTimeout(id);
  }, [state]);

  if (state === 'done') return null;
  return (
    <div className={`loader ${state === 'out' ? 'loader--out' : ''}`} role="status" aria-label={t('loader')}>
      <svg className="loader__mark" viewBox="0 0 92 64" aria-hidden="true">
        <defs>
          <linearGradient id="loaderGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--c-primary)" />
            <stop offset="1" stopColor="var(--c-secondary)" />
          </linearGradient>
        </defs>
        <path pathLength="1" d="M8 54V10l18 26 18-26v44" />
        <path pathLength="1" d="M56 54V10h14a12 12 0 0 1 0 24H56m14 0 14 20" />
      </svg>
      <span className="loader__sweep" aria-hidden="true" />
      <span className="sr-only">{monogram}</span>
    </div>
  );
}
