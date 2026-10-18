import { useEffect, useState } from 'react';
import { useEffects } from '../engine/effects.js';
import { useI18n } from '../i18n/context.js';
import Wordmark from './Wordmark.jsx';

const KEY = 'portfolio.loaded';
const MIN = 420; // tempo mínimo para o traço do "M"
const MAX = 560; // + 140ms de fade = máx. 700ms

function firstVisit() {
  try { return !sessionStorage.getItem(KEY); } catch { return false; }
}

/**
 * Loader inicial: o "M" do wordmark é desenhado (stroke-dashoffset), o resto da
 * marca revela por máscara, varredura em gradiente e fade. Só na 1ª visita da sessão;
 * sobre o conteúdo já renderizado; sai em document.fonts.ready (máx. ~700ms).
 */
export default function Loader({ name = 'Manpe' }) {
  const { loader } = useEffects();
  const { t } = useI18n();
  const [state, setState] = useState(() => (loader && firstVisit() ? 'in' : 'done'));

  useEffect(() => {
    if (state !== 'in') return undefined;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* modo privado */ }
    const t0 = performance.now();
    let done = false;
    const leave = () => { if (!done) { done = true; setState('out'); } };
    const cap = setTimeout(leave, MAX);
    (document.fonts?.ready || Promise.resolve()).then(() => {
      setTimeout(leave, Math.max(0, MIN - (performance.now() - t0)));
    });
    return () => clearTimeout(cap);
  }, [state]);

  useEffect(() => {
    if (state !== 'out') return undefined;
    const id = setTimeout(() => setState('done'), 160);
    return () => clearTimeout(id);
  }, [state]);

  if (state === 'done') return null;
  return (
    <div className={`loader ${state === 'out' ? 'loader--out' : ''}`} role="status" aria-label={t('loader')}>
      <Wordmark name={name} size="xl" draw />
      <span className="loader__sweep" aria-hidden="true" />
    </div>
  );
}
