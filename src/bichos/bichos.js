import { ART } from './art.js';
import './bichos.css';

/*
 * Fase 4 — bichos esporádicos (chunk separado, carregado depois do loader com a página ociosa).
 * Um bicho por vez, a cada 20–60s (debug: 3–5s), nunca a mesma espécie duas vezes seguidas.
 * Cada aparição dura ≤ 4,4s (+0,25s de garantia) (WCAG 2.2.2) e termina fora da tela / escondida na grama.
 * Trajeto: WAAPI (transform/opacity, cancelável); pernas/asa/cauda: keyframes CSS nos grupos,
 * que só existem enquanto o bicho está no DOM. Entre aparições não sobra nenhuma animação.
 * Lugares: footer (.fscene__bichos, só com o footer visível) e fundo da página em áreas vazias
 * conferidas na hora contra o texto real (faixa sem texto antes de uma seção alternada; borda do hero).
 */
const DUR = 4400; // + garantia de 250ms por timer: nenhuma aparição passa de ~4,65s (WCAG 2.2.2: < 5s)
const HEADER = 65;
const rnd = (a, b) => a + Math.random() * (b - a);
const fr = (offset, x, y, rot = 0, op = 1) => ({ offset, transform: `translate(${x}px,${y}px) rotate(${rot}deg)`, opacity: op });

function make(kind, k, cls = '') {
  const { vb, a, svg } = ART[kind];
  const el = document.createElement('div');
  el.className = `bicho bicho--${kind} ${cls}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="bicho__flip"><div class="bicho__pose"><svg viewBox="${vb.join(' ')}" width="${vb[2] * k}" height="${vb[3] * k}" style="left:${(vb[0] - a[0]) * k}px;top:${(vb[1] - a[1]) * k}px" focusable="false">${svg}</svg></div></div>`;
  return el;
}

/** Põe o bicho no host e anima; devolve { cancel }. onEnd(cancelado) é chamado uma vez. */
function play(host, el, frames, { dur = DUR, flip, pose, phases = [], removeHost = false } = {}, onEnd) {
  host.append(el);
  const anims = [el.animate(frames, { duration: dur, fill: 'both' })];
  if (flip) anims.push(el.firstChild.animate(flip, { duration: dur, fill: 'both' }));
  if (pose) anims.push(el.firstChild.firstChild.animate(pose, { duration: dur, fill: 'both' }));
  const timers = phases.map(([t, fn]) => setTimeout(() => fn(el), t * dur));
  let done = false;
  const end = (cancelled = false) => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    anims.forEach((x) => x.cancel());
    el.remove();
    if (removeHost) host.remove();
    onEnd(cancelled);
  };
  anims[0].finished.then(() => end(), () => {});
  timers.push(setTimeout(() => end(), dur + 250)); // garantia (mesmo com frames atrasados)
  return { cancel: () => end(true) };
}

/* ---------- área livre: nenhum texto/controle real dentro do retângulo ---------- */
const SKIP = '.decor, .decor-curve, .fscene, .bicho, .bichos-host';
function obstacles(roots) {
  const out = [];
  roots.filter(Boolean).forEach((root) => {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim() || n.parentElement.closest(SKIP)) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      out.push(...r.getClientRects());
    }
    root.querySelectorAll('a, button, img, input, .deck, .decor-tag__in').forEach((e) => { if (!e.closest('.fscene, .bicho')) out.push(e.getBoundingClientRect()); });
  });
  return out.filter((r) => r.width > 0 && r.height > 0);
}
const hit = (a, b, m = 8) => a.left - m < b.right && a.right + m > b.left && a.top - m < b.bottom && a.bottom + m > b.top;
const onScreen = (r) => r.top >= HEADER && r.bottom <= innerHeight;
const isFree = (rect, roots) => !obstacles(roots).some((o) => hit(rect, o));

/* ---------- footer ---------- */
function footerGeo() {
  const scene = document.querySelector('.fscene.is-ready');
  const slot = scene?.querySelector('.fscene__bichos');
  const vb = scene?.querySelector('svg.fscene__l')?.viewBox.baseVal;
  if (!slot || !vb?.width) return null;
  const r = slot.getBoundingClientRect();
  const vis = (Math.min(r.bottom, innerHeight) - Math.max(r.top, HEADER)) / r.height;
  if (vis < 0.6) return null; // só com o footer (quase todo) visível
  const W = vb.width;
  const k = r.width / W;
  const mobile = W < 1000;
  return { slot, W, k, P: (x, y) => [x * k, (y - vb.y) * k], trees: mobile ? [[120, 0.85]] : [[330, 0.9], [1300, 0.75]] };
}

