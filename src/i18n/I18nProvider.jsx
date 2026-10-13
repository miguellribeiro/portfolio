import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext } from './context.js';
import { messages, site } from '../engine/content.js';

const KEY = 'portfolio.locale';
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

/** Ordem: ?lang= → localStorage → idioma do navegador → defaultLocale. */
function detect() {
  const fromUrl = match(new URLSearchParams(window.location.search).get('lang'));
  if (fromUrl) return fromUrl;
  const saved = match(localStorage.getItem(KEY));
  if (saved) return saved;
  for (const l of navigator.languages || [navigator.language]) {
    const m = match(l);
    if (m) return m;
  }
  return site.defaultLocale;
}

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detect);

  const setLocale = useCallback((code) => {
    setLocaleState(code);
    localStorage.setItem(KEY, code);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.history.replaceState(null, '', url);
  }, []);

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

  // SEO por idioma: lang, title, description, og:*
  useEffect(() => {
    const m = messages[locale];
    document.documentElement.lang = locale;
    document.title = m.meta.title;
    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('name', 'description', m.meta.description);
    setMeta('property', 'og:title', m.meta.title);
    setMeta('property', 'og:description', m.meta.description);
    setMeta('property', 'og:locale', locale.replace('-', '_'));
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, currency: messages[locale].currency, locales: site.locales }),
    [locale, setLocale, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
