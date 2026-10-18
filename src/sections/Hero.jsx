import { Fragment, useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';
import { useEffects } from '../engine/effects.js';
import { getChannels } from '../engine/channels.js';
import { ChannelAnchor } from '../components/ChannelLink.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

/**
 * "Texto [[destaque]] texto": cada palavra entra com máscara (stagger curto, ~30ms;
 * o texto está sempre no DOM para SEO). O destaque ganha cor contrastante + brilho sutil.
 */
function Headline({ text }) {
  let n = 0;
  const word = (w, key) => (
    <span key={key} className="word"><span className="word__in" style={{ '--w': n++ }}>{w}</span></span>
  );
  const parts = text.split(/\[\[(.+?)\]\]/);
  const out = [];
  for (let i = 0; i < parts.length; i += 1) {
    let part = parts[i];
    if (i % 2) {
      // pontuação colada ao destaque (ex.: "seguro,") fica junto dele, sem quebrar linha
      const next = parts[i + 1] || '';
      const punct = (next.match(/^[^\s\w\u00C0-\u024F]+/) || [''])[0];
      if (punct) parts[i + 1] = next.slice(punct.length);
      const words = part.split(/\s+/).filter(Boolean);
      const body = words.map((w, j) => <Fragment key={j}>{j > 0 && ' '}{word(w, `w${j}`)}</Fragment>);
      out.push(
        <span key={i} className="hl-wrap">
          <span className="hl" style={{ '--hl': n + words.length }}><span className="hl__text">{body}</span></span>
          {punct && word(punct, 'p')}
        </span>,
      );
      continue;
    }
    part = parts[i];
    const words = part.split(/\s+/).filter(Boolean);
    const lead = /^\s/.test(part) ? ' ' : '';
    const trail = /\s$/.test(part) ? ' ' : '';
    out.push(<Fragment key={i}>{lead}{words.map((w, j) => <Fragment key={j}>{j > 0 && ' '}{word(w, `w${j}`)}</Fragment>)}{trail}</Fragment>);
  }
  return out;
}

export default function Hero({ id }) {
  const { t } = useI18n();
  const fx = useEffects();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const k = fx.parallax ? 1 : 0;
  const yMesh = useTransform(scrollYProgress, [0, 1], [0, 80 * k]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, -40 * k]);
  const magnetic = useMagnetic();
  const wa = getChannels(t).find((c) => c.key === 'whatsapp');

  // Pausa a malha animada quando o hero sai da tela.
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
        {fx.heroMesh && (
          <M.div className="hero__mesh" style={{ y: yMesh }}>
            <span className="blob blob--1" />
            <span className="blob blob--2" />
            <span className="blob blob--3" />
            <span className="blob blob--4" />
          </M.div>
        )}
        {fx.bgGrid && <div className="hero__grid" />}
        {fx.grain && <div className="hero__grain" />}
        <div className="hero__fade" />
      </div>

      <M.div className="container hero__inner" style={{ y: yCopy }}>
        <p className="eyebrow mono hero__eyebrow"><span className="dot" aria-hidden="true" /><span className="hero__who">{t('hero.title')}</span><span aria-hidden="true">·</span>{t('hero.eyebrow')}</p>
        <h1 id={`${id}-title`} className="hero__title">
          <span className="sr-only">{t('hero.title')} — </span>
          <Headline text={t('hero.headline')} />
        </h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <div className="hero__ctas">
          <a className="btn btn--primary btn--lg" href="#projects" {...magnetic}>
            {t('hero.ctaPrimary')} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          {wa ? (
            <ChannelAnchor ch={wa} className="btn btn--ghost btn--lg" {...magnetic}>{t('hero.ctaSecondary')}</ChannelAnchor>
          ) : (
            <a className="btn btn--ghost btn--lg" href="#contact" {...magnetic}>{t('hero.ctaSecondary')}</a>
          )}
        </div>
      </M.div>
      <a className="hero__scroll" href="#highlights" aria-label={t('projects.hint')}><span /></a>
    </section>
  );
}
