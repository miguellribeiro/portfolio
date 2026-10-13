import { registry } from './registry.js';
import { DEFAULT_EFFECTS, DIVIDERS } from './effects.js';

const PALETTE_KEYS = ['bg', 'surface', 'border', 'text', 'muted', 'primary', 'accent', 'highlight', 'gradient'];

/** Coleta todos os caminhos de chave de um objeto (ex.: "hero.title"). */
function keyPaths(obj, prefix = '') {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [prefix];
  return Object.keys(obj).flatMap((k) => keyPaths(obj[k], prefix ? `${prefix}.${k}` : k));
}

/**
 * Validação leve executada em desenvolvimento: avisa no console
 * sobre chaves ausentes, tipos de seção desconhecidos, etc.
 */
export function validateContent({ site, projects, messages }) {
  const warn = (...a) => console.warn('[conteúdo]', ...a);
  const base = messages[site.defaultLocale];
  if (!base) warn(`defaultLocale "${site.defaultLocale}" sem arquivo de idioma.`);

  site.locales.forEach((l) => {
    if (!messages[l.code]) warn(`Idioma "${l.code}" listado em site.json mas não importado em content.js.`);
  });

  site.sections.forEach((s) => {
    if (!registry[s.type]) warn(`Seção "${s.id}" usa type desconhecido "${s.type}".`);
  });

  // Tema
  const th = site.theme || {};
  if (!['dark', 'light'].includes(th.mode)) warn(`theme.mode inválido: "${th.mode}" (use dark|light).`);
  ['dark', 'light'].forEach((m) => {
    const p = th.palette?.[m];
    if (!p) return warn(`theme.palette.${m} ausente.`);
    PALETTE_KEYS.forEach((k) => p[k] === undefined && warn(`theme.palette.${m}.${k} ausente.`));
    if (p.gradient && (!Array.isArray(p.gradient) || p.gradient.length < 2)) warn(`theme.palette.${m}.gradient precisa de 2+ cores.`);
    return undefined;
  });
  ['heading', 'body', 'mono'].forEach((k) => !th.fonts?.[k] && warn(`theme.fonts.${k} ausente.`));

  // Efeitos
  Object.entries(site.effects || {}).forEach(([k, v]) => {
    if (!(k in DEFAULT_EFFECTS)) return warn(`effects.${k} desconhecido.`);
    if (k === 'dividers') return !DIVIDERS.includes(v) && warn(`effects.dividers inválido: "${v}" (${DIVIDERS.join('|')}).`);
    return typeof v !== 'boolean' && warn(`effects.${k} deve ser boolean.`);
  });

  // Contadores e marquee
  (site.stats || []).forEach((st) => {
    if (!st.id || typeof st.value !== 'number') warn('stats: item sem id ou value numérico.', st);
  });
  if (site.marquee && !Array.isArray(site.marquee.items)) warn('marquee.items deve ser uma lista.');

  const ids = new Set();
  projects.forEach((p) => {
    if (!p.id) warn('Projeto sem id.');
    if (ids.has(p.id)) warn(`Projeto duplicado: ${p.id}`);
    ids.add(p.id);
    ['tags', 'status', 'cover', 'gallery', 'links'].forEach((k) => {
      if (p[k] === undefined) warn(`Projeto "${p.id}" sem campo "${k}".`);
    });
  });

  if (!base) return;
  const ref = new Set(keyPaths(base));
  Object.entries(messages).forEach(([code, m]) => {
    const have = new Set(keyPaths(m));
    ref.forEach((k) => !have.has(k) && warn(`[${code}] chave ausente: ${k}`));
    projects.forEach((p) => !m.projects?.items?.[p.id] && warn(`[${code}] textos ausentes para projeto "${p.id}"`));
    (site.stats || []).forEach((st) => !m.stats?.items?.[st.id] && warn(`[${code}] rótulo ausente para stat "${st.id}"`));
    site.plans.forEach((p) => !m.plans?.items?.[p.id] && warn(`[${code}] textos ausentes para plano "${p.id}"`));
  });
}
