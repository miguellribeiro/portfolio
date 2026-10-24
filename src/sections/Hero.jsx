import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';
import { useEffects } from '../engine/effects.js';
import { getChannels } from '../engine/channels.js';
import { ChannelAnchor } from '../components/ChannelLink.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import SolarSystem from '../components/SolarSystem.jsx';
import { MOBILE_HERO_SOLAR } from '../engine/breakpoints.js';

/**
 * "Texto [[destaque]] texto": cada palavra entra com máscara (stagger curto;
 * o texto está sempre no DOM para SEO). O destaque (Instrument Serif itálico +
 * gradiente) NÃO usa overflow:hidden — o overhang do itálico seria clipado.
 */
function Headline({ text }) {
  let n = 0;
  const word = (w, key) => (
    <span key={key} className="word"><span className="word__in" style={{ '--w': n++ }}>{w}</span></span>
  );
  // Letter-spacing em ZWSP expande a content-box (background-clip:text no Chrome
  // só pinta nela; padding CSS não cobre o overhang do Instrument Serif itálico).
  const hlWord = (w, key) => (
    <span key={key} className="hl-word" style={{ '--w': n++ }}>
      <span className="hl-word__gap" aria-hidden="true">{'\u200B'}</span>
      {w}
      <span className="hl-word__gap" aria-hidden="true">{'\u200B'}</span>
    </span>
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
      const body = words.map((w, j) => <Fragment key={j}>{j > 0 && ' '}{hlWord(w, `w${j}`)}</Fragment>);
      out.push(
        <span key={i} className="hl-wrap">
          <span className="hl" style={{ '--hl': n }}>
            <span className="hl__text">{body}</span>
          </span>
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
  const solar = useMediaQuery(MOBILE_HERO_SOLAR);

  // Mobile: mede (só em resize, via offsetTop — sem ler durante o scroll) a faixa
  // livre acima do selo (--band) e o início do parágrafo (--text). O CSS usa as
  // duas para dimensionar o sistema solar dentro da faixa e o véu opaco do texto.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!solar || !el) return undefined;
    const inner = el.querySelector('.hero__inner');
    const top = (n) => (n ? inner.offsetTop + n.offsetTop : 0);
    const measure = () => {
      el.style.setProperty('--band', `${top(inner.querySelector('.hero__eyebrow'))}px`);
      el.style.setProperty('--text', `${top(inner.querySelector('.hero__subtitle'))}px`);
    };
    measure();
    if (!('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(inner);
    return () => { ro.disconnect(); el.style.removeProperty('--band'); el.style.removeProperty('--text'); };
  }, [solar, t]);

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
        {solar && (
          // Mesmo deslocamento de parallax do texto: a geometria sol/planetas × texto não muda no scroll.
          <M.div className="hero__sky" style={{ y: yCopy }}>
            <div className="hero__solar"><SolarSystem /></div>
            <div className="hero__veil" />
          </M.div>
        )}
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
