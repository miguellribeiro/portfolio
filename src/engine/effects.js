import { createContext, useContext } from 'react';

/** Valores padrão dos efeitos visuais (sobrescritos por site.json → effects). */
export const DEFAULT_EFFECTS = {
  heroMesh: true,
  grain: true,
  bgGrid: true,
  scrollReveal: true,
  parallax: true,
  cardTilt: false,
  cursorSpotlight: true,
  marquee: true,
  counters: true,
  dividers: 'diagonal',
  smoothScroll: false,
};

/** Efeitos de movimento desligados quando o usuário pede prefers-reduced-motion. */
export const MOTION_EFFECTS = ['parallax', 'cardTilt', 'marquee', 'counters', 'smoothScroll', 'scrollReveal'];

export const DIVIDERS = ['diagonal', 'wave', 'none'];

export const EffectsContext = createContext({ ...DEFAULT_EFFECTS, reducedMotion: false });

/** @returns {import('./types.js').Effects & {reducedMotion: boolean}} */
export const useEffects = () => useContext(EffectsContext);
