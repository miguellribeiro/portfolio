import { useEffect, useRef, useState } from 'react';
import { BirdArtwork, CapybaraArtwork, MonkeyArtwork, VegetationArtwork } from './Artwork';
import { createForestMotion } from './forestMotion';
import './assets/manpe-tokens.css';
import './forest.css';

export function Forest({ theme }: { theme: 'dark' | 'light' }) {
  const scene = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createForestMotion> | null>(null);
  const [reduced, setReduced] = useState(true);
  const [mobile, setMobile] = useState(true);
  const [paused, setPaused] = useState(false);
  const manualPause = useRef(paused);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const viewport = matchMedia('(max-width: 767px)');
    const update = () => { setReduced(media.matches); setMobile(viewport.matches); };
    update();
    media.addEventListener('change', update);
    viewport.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); viewport.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    const node = scene.current;
    if (!node || reduced || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;
    const motion = createForestMotion(node);
    controller.current = motion;
    motion.setLimit(mobile ? 1 : 2);
    let visible = false;
    const update = () => {
      motion.setActive(visible && document.visibilityState === 'visible' && !manualPause.current);
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: 0 });
    observer.observe(node);
    document.addEventListener('visibilitychange', update);
    node.addEventListener('manpe-pause-change', update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      node.removeEventListener('manpe-pause-change', update);
      motion.dispose();
      controller.current = null;
    };
  }, [reduced, mobile]);

  useEffect(() => {
    manualPause.current = paused;
    scene.current?.dispatchEvent(new Event('manpe-pause-change'));
  }, [paused]);

  return <div className="manpe-scope manpe-forest" data-manpe-theme={theme}>
    <div className="forest-controls wrap">{!reduced && <button className="theme-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Retomar animações' : 'Pausar animações'}</button>}</div>
    <div ref={scene} className="manpe-scene" data-motion="static" aria-hidden="true">
      <svg viewBox="0 0 960 240" preserveAspectRatio="xMidYMax meet" focusable="false" aria-hidden="true" fill="none">
        <g data-actor="vegetation"><VegetationArtwork /></g>
        <g className="manpe-capybara-anchor" transform="translate(96 115) scale(.67)"><g data-actor="capybara"><CapybaraArtwork /></g></g>
        <g className="manpe-monkey-anchor" transform="translate(506.12 56.12) scale(.66)"><g data-actor="monkey"><MonkeyArtwork /></g></g>
        <g className="manpe-bird-anchor" transform="translate(852 32) scale(.5)"><g data-actor="bird"><BirdArtwork /></g></g>
      </svg>
    </div>
  </div>;
}
