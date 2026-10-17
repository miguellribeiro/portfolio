import { Fragment, useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';
import { useEffects } from '../engine/effects.js';
import DashboardMockup from '../components/DashboardMockup.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

/**
 * "Texto [[destaque]] texto": cada palavra entra com máscara (stagger ~40ms);
 * o destaque usa a fonte display itálica + gradiente e ganha um sublinhado que cresce.
 */
function Headline({ text }) {
  let n = 0;
  const word = (w, key) => (
    <span key={key} className="word"><span className="word__in" style={{ '--w': n++ }}>{w}</span></span>
  );
  return text.split(/\[\[(.+?)\]\]/).map((part, i) => {
    const words = part.split(/\s+/).filter(Boolean);
    const lead = /^\s/.test(part) ? ' ' : '';
    const trail = /\s$/.test(part) ? ' ' : '';
    const body = words.map((w, j) => <Fragment key={j}>{j > 0 && ' '}{word(w, `w${j}`)}</Fragment>);
    if (i % 2) {
      return (
        <span key={i} className="hl" style={{ '--hl': n + words.length }}>
          <span className="hl__text">{body}</span>
        </span>
      );
    }
    return <Fragment key={i}>{lead}{body}{trail}</Fragment>;
  });
}

export default function Hero({ id }) {
  const { t } = useI18n();
  const fx = useEffects();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const k = fx.parallax ? 1 : 0;
  const yBlobs = useTransform(scrollYProgress, [0, 1], [0, 60 * k]);
  const yMock = useTransform(scrollYProgress, [0, 1], [0, -40 * k]);
  const yCardA = useTransform(scrollYProgress, [0, 1], [0, -60 * k]);
  const yCardB = useTransform(scrollYProgress, [0, 1], [0, 30 * k]);
  const mk = t('hero.mockup');
  const magnetic = useMagnetic();

  // Pausa os blobs ambientes quando o hero sai da tela.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-offscreen', !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className="hero" aria-labelledby={`${id}-title`}>
      <div className="hero__bg" aria-hidden="true">
        {fx.bgGrid && <div className="hero__grid" />}
        {fx.heroMesh && (
          <M.div className="hero__mesh" style={{ y: yBlobs }}>
            <span className="blob blob--1" />
            <span className="blob blob--2" />
            <span className="blob blob--3" />
          </M.div>
        )}
        {fx.grain && <div className="hero__grain" />}
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow mono"><span className="dot" aria-hidden="true" />{t('hero.title')} · {t('hero.eyebrow')}</p>
          <h1 id={`${id}-title`}><Headline text={t('hero.headline')} /></h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#projects" {...magnetic}>{t('hero.ctaPrimary')} <span className="btn__arrow" aria-hidden="true">→</span></a>
            <a className="btn btn--ghost" href="#contact">{t('hero.ctaSecondary')}</a>
          </div>
        </div>

        <div className="hero__visual" role="img" aria-label={mk.title}>
          <M.div className="hero__mock" style={{ y: yMock }}>
            <DashboardMockup text={mk} />
          </M.div>
          <M.div className="float-card float-card--a" style={{ y: yCardA }} aria-hidden="true">
            <span className="float-card__icon">↗</span>
            <span>
              <span className="float-card__label">{mk.revenue}</span>
              <strong className="mono">{mk.revenueValue}</strong>
            </span>
          </M.div>
          <M.div className="float-card float-card--b" style={{ y: yCardB }} aria-hidden="true">
            <span className="float-card__icon float-card__icon--accent">✓</span>
            <span>
              <span className="float-card__label">{mk.tiss}</span>
              <strong className="mono">{mk.tissValue}</strong>
            </span>
          </M.div>
        </div>
      </div>
    </section>
  );
}
