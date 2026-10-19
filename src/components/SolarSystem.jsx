import { useEffect, useRef } from 'react';

/**
 * Sistema solar abstrato (decorativo). Só órbita (translação): o braço gira em
 * torno do sol; o corpo contra-gira no mesmo período para a orientação do planeta
 * (anel, mancha) ficar estável — sem rotação axial. Períodos 1× / 2× / 3×.
 * Única exceção com movimento próprio: a lua circula o planeta 2 (T/2, sempre em pé).
 * Pausa fora da tela; estático com prefers-reduced-motion.
 */
export default function SolarSystem() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-paused', !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="solar" aria-hidden="true">
      <span className="solar__orbit solar__orbit--1" />
      <span className="solar__orbit solar__orbit--2" />
      <span className="solar__orbit solar__orbit--3" />
      <span className="solar__sun" />

      <span className="solar__arm solar__arm--1">
        <span className="solar__body">
          <span className="planet planet--1"><span className="planet__spot" /></span>
        </span>
      </span>

      <span className="solar__arm solar__arm--2">
        <span className="solar__body">
          <span className="planet planet--2"><span className="planet__band" /><span className="planet__spot" /></span>
          <span className="moon-orbit"><span className="moon" /></span>
        </span>
      </span>

      <span className="solar__arm solar__arm--3">
        <span className="solar__body">
          <span className="planet planet--3"><span className="planet__ring" /><span className="planet__spot" /></span>
        </span>
      </span>
    </div>
  );
}
