/**
 * Tipos (JSDoc) do conteúdo. Servem como documentação e autocomplete no editor.
 *
 * @typedef {Object} LocaleDef
 * @property {string} code   Código BCP-47 (ex.: "pt-BR")
 * @property {string} label  Rótulo curto no seletor (ex.: "PT")
 * @property {string} name   Nome completo do idioma
 * @property {string} [flag] Emoji de bandeira (opcional)
 *
 * @typedef {Object} SectionDef
 * @property {string} id       Âncora/ID único da seção (usado em #links)
 * @property {string} type     Chave do registry (hero, about, projects, ...)
 * @property {boolean} enabled Se false, não é renderizada
 *
 * @typedef {Object} PlanDef
 * @property {string} id
 * @property {boolean} highlight
 * @property {Object<string, number>|null} prices  Preço por moeda (BRL/USD/EUR). null = "sob consulta"
 * @property {{type: 'whatsapp'|'email'|'url', href?: string}} cta
 *
 * @typedef {Object} SiteConfig
 * @property {string} defaultLocale
 * @property {LocaleDef[]} locales
 * @property {{defaultMode: 'dark'|'light', colors: Object<string, Object<string,string>>}} theme
 * @property {SectionDef[]} sections
 * @property {{email?: string, whatsapp?: string, github?: string, linkedin?: string}} contact
 * @property {PlanDef[]} plans
 *
 * @typedef {Object} ProjectDef
 * @property {string} id         Igual ao nome da pasta em public/projects/<id>/
 * @property {string[]} tags
 * @property {'production'|'in-progress'|'archived'} status
 * @property {string} cover      Nome do arquivo da capa dentro da pasta
 * @property {string[]} gallery  Arquivos da galeria
 * @property {{demo?: string, repo?: string}} links
 * @property {{enabled: boolean, url?: string}} testDrive  Fase 3 — hoje sempre "Em breve"
 */
export {};
