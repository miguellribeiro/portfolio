import { useEffect, useRef } from 'react';
import { DECOR } from '../data/keywords.js';
import { useEffects } from '../engine/effects.js';

/*
 * Tipografia espacial decorativa (Fase 2). Tudo aria-hidden + pointer-events: none, posicionado
 * em absoluto (ou em espaço já reservado): nada empurra o conteúdo (CLS 0). Só transform/opacity;
 * parallax por CSS scroll-driven (@supports), estático sem suporte e com prefers-reduced-motion.
 * Fontes: JetBrains Mono 400 e Bricolage 700, já com preload.
 */

/** Texto vertical na margem lateral (só desktop largo, via CSS). */
export function MarginText() {
  const { decor } = useEffects();
  if (!decor) return null;
  return <span className="decor decor-vtext mono" aria-hidden="true">{DECOR.margin.join(' · ')}</span>;
}

/** Palavra gigante vazada, cortada pela borda inferior da seção (espaço reservado no CSS). */
export function GiantWord({ word = DECOR.giant }) {
  const { decor } = useEffects();
  if (!decor) return null;
  return <span className="decor decor-giant" aria-hidden="true">{word}</span>;
}

/**
 * Texto em curva que É o divisor: fica sobre a onda superior da seção alternada seguinte
 * (mesma curva/escala da máscara: viewBox 1440×128, largura 100%). Wrapper de altura 0.
 */
export const WAVE_TOP = 'M0 78 C240 18 480 128 720 74 S1200 14 1440 78';
export function CurveText() {
  const { decor } = useEffects();
  if (!decor) return null;
  return (
    <div className="decor-curve" aria-hidden="true">
      <svg viewBox="0 0 1440 128" focusable="false">
        <path id="decor-wave" d={WAVE_TOP} fill="none" />
        <text className="decor-curve__text" dy="-12">
          <textPath href="#decor-wave" startOffset="3%">{DECOR.curve.join(' · ')}</textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Tags flutuantes: derivam devagar só quando entram na tela e PARAM sozinhas em < 5s
 * (WCAG 2.2.2); parallax leve pelo scroll (CSS). Posições por seção no CSS (.decor-tags--<k>).
 */
export function FloatTags({ k }) {
  const { decor } = useEffects();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-on'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [decor]);
  if (!decor) return null;
  return (
    <div ref={ref} className={`decor decor-tags decor-tags--${k}`} aria-hidden="true">
      {DECOR.tags[k].map((w, i) => (
        <span key={w} className="decor-tag" style={{ '--i': i }}><span className="decor-tag__in mono">{w}</span></span>
      ))}
    </div>
  );
}
