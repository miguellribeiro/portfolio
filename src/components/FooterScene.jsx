import { useEffect, useRef, useState } from 'react';
import { GiantWord } from './Decor.jsx';
import sceneUrl from '../assets/footer/scene.svg?url';
import sceneMobileUrl from '../assets/footer/scene-m.svg?url';

/*
 * Cena orgânica do footer (Fase 3; arte do Leonardo em footer-cena.svg). Só decorativa: aria-hidden +
 * pointer-events: none. A altura vem do aspect-ratio no CSS (CLS 0). O SVG (svgo) é externo e só é
 * baixado quando o footer chega perto (abaixo da dobra: nada pesa no 1º carregamento); depois é
 * dividido em camadas inline para a palavra gigante (Fase 2) ficar atrás da grama e para cada grama
 * balançar no próprio compositor (skewX no <svg>, origem na base).
 * Movimento (WCAG 2.2.2): roda ~5s a cada entrada na tela e assenta; fora da tela ou com a aba oculta,
 * nada anima. prefers-reduced-motion: estático (CSS).
 * Fase 4: os bichos entram em .fscene__bichos (entre a grama do meio e a da frente).
 */
const LAYERS = ['fs-fundo', 'fs-gfundo', 'fs-arvores', 'fs-gmeio', 'fs-gfrente'];
const RUN_MS = 5000;
const mobileMq = () => window.matchMedia('(max-width: 680px)');

function Layer({ id, scene }) {
  const html = scene?.layers[id];
  return (
    <svg className={`fscene__l ${id}`} viewBox={scene?.viewBox} preserveAspectRatio="xMidYMax slice" focusable="false"
      dangerouslySetInnerHTML={html ? { __html: html } : undefined} />
  );
}

export default function FooterScene() {
  const ref = useRef(null);
  const [scene, setScene] = useState(null);
  const [want, setWant] = useState(null); // url a carregar (desktop ou mobile), definida quando o footer chega perto

  // 1) Perto da tela → escolhe a variante; troca se cruzar 680px depois.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mq = mobileMq();
    let near = false;
    const pick = () => near && setWant(mq.matches ? sceneMobileUrl : sceneUrl);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near = true; pick(); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(el);
    mq.addEventListener('change', pick);
    return () => { io.disconnect(); mq.removeEventListener('change', pick); };
  }, []);

  // 2) Baixa e divide em camadas.
  useEffect(() => {
    if (!want) return undefined;
    let alive = true;
    fetch(want).then((r) => r.text()).then((txt) => {
      if (!alive) return;
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const layers = {};
      LAYERS.forEach((id) => { layers[id] = doc.getElementById(id)?.innerHTML || ''; });
      setScene({ url: want, viewBox: doc.documentElement.getAttribute('viewBox'), layers });
    }).catch(() => {});
    return () => { alive = false; };
  }, [want]);

  // 3) Balanço: ~5s a cada vez que entra na tela (e só com conteúdo e aba visível).
  useEffect(() => {
    const el = ref.current;
    if (!el || !scene) return undefined;
    let visible = false;
    let timer = 0;
    const stop = () => { clearTimeout(timer); el.classList.remove('is-run'); };
    const start = () => {
      stop();
      if (!visible || document.hidden) return;
      void el.offsetWidth; // reinicia as animações
      el.classList.add('is-run');
      timer = setTimeout(stop, RUN_MS);
    };
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) start(); else if (!visible) stop();
    }, { threshold: 0.25 });
    const onVis = () => (document.hidden ? stop() : start());
    io.observe(el);
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [scene]);

  return (
    <div ref={ref} className={`fscene${scene ? ' is-ready' : ''}`} aria-hidden="true">
      <Layer id="fs-fundo" scene={scene} />
      <Layer id="fs-gfundo" scene={scene} />
      <GiantWord />
      <Layer id="fs-arvores" scene={scene} />
      <Layer id="fs-gmeio" scene={scene} />
      <div className="fscene__bichos" data-slot="bichos" />
      <Layer id="fs-gfrente" scene={scene} />
    </div>
  );
}
