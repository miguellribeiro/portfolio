import { useCallback } from 'react';
import { useEffects } from '../engine/effects.js';

const MAX_TILT = 6;

/**
 * Spotlight do cursor (--x/--y) e tilt opcional (--rx/--ry, máx. 6deg).
 * Só escreve CSS variables: a animação fica em transform/opacity no CSS.
 */
export function useCardFx() {
  const { cursorSpotlight, cardTilt } = useEffects();
  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    if (cursorSpotlight) {
      el.style.setProperty('--x', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--y', `${(py * 100).toFixed(1)}%`);
    }
    if (cardTilt) {
      el.style.setProperty('--rx', `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    }
  }, [cursorSpotlight, cardTilt]);
  const onPointerLeave = useCallback((e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);
  if (!cursorSpotlight && !cardTilt) return { className: '' };
  return {
    className: `${cursorSpotlight ? 'spot' : ''} ${cardTilt ? 'tilt' : ''}`,
    onPointerMove,
    onPointerLeave,
  };
}
