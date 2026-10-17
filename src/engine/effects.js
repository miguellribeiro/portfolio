import { createContext, useContext } from 'react';

/** Valores padrão dos efeitos visuais (sobrescritos por site.json → effects). */
export const DEFAULT_EFFECTS = {
  loader: true,
  heroMesh: true,
  ambientBlobs: true,
  grain: true,
  bgGrid: true,
  headlineReveal: true,
  scrollReveal: true,
  skeleton: true,
  parallax: true,
  magnetic: true,
  cardTilt: false,
  cursorSpotlight: true,
  marquee: true,
  counters: true,
  dividers: 'diagonal',
  smoothScroll: false,
};

/** Efeitos de movimento desligados quando o usuário pede prefers-reduced-motion. */
export const MOTION_EFFECTS = [
  'loader', 'ambientBlobs', 'headlineReveal', 'parallax', 'magnetic', 'cardTilt',
  'marquee', 'counters', 'smoothScroll', 'scrollReveal',
];

export const DIVIDERS = ['diagonal', 'wave', 'none'];

export const EffectsContext = createContext({ ...DEFAULT_EFFECTS, reducedMotion: false });

/** @returns {import('./types.js').Effects & {reducedMotion: boolean}} */
export const useEffects = () => useContext(EffectsContext);
