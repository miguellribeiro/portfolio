import { useEffect, useRef, useState } from 'react';

const DURATION = 1400;
const ease = (x) => 1 - (1 - x) ** 3;

/** Contador que anima ao entrar na tela; usa o separador decimal do idioma (99,9 / 99.9). */
export default function Counter({ stat, animate, locale, className = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(animate ? 0 : stat.value);
  const fmt = new Intl.NumberFormat(locale, {
    minimumFractionDigits: stat.decimals || 0,
    maximumFractionDigits: stat.decimals || 0,
  });

  useEffect(() => {
    if (!animate || !('IntersectionObserver' in window)) { setVal(stat.value); return undefined; }
    const el = ref.current;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / DURATION));
        setVal(stat.value * ease(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [animate, stat.value]);

  const final = `${stat.prefix || ''}${fmt.format(stat.value)}${stat.suffix || ''}`;
  return (
    // largura reservada pelo valor final (sem CLS); leitores de tela recebem o valor final
    <span ref={ref} className={`counter mono ${className}`} style={{ minWidth: `${final.length}ch` }} >
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">{stat.prefix}{fmt.format(Math.max(0, val))}<span className="counter__suffix">{stat.suffix}</span></span>
    </span>
  );
}
