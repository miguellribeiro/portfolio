import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';

/** Divide a lista em `n` linhas contíguas e equilibradas (sem inventar itens). */
function splitRows(items, n) {
  const rows = Array.from({ length: n }, () => []);
  const size = Math.ceil(items.length / n);
  items.forEach((it, i) => rows[Math.min(n - 1, Math.floor(i / size))].push(it));
  return rows.filter((r) => r.length);
}

/** Repetições por cópia para a cópia ser mais larga que a tela (loop sem buraco). */
const reps = (row) => {
  const approx = row.reduce((w, it) => w + it.length * 8.5 + 44, 0);
  return Math.max(1, Math.ceil(720 / approx));
};

/**
 * Faixa infinita de tecnologias (CSS puro; pausa no hover; estática com reduced-motion).
 * Desktop: 1 linha. Mobile (≤ 680px): 3 linhas em sentidos/velocidades alternados,
 * só decorativas (aria-hidden) — a lista acessível é uma só (.marquee__sr).
 */
export default function Marquee({ id }) {
  const { t } = useI18n();
  const { marquee: animate } = useEffects();
  const items = site.marquee?.items || [];
  if (!items.length) return null;
  const list = (hidden) => (
    <ul className="marquee__list" aria-hidden={hidden || undefined}>
      {items.map((it) => <li key={it} className="marquee__item mono">{it}</li>)}
    </ul>
  );
  const rows = splitRows(items, 3);
  return (
    <section id={id} className={`marquee ${animate ? 'marquee--on' : ''}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="marquee__title mono">{t('marquee.title')}</h2>
      <div className="marquee__viewport marquee__viewport--desk">
        <div className="marquee__track">
          {list(false)}
          {animate && list(true)}
        </div>
      </div>
      <ul className="marquee__sr sr-only">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
      <div className="marquee__rows" aria-hidden="true">
        {rows.map((row, r) => {
          const n = animate ? reps(row) : 1;
          const copy = Array.from({ length: n }, () => row).flat();
          return (
            <div key={r} className={`marquee__row marquee__row--${r + 1}`}>
              <div className="marquee__rtrack">
                {(animate ? [0, 1] : [0]).map((c) => (
                  <ul key={c} className="marquee__rlist">
                    {copy.map((it, i) => <li key={`${it}-${i}`} className="marquee__item mono">{it}</li>)}
                  </ul>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
