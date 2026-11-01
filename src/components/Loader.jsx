import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useEffects } from '../engine/effects.js';

/*
 * Loader "Desenho vivo" (conceito 3 do Leonardo — /loader-boards/anim.py, c3).
 * 1. o traço do símbolo é desenhado (stroke-dashoffset 1→0): traço-m, centro, orelhas, mandíbula;
 * 2. a mandíbula "cai" 9u com um pulinho; 3. os olhos dourados nascem e piscam;
 * 4. o macaco encolhe e voa em ARCO até o símbolo do header (FLIP: getBoundingClientRect de
 *    .header .wordmark__mark; só transform/opacity), enquanto o site aparece por baixo.
 * Overlay aria-hidden sobre o site já renderizado ("Manpe" é anunciado só pelo link do header).
 * Sai quando load + document.fonts.ready + decode() das imagens da 1ª dobra terminam,
 * com mínimo = a própria animação (~1,49s) e teto de segurança de 4s. Só na 1ª visita da sessão.
 * prefers-reduced-motion: sem desenho nem voo, só um fade de ~200ms.
 * Só Web Animations API nativa; tudo é cancelado/removido ao desmontar.
 */

const KEY = 'portfolio.loaded';
/** Escala única do tempo: os tempos abaixo são os do protótipo (s); ×0,62 = ritmo atual. */
export const TIME_SCALE = 0.62;
const s = (sec) => sec * 1000 * TIME_SCALE; // protótipo (s) → ms reais

const T = {
  draw: { start: 0, step: 0.08, dur: 0.66 }, // 4 traços, ease-in-out, terminam em 0,9
  jaw: [0.9, 1.2],
  eyes: [1.05, 1.3],
  blink: [1.4, 1.55],
  fly: [1.7, 2.4],
  site: [1.75, 2.3],
};
const CAP = 4000; // teto de segurança (ms reais), voo incluso
const RM_FADE = 200;
const POP = 'cubic-bezier(.34, 1.8, .64, 1)';
const STROKES = [
  ['traco-m', 'M21 72 V48 A14.5 14.5 0 0 1 50 48 A14.5 14.5 0 0 1 79 48 V72'],
  ['traco-centro', 'M50 48 V63'],
  ['orelhas', 'M21 41 A11 11 0 1 0 21 63 M79 41 A11 11 0 1 1 79 63'],
];
const JAW = 'M30 83 Q50 91 70 83';
const VB_W = 92;
const VB_H = 72;

function firstVisit() {
  try { return !sessionStorage.getItem(KEY); } catch { return false; }
}

/** load + fontes + decode das imagens visíveis na 1ª dobra. Devolve [promise, cleanup]. */
function pageReady() {
  let off = () => {};
  const load = document.readyState === 'complete' ? Promise.resolve() : new Promise((ok) => {
    const on = () => ok();
    window.addEventListener('load', on, { once: true });
    off = () => window.removeEventListener('load', on);
  });
  const fonts = document.fonts?.ready || Promise.resolve();
  const imgs = [...document.images].filter((img) => {
    const r = img.getBoundingClientRect();
    return r.width > 0 && r.top < innerHeight && r.bottom > 0;
  }).map((img) => img.decode?.().catch(() => {}));
  return [Promise.all([load, fonts, ...imgs]), () => off()];
}

const eio = (x) => x * x * (3 - 2 * x);

/** Keyframes do voo: arco (Bézier quadrática, como no protótipo) do centro da tela ao símbolo do header. */
function flightKeyframes(box, target) {
  const sx = innerWidth / 2;
  const sy = innerHeight / 2;
  const ex = target.left + target.width / 2;
  const ey = target.top + target.height / 2;
  // Ponto de controle proporcional ao do protótipo: (400,250)→(44,32) com controle em (300,60).
  const cx = sx + (ex - sx) * 0.28;
  const cy = sy + (ey - sy) * 0.87;
  const kx = target.width / box.w;
  const ky = target.height / box.h;
  const N = 24;
  const frames = [];
  for (let i = 0; i <= N; i += 1) {
    const p = eio(i / N);
    const q = 1 - p;
    const x = q * q * sx + 2 * q * p * cx + p * p * ex;
    const y = q * q * sy + 2 * q * p * cy + p * p * ey;
    const scx = 1 + (kx - 1) * p;
    const scy = 1 + (ky - 1) * p;
    frames.push({ offset: i / N, transform: `translate(${x - (box.w * scx) / 2}px, ${y - (box.h * scy) / 2}px) scale(${scx}, ${scy})` });
  }
  // Último quadro exato = retângulo do símbolo do header (FLIP).
  frames[N].transform = `translate(${target.left}px, ${target.top}px) scale(${kx}, ${ky})`;
  return frames;
}

function Monkey({ gid, palette }) {
  return (
    <g className={`loader__monkey loader__monkey--${palette}`}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="10" y1="30" x2="90" y2="92">
          <stop offset="0" className="loader__s1" />
          <stop offset="1" className="loader__s2" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map(([part, d]) => <path key={part} data-part={part} className="loader__stroke" d={d} pathLength="1" />)}
        <path data-part="mandibula" className="loader__stroke loader__jaw" d={JAW} pathLength="1" />
      </g>
      <g className="loader__eye"><rect data-part="olho-esq" x="32.1" y="54.6" width="6.8" height="6.8" rx="1.5" /></g>
      <g className="loader__eye"><rect data-part="olho-dir" x="61.1" y="54.6" width="6.8" height="6.8" rx="1.5" /></g>
    </g>
  );
}

