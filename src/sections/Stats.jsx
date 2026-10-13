import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';

const DURATION = 1400;
const ease = (x) => 1 - (1 - x) ** 3;

function Counter({ stat, animate, locale }) {
  const ref = useRef(null);
  const [val, setVal] = useState(animate ? 0 : stat.value);
  const fmt = new Intl.NumberFormat(locale, {
    minimumFractionDigits: stat.decimals || 0,
    maximumFractionDigits: stat.decimals || 0,
  });

  useEffect(() => {
    if (!animate) { setVal(stat.value); return undefined; }
    const el = ref.current;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / DURATION));
        setVal(stat.value * ease(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [animate, stat.value]);

  const final = `${stat.prefix || ''}${fmt.format(stat.value)}${stat.suffix || ''}`;
  return (
    // largura reservada pelo valor final (sem CLS); leitores de tela recebem o valor final
    <span ref={ref} className="stat__value mono" style={{ minWidth: `${final.length}ch` }} aria-label={final}>
      <span aria-hidden="true">{stat.prefix}{fmt.format(val)}{stat.suffix}</span>
    </span>
  );
}

export default function Stats({ id }) {
  const { t, locale } = useI18n();
  const fx = useEffects();
  const stats = site.stats || [];
  if (!stats.length) return null;
  return (
    <section id={id} className="stats" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="stats__panel reveal">
          <h2 id={`${id}-title`} className="sr-only">{t('stats.title')}</h2>
          <dl className="stats__grid">
            {stats.map((s, i) => (
              <div key={s.id} className="stat reveal" style={{ '--i': i }}>
                <dt className="stat__label">{t(`stats.items.${s.id}`)}</dt>
                <dd><Counter stat={s} animate={fx.counters} locale={locale} /></dd>
              </div>
            ))}
          </dl>
          {stats.some((s) => s.example) && <p className="stats__note mono">* {t('stats.note')}</p>}
        </div>
      </div>
    </section>
  );
}
