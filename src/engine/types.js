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
 * @typedef {Object} PlanDef  Textos em locales/*.json → plans.items.<id> (name, audience, features[], cta)
 * @property {string} id
 * @property {boolean} highlight  true = card "Recomendado" (borda em gradiente, scale 1.02, CTA de destaque)
 * @property {boolean} [inherits] true = mostra "Tudo do anterior +" antes dos itens
 * @property {Object<string, number>|null} prices  Preço "a partir de" por projeto, por moeda (BRL/USD/EUR). null = sem preço
 * @property {Object<string, number>|null} [pricesMonthly]  Preço mensal por moeda. Sem os dois = "Sob consulta"
 * @property {{type: 'whatsapp'|'email'|'url', href?: string}} cta  whatsapp/email abrem o overlay de contato com plano + modo + moeda
 *
 * @typedef {true|false|string} CompareValue  true = check, false = "—", "v:<id>" = locales → plans.values.<id>
 *
 * @typedef {Object} PlansConfig
 * @property {{default: 'project'|'monthly', options: ('project'|'monthly')[]}} billing  Toggle Projeto|Mensal
 * @property {boolean} examplePrices  true = exibe o aviso "valores de exemplo"
 * @property {string[]} trust  Ids da faixa de garantias (textos em plans.trust.<id>)
 * @property {{categories: {id: string, rows: {id: string, values: Object<string, CompareValue>}[]}[]}} compare
 *   Tabela "Comparar tudo" (rótulos/tooltips em plans.categories.<id> e plans.rows.<id>.{label,tip})
 * @property {string[]} faq  Ids das perguntas (plans.faq.<id>.{q,a})
 *
 * @typedef {Object} Palette  Cores de um modo (dark ou light). Viram CSS vars --c-<kebab-case>.
 * @property {string} bg
 * @property {string} surface
 * @property {string} surface2    Superfície secundária (seções alternadas, faixas)
 * @property {string} border
 * @property {string} text
 * @property {string} muted        Texto secundário
 * @property {string} primary      Cor primária (teal)
 * @property {string} [primaryText] Variante da primária com contraste AA para texto
 * @property {string} [onPrimary]  Cor do texto sobre fundo primário
 * @property {string} [secondary]   Coral (light) / pêssego (dark) — texto de apoio
 * @property {string} accent       Berry (light) / orquídea (dark)
 * @property {string} highlight    CTA de destaque (plano recomendado)
 * @property {string} [success]    Checks e status positivo
 * @property {string} [onHighlight]
 * @property {string[]} gradient   Paradas do gradiente 135deg, ex.: ["#FF5FA2 0%", "#FF7F8E 50%", "#FFB38A 100%"]
 * @property {string[]} [mesh]     3 cores dos blobs do hero
 * @property {number} [meshOpacity]
 *
 * @typedef {Object} ThemeConfig
 * @property {'dark'|'light'} mode  Modo inicial (escolha salva/preferência do SO têm prioridade)
 * @property {{dark: Palette, light: Palette}} palette
 * @property {{heading: string, body: string, mono: string, display: string}} fonts
 *   Famílias (carregadas via @fontsource em main.jsx). display = serifa itálica só na palavra [[destacada]] do hero
 *
 * @typedef {Object} Effects  Liga/desliga efeitos. prefers-reduced-motion desliga os de movimento.
 * @property {boolean} loader          Monograma animado na 1ª visita da sessão (≤700ms)
 * @property {boolean} ambientBlobs    Blobs do hero se movendo lentamente (pausa fora da tela/aba oculta)
 * @property {boolean} headlineReveal  Título do hero palavra por palavra + sublinhado no destaque
 * @property {boolean} skeleton        Shimmer enquanto imagens carregam
 * @property {boolean} magnetic        CTA principal "magnético" (máx. 4px)
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
 * @property {{monogram: string}} [brand]  Monograma do loader/header (ex.: "MR")
 * @property {{email?: string, whatsapp?: string, whatsappDisplay?: string, github?: string, linkedin?: string}} contact
 *   whatsapp só dígitos com DDI. Textos pré-preenchidos em locales → contact.whatsappText / emailSubject
 * @property {PlanDef[]} plans
 * @property {PlansConfig} [plansConfig]
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
