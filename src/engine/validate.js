import { registry } from './registry.js';

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
    site.plans.forEach((p) => !m.plans?.items?.[p.id] && warn(`[${code}] textos ausentes para plano "${p.id}"`));
  });
}
