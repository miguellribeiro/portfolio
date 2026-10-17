import { useLayoutEffect, useState } from 'react';

const KEY = 'portfolio.theme';
const FALLBACK = {
  heading: 'system-ui, sans-serif',
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Consolas, monospace',
  display: 'Georgia, \'Times New Roman\', serif',
};
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Converte ["#a 0%", "#b 55%", "#c"] em linear-gradient(135deg, ...). */
export function toGradient(stops = []) {
  return `linear-gradient(135deg, ${stops.join(', ')})`;
}

/**
 * Aplica site.json → theme (paleta do modo atual + fontes) como CSS variables
 * em <html> e alterna dark/light. useLayoutEffect evita "flash" de cores.
 */
export function useTheme(theme) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    return theme.mode || 'dark';
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const { gradient, mesh, meshOpacity, ...colors } = theme.palette?.[mode] || {};
    Object.entries(colors).forEach(([k, v]) => root.style.setProperty(`--c-${kebab(k)}`, v));
    if (gradient?.length) root.style.setProperty('--grad', toGradient(gradient));
    (mesh || []).forEach((c, i) => root.style.setProperty(`--mesh-${i + 1}`, c));
    if (meshOpacity != null) root.style.setProperty('--mesh-opacity', String(meshOpacity));
    Object.entries(theme.fonts || {}).forEach(([k, name]) => {
      root.style.setProperty(`--font-${k}`, `'${name}', ${FALLBACK[k] || 'sans-serif'}`);
    });
    let meta = document.head.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    if (colors.bg) meta.content = colors.bg;
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    localStorage.setItem(KEY, mode);
  }, [mode, theme]);

  return [mode, () => setMode((m) => (m === 'dark' ? 'light' : 'dark'))];
}