function footerCapivara(onEnd) {
  const g = footerGeo();
  if (!g) return null;
  const xe = g.W * (g.W < 1000 ? 0.42 : 0.3);
  const f = (o, x, y, op) => fr(o, ...g.P(x, y), 0, op);
  // entra pela esquerda andando na grama, para, dá um pulinho e some na grama da frente
  return play(g.slot, make('capivara', g.k, 'is-walk'), [f(0, -70, 288, 1), f(0.74, xe, 288, 1), f(0.8, xe + 6, 285, 1), f(0.86, xe + 10, 290, 1), f(1, xe + 16, 372, 0)],
    { phases: [[0.74, (el) => el.classList.remove('is-walk')]] }, onEnd);
}

function footerSagui(onEnd) {
  const g = footerGeo();
  if (!g) return null;
  const [tx, s] = g.trees[Math.floor(Math.random() * g.trees.length)];
  const px = tx + 6 * s;
  const py = 290 - s * 54 - 10; // pés presos um pouco acima da base da copa
  const left = tx < g.W / 2;
  const ex = left ? -90 : g.W + 90;
  const d = left ? 1 : -1;
  const f = (o, x, y, rot, op = 1) => fr(o, ...g.P(x, y), rot, op);
  // pendurado de cabeça p/ baixo na copa, balança, dá uma cambalhota e pula para fora da tela
  return play(g.slot, make('sagui', g.k), [
    f(0, px, py - 26, 0, 0), f(0.09, px, py, 0), f(0.24, px, py, 16), f(0.4, px, py, -12), f(0.55, px, py, 8), f(0.68, px, py, -3),
    f(0.74, px, py, 0), f(0.86, (px + ex) / 2, py - 70, -40 * d), f(1, ex, py - 10, -80 * d, 0.4)],
  { pose: [{ offset: 0, transform: 'rotate(180deg)' }, { offset: 0.74, transform: 'rotate(180deg)' }, { offset: 0.86, transform: 'rotate(0deg)' }, { offset: 1, transform: 'rotate(0deg)' }] }, onEnd);
}

function footerPassaro(onEnd) {
  const g = footerGeo();
  if (!g) return null;
  const [tx, s] = g.trees[g.trees.length - 1];
  const py = 290 - s * 138 + 1; // topo da copa
  const right = tx > g.W / 2;
  const xs = right ? g.W + 70 : -70;
  const fin = right ? -1 : 1; // olha para onde voa
  const f = (o, x, y) => fr(o, ...g.P(x, y));
  // chega voando, pousa no topo da árvore, dá um pulinho, vira e vai embora por onde veio
  return play(g.slot, make('passaro', g.k, 'is-fly'), [
    f(0, xs, 110), f(0.14, (xs + tx) / 2, 150), f(0.3, tx, py), f(0.6, tx, py), f(0.63, tx, py - 8), f(0.66, tx, py),
    f(0.8, (xs + tx) / 2, 120), f(1, xs, 60)],
  {
    flip: [{ offset: 0, transform: `scaleX(${fin})` }, { offset: 0.62, transform: `scaleX(${fin})` }, { offset: 0.62, transform: `scaleX(${-fin})` }, { offset: 1, transform: `scaleX(${-fin})` }],
    phases: [[0.3, (el) => el.classList.remove('is-fly')], [0.62, (el) => el.classList.add('is-fly')]],
  }, onEnd);
}

