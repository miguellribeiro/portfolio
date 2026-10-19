import { useEffect, useRef } from 'react';

/**
 * Sistema solar abstrato (decorativo). Só CSS transforms: cada "braço" gira em torno
 * do sol (translação) e o planeta gira no próprio eixo (rotação). Períodos proporcionais
 * a --T (1×, 2×, 3×). Pausa fora da tela; estático com prefers-reduced-motion.
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
          <span className="solar__moonarm"><span className="moon" /></span>
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
