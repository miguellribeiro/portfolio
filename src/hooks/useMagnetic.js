import { useCallback } from 'react';
import { useEffects } from '../engine/effects.js';

const MAX = 7; // px

/** Efeito magnético sutil (máx. 4px) via CSS `translate` (--mx/--my). */
export function useMagnetic() {
  const { magnetic } = useEffects();
  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAX;
    el.style.setProperty('--mx', `${dx.toFixed(1)}px`);
    el.style.setProperty('--my', `${dy.toFixed(1)}px`);
  }, []);
  const onPointerLeave = useCallback((e) => {
    e.currentTarget.style.setProperty('--mx', '0px');
    e.currentTarget.style.setProperty('--my', '0px');
  }, []);
  return magnetic ? { onPointerMove, onPointerLeave, 'data-magnetic': '' } : {};
}