/* ---------- fundo da página ---------- */
/** Pássaro cruzando a faixa vazia no fim da seção que antecede uma seção alternada (acima da onda). */
function bgPassaro(onEnd) {
  const mobile = innerWidth <= 680;
  const cands = [...document.querySelectorAll('main .section--alt')].map((alt) => [alt.previousElementSibling, alt])
    .filter(([s]) => s && s.matches('section.section') && !s.matches('.projects-section'));
  for (const [sec, alt] of cands.sort(() => Math.random() - 0.5)) {
    const sr = sec.getBoundingClientRect();
    const h = Math.min(parseFloat(getComputedStyle(sec).paddingBottom) - 8, 110);
    if (h < 40) continue;
    const band = { left: sr.left, right: sr.right, top: sr.bottom - h, bottom: sr.bottom };
    if (!onScreen(band) || !isFree(band, [sec, alt])) continue;
    const host = document.createElement('div');
    host.className = 'bichos-host';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = `left:0;right:0;bottom:0;height:${h}px`;
    sec.append(host);
    const k = mobile ? 0.7 : 1;
    const y = Math.min(h - 4, Math.max(30 * k, h * 0.6));
    const ltr = Math.random() < 0.5;
    const [a, b] = ltr ? [-80, sr.width + 80] : [sr.width + 80, -80];
    const at = (t) => a + (b - a) * t;
    return play(host, make('passaro', k, 'is-fly'), [fr(0, at(0), y), fr(0.25, at(0.25), y - 10), fr(0.5, at(0.5), y + 4), fr(0.75, at(0.75), y - 8), fr(1, at(1), y)],
      { dur: mobile ? 3900 : DUR, flip: ltr ? null : [{ transform: 'scaleX(-1)' }, { transform: 'scaleX(-1)' }], removeHost: true }, onEnd);
  }
  return null;
}

/** Sagui pendurado na borda superior do hero, na margem direita vazia (só > 680px). */
function bgSagui(onEnd) {
  if (innerWidth <= 680) return null;
  const hero = document.querySelector('main .hero');
  if (!hero) return null;
  const hr = hero.getBoundingClientRect();
  const W = 150;
  const H = 200;
  const rect = { left: hr.right - W, right: hr.right, top: hr.top, bottom: hr.top + H };
  if (!onScreen(rect) || !isFree(rect, [hero])) return null;
  const host = document.createElement('div');
  host.className = 'bichos-host';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = `right:0;top:0;width:${W}px;height:${H}px`;
  hero.append(host);
  const x = W / 2;
  const f = (o, y, rot = 0) => fr(o, x, y, rot);
  // desce da borda (de cabeça p/ baixo), balança e sobe de volta sumindo atrás da borda
  return play(host, make('sagui', 0.9, 'is-hang'), [f(0, -80), f(0.14, 6), f(0.3, 6, 14), f(0.46, 6, -11), f(0.6, 6, 7), f(0.72, 6, -3), f(0.8, 6, 0), f(1, -85)],
    { removeHost: true }, onEnd);
}

const OPTS = [
  { id: 'footer-capivara', sp: 'capivara', run: footerCapivara },
  { id: 'footer-sagui', sp: 'sagui', run: footerSagui },
  { id: 'footer-passaro', sp: 'passaro', run: footerPassaro },
  { id: 'bg-passaro', sp: 'passaro', run: bgPassaro },
  { id: 'bg-sagui', sp: 'sagui', run: bgSagui },
];

export function start({ debug = false } = {}) {
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (rm.matches) return () => {};
  let timer = 0;
  let cur = null;
  let last = null;
  const wait = () => (debug ? rnd(3000, 5000) : rnd(20000, 60000));
  const next = (ms = wait()) => { clearTimeout(timer); timer = setTimeout(tick, ms); };
  const done = (cancelled) => { cur = null; if (!cancelled) next(); };
  const run = (o) => { const h = o.run(done); if (h) { cur = h; last = o.sp; } return h; };
  function tick() {
    if (document.hidden || cur) return;
    const opts = OPTS.filter((o) => o.sp !== last).sort(() => Math.random() - 0.5);
    if (!opts.some(run)) next(debug ? 1500 : 8000); // nenhum lugar livre na tela agora: tenta de novo daqui a pouco
  }
  const cancel = () => { clearTimeout(timer); const c = cur; cur = null; c?.cancel(); };
  const onVis = () => { if (document.hidden) cancel(); else if (!cur) next(); };
  const stop = () => {
    cancel();
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVis);
    rm.removeEventListener('change', onRm);
    if (debug) delete window.__bichos;
  };
  const onRm = (e) => { if (e.matches) stop(); };
  document.addEventListener('visibilitychange', onVis);
  rm.addEventListener('change', onRm);
  if (debug) {
    // Só com ?bichos=debug (QA): força uma aparição. window.__bichos.force('footer-capivara') → true/false
    window.__bichos = {
      ids: OPTS.map((o) => o.id),
      force: (id) => { cancel(); const o = OPTS.find((x) => x.id === id); return !!(o && run(o)); },
      get busy() { return !!cur; },
    };
  }
  next();
  return stop;
}
