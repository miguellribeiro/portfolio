import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { MonkeyArtwork } from './Artwork';
import './intro.css';

type Phase = 'loading' | 'transition' | 'header' | 'error';

/** Decorative intro: the page remains readable and interactive throughout. */
export function BrandIntro({ logo, statusTarget, theme }: { logo: RefObject<HTMLImageElement>; statusTarget: RefObject<HTMLDivElement>; theme: 'dark' | 'light' }) {
  const slot = useRef<HTMLSpanElement>(null);
  const mascot = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [showStatus, setShowStatus] = useState(false);
  const continueWithFallback = useRef<() => void>(() => {});

  useEffect(() => {
    const node = mascot.current!;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let settled = false;
    let floating = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const animations = new Set<Animation>();
    const later = (callback: () => void, delay: number) => {
      const id = setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
      timers.add(id);
    };
    const stop = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const park = (immediate = false) => {
      stop();
      node.style.transition = immediate || media.matches ? 'none' : 'transform 420ms cubic-bezier(.22,1,.36,1)';
      node.style.transform = 'none';
      floating = false;
    };
    const finish = (error = false) => {
      if (disposed || settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      timers.clear();
      const travelling = floating && !media.matches;
      park();
      setPhase(error ? 'error' : travelling ? 'transition' : 'header');
      setShowStatus(error);
      if (travelling && !error) later(() => setPhase('header'), 420);
    };
    continueWithFallback.current = () => { finish(); setPhase('header'); setShowStatus(false); };
    setPhase('loading');
    setShowStatus(false);
    later(() => {
      if (settled) return;
      setShowStatus(true);
      if (media.matches || !slot.current || !('animate' in Element.prototype)) return;
      const bounds = slot.current.getBoundingClientRect();
      const x = innerWidth / 2 - (bounds.left + bounds.width / 2);
      const y = Math.min(innerHeight * .32, 240) - (bounds.top + bounds.height / 2);
      floating = true;
      node.style.transition = 'transform 220ms cubic-bezier(.22,1,.36,1)';
      node.style.transform = `translate(${x}px, ${y}px) scale(3)`;
      for (const [part, transforms] of [
        ['head', ['rotate(0deg)', 'rotate(6deg)', 'rotate(0deg)']],
        ['eyes', ['scaleY(1)', 'scaleY(.15)', 'scaleY(1)']],
      ] as const) {
        const element = node.querySelector(`[data-part=${part}]`)!;
        const animation = element.animate(transforms.map(transform => ({ transform })), { duration: 220 });
        animations.add(animation);
      }
    }, 150);
    later(() => park(), 1500);
    later(() => finish(true), 8000);
    const onResize = () => park(true);
    const onPreference = () => { if (media.matches) park(true); };
    window.addEventListener('resize', onResize);
    media.addEventListener('change', onPreference);

    const fonts = ['600 16px "Bricolage Grotesque"', '700 16px "Bricolage Grotesque"', '400 16px Inter', '500 16px Inter', 'italic 400 16px "Instrument Serif"'];
    const resources = [
      ...fonts.map(font => document.fonts.load(font)),
      document.fonts.ready,
      logo.current ? logo.current.decode() : Promise.reject(new Error('Logo indisponível')),
    ];
    void Promise.all(resources).then(() => finish(), () => finish(true));
    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      stop();
      park(true);
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onPreference);
    };
  }, [logo]);

  return <><div className="brand-intro manpe-scope" data-manpe-theme={theme} data-phase={phase}>
    <span ref={slot} className="brand-mascot" aria-hidden="true"><svg ref={mascot} viewBox="0 0 200 200" focusable="false" aria-hidden="true"><MonkeyArtwork /></svg></span>
  </div>
    {showStatus && statusTarget.current && createPortal(<div className="load-status">
      {phase === 'error' ? <><p role="alert">Alguns recursos não carregaram. Você pode usar a página e tentar novamente.</p><div className="actions"><button className="theme-toggle" onClick={() => window.location.reload()}>Tentar novamente</button><button className="theme-toggle" onClick={() => continueWithFallback.current()}>Continuar com fontes alternativas</button></div></> : <p role="status">Carregando fontes e identidade visual… O conteúdo já está disponível.</p>}
    </div>, statusTarget.current)}
  </>;
}
