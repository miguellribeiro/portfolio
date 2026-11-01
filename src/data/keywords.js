/**
 * Palavras-chave da tipografia decorativa (Fase 2 — "Ecossistema Orgânico").
 * Sempre em inglês, nos 3 idiomas. Para trocar, edite só esta lista e as seleções abaixo
 * (as seleções referenciam itens da lista; maiúsculas/caixa vêm do CSS).
 * Tudo é decorativo (aria-hidden): o conteúdo real dessas palavras já está no texto do site.
 */
export const KEYWORDS = [
  'React', 'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'NestJS', 'Python', 'Oracle PL/SQL', 'Git', 'Docker',
  'Tech Lead', 'Full Stack', 'secure', 'scalable', 'UX', 'Scrum',
];

const pick = (...words) => words.filter((w) => KEYWORDS.includes(w));

export const DECOR = {
  /** Texto em curva no divisor (onda) — a stack. */
  curve: KEYWORDS.slice(0, 10),
  /** Texto vertical na margem do hero (desktop largo). */
  margin: pick('Tech Lead', 'secure', 'scalable'),
  /** Palavra gigante vazada (contato, cortada pela borda). */
  giant: pick('Full Stack')[0],
  /** Tags flutuantes por seção. */
  tags: {
    projects: pick('UX', 'Full Stack', 'Scrum'),
    process: pick('Tech Lead', 'secure', 'scalable'),
  },
};
