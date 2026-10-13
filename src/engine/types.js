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
 * @property {string} type     Chave do registry (hero, stats, about, marquee, projects, ...)
 * @property {boolean} enabled Se false, não é renderizada
 *
 * @typedef {Object} PlanDef
 * @property {string} id
 * @property {boolean} highlight  true = card "Recomendado" (borda em gradiente + CTA âmbar)
 * @property {Object<string, number>|null} prices  Preço por moeda (BRL/USD/EUR). null = "sob consulta"
 * @property {{type: 'whatsapp'|'email'|'url', href?: string}} cta
 *
 * @typedef {Object} Palette  Cores de um modo (dark ou light). Viram CSS vars --c-<kebab-case>.
 * @property {string} bg
 * @property {string} surface
 * @property {string} border
 * @property {string} text
 * @property {string} muted        Texto secundário
 * @property {string} primary      Cor primária (teal)
 * @property {string} [primaryText] Variante da primária com contraste AA para texto
 * @property {string} [onPrimary]  Cor do texto sobre fundo primário
 * @property {string} accent       Cor de destaque secundária (índigo)
 * @property {string} highlight    Âmbar — somente CTAs/preços
 * @property {string} [onHighlight]
 * @property {string[]} gradient   Paradas do gradiente 135deg, ex.: ["#14B8A6 0%", "#6366F1 55%"]
 * @property {string[]} [mesh]     3 cores dos blobs do hero
 * @property {number} [meshOpacity]
 *
 * @typedef {Object} ThemeConfig
 * @property {'dark'|'light'} mode  Modo inicial (escolha salva/preferência do SO têm prioridade)
 * @property {{dark: Palette, light: Palette}} palette
 * @property {{heading: string, body: string, mono: string}} fonts  Nomes das famílias (carregadas via @fontsource em main.jsx)
 *
 * @typedef {Object} Effects  Liga/desliga efeitos. prefers-reduced-motion desliga os de movimento.
 * @property {boolean} heroMesh        Blobs de gradiente no hero
 * @property {boolean} grain           Ruído sutil (SVG) no hero
 * @property {boolean} bgGrid          Grade de fundo no hero
 * @property {boolean} scrollReveal    Fade + translateY ao rolar
 * @property {boolean} parallax        Parallax em camadas no hero (motion)
 * @property {boolean} cardTilt        Inclinação 3D dos cards (máx. 6deg)
 * @property {boolean} cursorSpotlight Brilho que segue o cursor nos cards
 * @property {boolean} marquee         Animação da faixa de tecnologias
 * @property {boolean} counters        Animação dos contadores
 * @property {'diagonal'|'wave'|'none'} dividers  Divisores entre seções
 * @property {boolean} smoothScroll    Lenis (carregado sob demanda)
 *
 * @typedef {Object} StatDef  Rótulo em locales/*.json → stats.items.<id>
 * @property {string} id
 * @property {number} value
 * @property {number} [decimals]
 * @property {string} [prefix]
 * @property {string} [suffix]
 * @property {boolean} [example]  true = número ilustrativo (exibe aviso)
 *
 * @typedef {Object} SiteConfig
 * @property {string} defaultLocale
 * @property {LocaleDef[]} locales
 * @property {ThemeConfig} theme
 * @property {Effects} effects
 * @property {SectionDef[]} sections
 * @property {StatDef[]} stats
 * @property {{items: string[]}} marquee  Nomes de tecnologias (não traduzidos)
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
