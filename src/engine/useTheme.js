import { useEffect, useState } from 'react';

const KEY = 'portfolio.theme';

/** Aplica as cores do site.json como CSS variables e alterna dark/light. */
export function useTheme(theme) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    return theme.defaultMode || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors[mode] || {};
    Object.entries(colors).forEach(([k, v]) => root.style.setProperty(`--c-${k}`, v));
    root.dataset.theme = mode;
    localStorage.setItem(KEY, mode);
  }, [mode, theme]);

  return [mode, () => setMode((m) => (m === 'dark' ? 'light' : 'dark'))];
}