export default function Loader() {
  const { loader, reducedMotion } = useEffects();
  const [on, setOn] = useState(() => loader && firstVisit());
  const root = useRef(null);
  const flier = useRef(null);
  const uid = useId().replace(/:/g, '');
  // Overlay é sempre #1A0B14 (paleta dark); no tema claro uma cópia na paleta do tema entra no voo
  // para pousar idêntica ao símbolo do header.
  const [themed] = useState(() => document.documentElement.dataset.theme === 'light');
  const [size] = useState(() => {
    const w = Math.round(Math.min(220, Math.max(120, Math.min(innerWidth * 0.42, innerHeight * 0.3))));
    return { w, h: (w * VB_H) / VB_W };
  });

  // Esconde o símbolo do header antes da 1ª pintura: o macaco do loader é quem pousa nele.
  useLayoutEffect(() => {
    if (!on || reducedMotion) return undefined;
    const html = document.documentElement;
    html.classList.add('is-loading');
    return () => html.classList.remove('is-loading');
  }, [on, reducedMotion]);

  useEffect(() => {
    if (!on) return undefined;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* modo privado */ }
    const el = root.current;
    const t0 = performance.now();
    const anims = [];
    const timers = [];
    let alive = true;
    const finish = () => { if (alive) { document.documentElement.classList.remove('is-loading'); setOn(false); } };
    const [ready, offReady] = pageReady();

    if (reducedMotion) {
      const fade = () => {
        if (!alive) return;
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: RM_FADE, easing: 'ease', fill: 'forwards' });
        anims.push(a);
        a.onfinish = finish;
      };
      const cap = setTimeout(fade, CAP - RM_FADE);
      timers.push(cap);
      ready.then(() => { clearTimeout(cap); fade(); });
    } else {
      const parts = (p) => el.querySelectorAll(`[data-part="${p}"]`);
      const run = (nodes, kf, opt) => nodes.forEach((n) => anims.push(n.animate(kf, { fill: 'both', ...opt })));
      // 1. traço
      ['traco-m', 'traco-centro', 'orelhas', 'mandibula'].forEach((p, i) => run(parts(p),
        [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        { delay: s(T.draw.start + i * T.draw.step), duration: s(T.draw.dur), easing: 'ease-in-out' }));
      // 2. mandíbula cai 9u e volta
      run(el.querySelectorAll('.loader__jaw'), [
        { transform: 'translateY(0)', easing: POP },
        { transform: 'translateY(9px)', offset: 0.55, easing: 'ease-in-out' },
        { transform: 'translateY(0)' },
      ], { delay: s(T.jaw[0]), duration: s(T.jaw[1] - T.jaw[0]) });
      // 3. olhos nascem (mesma curva) e piscam uma vez
      run(el.querySelectorAll('.loader__eye'), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        { delay: s(T.eyes[0]), duration: s(T.eyes[1] - T.eyes[0]), easing: POP });
      run(el.querySelectorAll('.loader__eye rect'), [
        { transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' },
      ], { delay: s(T.blink[0]), duration: s(T.blink[1] - T.blink[0]), easing: 'ease-in-out' });

      // 4. voo: espera o site estar pronto (mín. = fim da piscada + pausa; teto = CAP)
      const flyDur = s(T.fly[1] - T.fly[0]);
      let flying = false;
      const fly = () => {
        if (!alive || flying) return;
        flying = true;
        const mark = document.querySelector('.header .wordmark__mark');
        const box = flier.current;
        if (!mark || !box) { finish(); return; }
        const r = mark.getBoundingClientRect();
        const a = box.animate(flightKeyframes(size, r), { duration: flyDur, easing: 'linear', fill: 'forwards' });
        anims.push(a);
        const siteDelay = s(T.site[0] - T.fly[0]);
        anims.push(el.querySelector('.loader__bg').animate([{ opacity: 1 }, { opacity: 0 }],
          { delay: siteDelay, duration: s(T.site[1] - T.site[0]), easing: 'ease-in-out', fill: 'both' }));
        if (themed) {
          // Tema claro: cruza para a paleta do tema durante o voo (pousa igual ao símbolo do header).
          const x = { delay: siteDelay, duration: flyDur - siteDelay, easing: 'ease-in-out', fill: 'both' };
          anims.push(el.querySelector('.loader__monkey--theme').animate([{ opacity: 0 }, { opacity: 1 }], x));
          anims.push(el.querySelector('.loader__monkey--dark').animate([{ opacity: 1 }, { opacity: 0 }], x));
        }
        a.onfinish = finish;
      };
      const minFly = s(T.fly[0]);
      const cap = setTimeout(fly, CAP - flyDur);
      timers.push(cap);
      ready.then(() => {
        if (!alive) return;
        timers.push(setTimeout(() => { clearTimeout(cap); fly(); }, Math.max(0, minFly - (performance.now() - t0))));
      });
    }

    return () => {
      alive = false;
      offReady();
      timers.forEach(clearTimeout);
      anims.forEach((a) => { a.onfinish = null; a.cancel(); });
    };
  }, [on, reducedMotion, size, themed]);

  if (!on) return null;
  const style = { width: size.w, height: size.h, transform: `translate(${(innerWidth - size.w) / 2}px, ${(innerHeight - size.h) / 2}px)` };
  return (
    <div ref={root} className={`loader ${reducedMotion ? 'loader--static' : ''}`} aria-hidden="true">
      <div className="loader__bg" />
      <svg ref={flier} className="loader__flier" style={style} viewBox="4 25 92 72" focusable="false">
        <Monkey gid={`${uid}d`} palette="dark" />
        {themed && <Monkey gid={`${uid}t`} palette="theme" />}
      </svg>
    </div>
  );
}
