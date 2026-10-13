import { useEffect, useMemo, useState } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { DEFAULT_EFFECTS, EffectsContext, MOTION_EFFECTS } from './effects.js';
import { site } from './content.js';

const loadFeatures = () => import('./motionFeatures.js').then((r) => r.default);
const RM = '(prefers-reduced-motion: reduce)';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.(RM).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(RM);
    if (!mq) return undefined;
    const on = (e) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Observa elementos .reveal (fallback quando não há CSS scroll-driven animations). */
function useRevealFallback(active) {
  useEffect(() => {
    if (!active || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    const scan = () => document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [active]);
}

/** Lê site.json → effects + prefers-reduced-motion e expõe via useEffects(). */
export function EffectsProvider({ children }) {
  const reducedMotion = useReducedMotion();
  const fx = useMemo(() => {
    const cfg = { ...DEFAULT_EFFECTS, ...(site.effects || {}) };
    if (reducedMotion) MOTION_EFFECTS.forEach((k) => { cfg[k] = false; });
    return { ...cfg, reducedMotion };
  }, [reducedMotion]);

  const sda = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fxMesh = String(fx.heroMesh);
    root.dataset.fxGrain = String(fx.grain);
    root.dataset.fxGrid = String(fx.bgGrid);
    root.dataset.fxSpotlight = String(fx.cursorSpotlight);
    root.dataset.fxDividers = fx.dividers;
    root.classList.toggle('fx-reveal', !!fx.scrollReveal);
    root.classList.toggle('fx-sda', !!(fx.scrollReveal && sda));
  }, [fx, sda]);

  useRevealFallback(fx.scrollReveal && !sda);

  useEffect(() => {
    if (!fx.smoothScroll) return undefined;
    let lenis;
    let raf;
    let cancelled = false;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ anchors: { offset: -72 } });
      document.documentElement.classList.add('lenis');
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, [fx.smoothScroll]);

  return (
    <EffectsContext.Provider value={fx}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </EffectsContext.Provider>
  );
}
