import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { useEffects } from '../engine/effects.js';
import { getChannels, useChannel, whatsappHref } from '../engine/channels.js';
import { openHref } from './ChannelOverlay.jsx';
import SmartImage from './SmartImage.jsx';

/*
 * Deck de projetos (mobile ≤ 680px; ver engine/breakpoints.js → MOBILE_DECK).
 *
 * - Palco "sticky" com os cards sobrepostos; a rolagem pela altura do .deck avança o deck.
 * - Movimento: CSS scroll-driven (`animation-timeline: view()` anima --t 0→1 no .deck; cada card
 *   calcula a própria posição a partir de --t). Sem suporte: IntersectionObserver em sentinelas
 *   (uma por card) define o card da frente e o --t vai em degraus, com transição.
 * - As sentinelas também alimentam o contador "1 de N" nos dois modos.
 * - Toque/Enter num card abre um painel inferior (<dialog>) com os detalhes. Fecha pelo botão (48px),
 *   arrastando para baixo, Esc ou o "voltar" do Android (history.pushState + popstate; a URL não
 *   muda, então /en/ e /es/ continuam valendo), toque no fundo. Ao fechar, o foco volta para o card.
 * - Só o card da frente é interativo (os demais ficam inert); arrasto > 10px não conta como toque.
 * - prefers-reduced-motion: lista empilhada simples, sem transforms.
 */

const SDT = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OUT_MS = 280;

/** Altura do deck, viewport, scroll-padding-top e passo (px de rolagem por card). */
function geometry(el, n) {
  const H = el.offsetHeight;
  const VH = window.innerHeight;
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return { H, VH, pad, u: Math.max(1, (H - VH + pad) / Math.max(1, n - 1)) };
}

const asset = (id, file) => `${import.meta.env.BASE_URL}projects/${id}/${file}`;

/** Card de projeto/CTA: imagem, título e no máximo 2 tags (a descrição fica no painel). */
const TAP_SLOP = 10; // px: acima disso o gesto é arrasto/rolagem, não toque

function DeckCard({ item, i, past, behind, onOpen, btnRef }) {
  const press = useRef(null);
  const { t } = useI18n();
  const tagMap = t('projects.tags');
  const tag = (x) => (tagMap && typeof tagMap === 'object' && tagMap[x]) || x;
  const end = item.kind === 'end';
  return (
    // Só o card da frente é interativo: os de trás (e os que já saíram) ficam inert (sem toque/foco).
    <li className={`deck__item ${past ? 'is-past' : ''} ${behind ? 'is-behind' : ''}`} style={{ '--i': i }} inert={past || behind ? '' : undefined}>
      <button
        ref={btnRef}
        type="button"
        className={`deck__card ${end ? 'deck__card--end' : ''}`}
        aria-haspopup="dialog"
        onPointerDown={(e) => { press.current = { x: e.clientX, y: e.clientY, moved: false }; }}
        onPointerMove={(e) => {
          const g = press.current;
          if (g && Math.hypot(e.clientX - g.x, e.clientY - g.y) > TAP_SLOP) g.moved = true;
        }}
        onPointerCancel={() => { if (press.current) press.current.moved = true; }}
        onClick={(e) => {
          const g = press.current;
          press.current = null;
          if (g?.moved || (g && e.detail > 0 && Math.hypot(e.clientX - g.x, e.clientY - g.y) > TAP_SLOP)) return;
          onOpen(i);
        }}
      >
        {end ? (
          <span className="deck__cover deck__cover--end" aria-hidden="true"><span className="pcard__plus">+</span></span>
        ) : (
          <span className="deck__cover">
            <SmartImage src={asset(item.p.id, item.p.cover)} alt="" width={1200} height={750} />
            <span className="pcard__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          </span>
        )}
        <span className="deck__body">
          <span className="deck__title">{item.title}</span>
          {!end && (
            <span className="tags deck__tags">
              {item.p.tags.slice(0, 2).map((x) => <span key={x} className="tag mono">{tag(x)}</span>)}
            </span>
          )}
          <span className="deck__more mono">{t('projects.deck.open')} <span aria-hidden="true">↑</span></span>
        </span>
      </button>
    </li>
  );
}

