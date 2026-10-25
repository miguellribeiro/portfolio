import { useCallback, useMemo, useState } from 'react';
import { I18nContext } from './context.js';
import { messages, site } from '../engine/content.js';

const SCROLL_KEY = 'portfolio.langScroll';
const BASE = import.meta.env.BASE_URL; // "/" (ou "/<repo>/" com BASE_PATH)
const codes = site.locales.map((l) => l.code);

/** Resolve "es-AR" → "es", "pt" → "pt-BR", etc. */
function match(input) {
  if (!input) return null;
  const lower = input.toLowerCase();
  return (
    codes.find((c) => c.toLowerCase() === lower) ||
    codes.find((c) => c.toLowerCase().split('-')[0] === lower.split('-')[0]) ||
    null
  );
}

/** URL de cada idioma (site.json → locales[].path): pt-BR "/", en "/en/", es "/es/". */
export const localePath = (code) => {
  const l = site.locales.find((x) => x.code === code);
  return `${BASE}${(l?.path || '/').replace(/^\//, '')}`;
};

/**
 * O idioma vem SÓ do caminho (cada URL tem <head> pré-renderizado no idioma dela):
 * "/en/…" → en, "/es/…" → es, resto → defaultLocale. Sem detecção pelo navegador,
 * para o conteúdo nunca divergir do <head>/canonical da URL.
 */
function fromPath() {
  const rest = window.location.pathname.slice(BASE.length - 1);
  const hit = site.locales.find((l) => l.path !== '/' && (`${rest}/`).startsWith(l.path));
  return hit?.code || site.defaultLocale;
}

/**
 * Links antigos com ?lang=en|es (versão anterior) → URL do idioma.
 * Retorna true se redirecionou (o app não deve montar).
 */
export function redirectLegacyLang() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('lang')) return false;
  const code = match(url.searchParams.get('lang'));
  url.searchParams.delete('lang');
  const target = code ? localePath(code) : url.pathname;
  window.location.replace(`${target}${url.search}${url.hash}`);
  return true;
}

/** Restaura a rolagem após trocar de idioma (navegação de página inteira). */
export function restoreLangScroll() {
  let y = null;
  try {
    y = Number(sessionStorage.getItem(SCROLL_KEY));
    sessionStorage.removeItem(SCROLL_KEY);
  } catch { /* modo privado */ }
  if (!(y > 0)) return;
  // O React monta de forma assíncrona: espera a página ter altura suficiente (máx. ~1,5s).
  const t0 = performance.now();
  const tick = () => {
    const room = document.documentElement.scrollHeight - window.innerHeight;
    if (room >= y || performance.now() - t0 > 1500) window.scrollTo(0, Math.min(y, room));
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function I18nProvider({ children }) {
  const [locale] = useState(fromPath);

  // Troca de idioma = navegar para a URL do idioma (head pré-renderizado, nada trocado via JS).
  const setLocale = useCallback((code) => {
    if (code === locale) return;
    try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch { /* modo privado */ }
    window.location.assign(`${localePath(code)}${window.location.search}${window.location.hash}`);
  }, [locale]);

  const t = useCallback(
    (path) => {
      const v = get(messages[locale], path);
      if (v !== undefined) return v;
      const fb = get(messages[site.defaultLocale], path);
      if (import.meta.env.DEV) console.warn(`[i18n] "${path}" ausente em ${locale}`);
      return fb ?? path;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: site.locales }),
    [locale, setLocale, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
