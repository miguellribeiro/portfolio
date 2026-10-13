import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';

/** Faixa infinita de tecnologias (CSS puro; pausa no hover; estática com reduced-motion). */
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
  return (
    <section id={id} className={`marquee ${animate ? 'marquee--on' : ''}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="marquee__title mono">{t('marquee.title')}</h2>
      <div className="marquee__viewport">
        <div className="marquee__track">
          {list(false)}
          {animate && list(true)}
        </div>
      </div>
    </section>
  );
}