/** Conteúdo do painel (detalhes do card). */
function PanelBody({ item, titleId, onLeave }) {
  const { t } = useI18n();
  const { launch } = useChannel();
  const tagMap = t('projects.tags');
  const tag = (x) => (tagMap && typeof tagMap === 'object' && tagMap[x]) || x;
  if (item.kind === 'end') {
    const wa = getChannels(t).find((c) => c.key === 'whatsapp');
    const ch = wa && { ...wa, href: whatsappHref(t('projects.end.message')) };
    return (
      <div className="sheet__content sheet__content--end">
        <span className="pcard__plus" aria-hidden="true">+</span>
        <h3 id={titleId}>{t('projects.end.title')}</h3>
        <p className="muted">{t('projects.end.text')}</p>
        {/* O overlay do canal fica fora do <dialog> modal: o painel fecha antes de abri-lo */}
        {ch ? (
          <a
            className="btn btn--primary"
            href={ch.href}
            data-channel={ch.key}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
              e.preventDefault();
              onLeave();
              setTimeout(() => { if (!launch({ channel: ch.key, href: ch.href, external: ch.external })) openHref(ch.href, ch.external); }, 0);
            }}
          >
            {t('projects.end.cta')} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        ) : (
          <a className="btn btn--primary" href="#contact" onClick={onLeave}>{t('projects.end.cta')}</a>
        )}
      </div>
    );
  }
  const { p, text } = item;
  return (
    <div className="sheet__content">
      <span className="sheet__cover">
        <SmartImage src={asset(p.id, p.cover)} alt={text.alt} width={1200} height={750} />
      </span>
      <div className="pcard__meta">
        <span className={`status status--${p.status}`}>{t(`projects.status.${p.status}`)}</span>
        {p.confidential && (
          <span className="badge badge--lock mono">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            {t('projects.confidential')}
          </span>
        )}
      </div>
      <h3 id={titleId}>{text.title}</h3>
      <p className="muted">{text.description}</p>
      <ul className="tags" aria-label="tags">
        {p.tags.map((x) => <li key={x} className="tag mono">{tag(x)}</li>)}
      </ul>
      {(p.links?.demo || p.links?.repo) && (
        <div className="project__links">
          {p.links?.demo && <a className="btn btn--sm" href={p.links.demo} target="_blank" rel="noopener noreferrer">{t('projects.demo')} ↗</a>}
          {p.links?.repo && <a className="btn btn--sm" href={p.links.repo} target="_blank" rel="noopener noreferrer">{t('projects.repo')} ↗</a>}
        </div>
      )}
    </div>
  );
}

