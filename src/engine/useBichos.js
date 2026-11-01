import { useEffect } from 'react';
import { useEffects } from './effects.js';

/*
 * Fase 4: só inicializa os bichos (chunk separado src/bichos/) depois que o loader termina e a
 * página fica ociosa. Nada carrega com prefers-reduced-motion, Economia de dados (saveData) ou
 * ?bichos=off. QA: ?bichos=debug encurta o intervalo para 3–5s e expõe window.__bichos.force(id).
 */
export default function Bichos() {
  const { bichos, reducedMotion } = useEffects();
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('bichos');
    if (!bichos || reducedMotion || navigator.connection?.saveData || q === 'off') return undefined;
    let alive = true;
    let stop;
    let idle = 0;
    const ric = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
    const cic = window.cancelIdleCallback || clearTimeout;
    const go = () => {
      idle = ric(() => import('../bichos/bichos.js').then((m) => { if (alive) stop = m.start({ debug: q === 'debug' }); }), { timeout: 5000 });
    };
    const afterLoad = () => (document.readyState === 'complete' ? go() : window.addEventListener('load', go, { once: true }));
    const loading = document.documentElement.classList.contains('is-loading');
    if (loading) window.addEventListener('manpe:loader-done', afterLoad, { once: true }); else afterLoad();
    return () => {
      alive = false;
      cic(idle);
      stop?.();
      window.removeEventListener('manpe:loader-done', afterLoad);
      window.removeEventListener('load', go);
    };
  }, [bichos, reducedMotion]);
  return null;
}