export default function ProjectDeck({ projects }) {
  const { t } = useI18n();
  const { reducedMotion } = useEffects();
  const items = [
    ...projects.map((p) => {
      const text = t(`projects.items.${p.id}`);
      return { kind: 'project', key: p.id, p, text, title: text.title };
    }),
    { kind: 'end', key: 'end', title: t('projects.end.title') },
  ];
  const n = items.length;
  const deck = useRef(null);
  const sentinels = useRef([]);
  const cards = useRef([]);
  const dialog = useRef(null);
  const sheet = useRef(null);
  const [front, setFront] = useState(0);
  const [openIdx, setOpenIdx] = useState(null);
  const [shown, setShown] = useState(false); // classe .is-in (anima a entrada)
  const openRef = useRef(null);
  const titleId = 'deck-panel-title';

  // Sentinelas: mesma geometria do range "contain" de view() → card da frente = round(t·(n−1)).
  // (O view() desconta o scroll-padding-top do <html>: o range vai de top = pad até bottom = VH.)
  useLayoutEffect(() => {
    const el = deck.current;
    if (!el || reducedMotion) return undefined;
    const place = () => {
      const { H, VH, pad, u } = geometry(el, n);
      sentinels.current.forEach((s, i) => {
        if (!s) return;
        const top = i === 0 ? 0 : (i - 0.5) * u + VH / 2 - pad;
        const bottom = i === n - 1 ? H : (i + 0.5) * u + VH / 2 - pad;
        s.style.top = `${top}px`;
        s.style.height = `${Math.max(1, bottom - top)}px`;
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener('resize', place);
    return () => { ro.disconnect(); window.removeEventListener('resize', place); };
  }, [n, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setFront(Number(e.target.dataset.i)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sentinels.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [n, reducedMotion]);

  // Fallback sem scroll-driven animations: --t em degraus (o CSS anima com transição).
  useLayoutEffect(() => {
    if (SDT || reducedMotion || !deck.current) return;
    deck.current.style.setProperty('--t', String(n > 1 ? front / (n - 1) : 0));
  }, [front, n, reducedMotion]);

  // O card da frente mudou com o foco num card do deck (ex.: rolagem por teclado): o foco
  // acompanha o novo card da frente (o anterior virou inert).
  useEffect(() => {
    const a = document.activeElement;
    if (reducedMotion || !a?.classList?.contains('deck__card') || a === cards.current[front]) return;
    cards.current[front]?.focus({ preventScroll: true });
  }, [front, reducedMotion]);

  // ----- Painel -----
  const finishClose = useCallback(() => {
    const i = openRef.current;
    openRef.current = null;
    document.documentElement.classList.remove('has-sheet');
    if (dialog.current?.open) dialog.current.close();
    setOpenIdx(null);
    if (sheet.current) sheet.current.style.transform = '';
    if (i != null) cards.current[i]?.focus({ preventScroll: true });
  }, []);

  /** fromHistory: veio do popstate (a entrada já saiu); now: fecha sem animação. */
  const closePanel = useCallback((fromHistory = false, now = false) => {
    if (openRef.current == null) return;
    if (!fromHistory && history.state?.deckPanel) history.back(); // consome a entrada criada ao abrir
    setShown(false);
    if (sheet.current) sheet.current.style.transform = '';
    if (reducedMotion || now) finishClose();
    else setTimeout(finishClose, OUT_MS);
  }, [finishClose, reducedMotion]);

  const openPanel = useCallback((i) => {
    openRef.current = i;
    setOpenIdx(i);
    history.pushState({ ...(history.state || {}), deckPanel: true }, '');
  }, []);

  // showModal após o render (conteúdo já no DOM), depois anima a entrada.
  useEffect(() => {
    const d = dialog.current;
    if (openIdx == null || !d || d.open) return undefined;
    d.showModal();
    document.documentElement.classList.add('has-sheet');
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, [openIdx]);

  // "Voltar" (Android/navegador) fecha o painel
  useEffect(() => {
    const onPop = () => closePanel(true);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [closePanel]);

  useEffect(() => () => document.documentElement.classList.remove('has-sheet'), []);

  const onCancel = (e) => { e.preventDefault(); closePanel(); }; // Esc
  const onBackdrop = (e) => { if (e.target === dialog.current) closePanel(); };

  // Focus trap (além do inert do modal: o Tab não sai para a interface do navegador)
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const f = [...(dialog.current?.querySelectorAll(FOCUSABLE) || [])].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Arrastar para baixo (alça + cabeçalho do painel)
  const drag = useRef(null);
  const onDown = (e) => {
    if (e.button > 0 || e.target.closest('button, a')) return;
    drag.current = { y: e.clientY, t: performance.now(), dy: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sheet.current.classList.add('is-dragging');
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.y);
    drag.current.dy = dy;
    if (dy > TAP_SLOP) sheet.current.style.transform = `translateY(${dy - TAP_SLOP}px)`;
  };
  const onUp = () => {
    const g = drag.current;
    if (!g) return;
    drag.current = null;
    sheet.current.classList.remove('is-dragging');
    const v = g.dy / Math.max(1, performance.now() - g.t);
    if (g.dy <= TAP_SLOP) { sheet.current.style.transform = ''; return; } // toque, não arrasto
    if (g.dy > Math.min(140, sheet.current.offsetHeight * 0.25) || (g.dy > 40 && v > 0.6)) closePanel();
    else sheet.current.style.transform = '';
  };

  const counter = t('projects.deck.counter').replace('{n}', front + 1).replace('{total}', n);
  const mode = reducedMotion ? 'deck--static' : (SDT ? 'deck--sdt' : 'deck--io');
  const current = openIdx != null ? items[openIdx] : null;

  return (
    <div ref={deck} className={`deck ${mode}`} style={{ '--n': n }}>
      {!reducedMotion && items.map((it, i) => (
        <span key={it.key} ref={(el) => { sentinels.current[i] = el; }} className="deck__sentinel" data-i={i} aria-hidden="true" />
      ))}
      <div className="deck__stage">
        {!reducedMotion && <p className="deck__count mono" aria-hidden="true">{counter}</p>}
        <ul className="deck__list" aria-label={t('projects.title')}>
          {items.map((it, i) => (
            <DeckCard
              key={it.key}
              item={it}
              i={i}
              past={!reducedMotion && i < front}
              behind={!reducedMotion && i > front}
              onOpen={openPanel}
              btnRef={(el) => { cards.current[i] = el; }}
            />
          ))}
        </ul>
      </div>
      <dialog
        ref={dialog}
        className={`sheet ${shown ? 'is-in' : ''}`}
        aria-labelledby={titleId}
        onCancel={onCancel}
        onClick={onBackdrop}
        onKeyDown={onKeyDown}
      >
        <div ref={sheet} className="sheet__panel">
          <div className="sheet__grab" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <span className="sheet__handle" aria-hidden="true" />
            <button type="button" className="sheet__close" onClick={() => closePanel()} aria-label={t('projects.close')} autoFocus>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="sheet__scroll">
            {current && <PanelBody item={current} titleId={titleId} onLeave={() => closePanel(false, true)} />}
          </div>
        </div>
      </dialog>
    </div>
  );
}
