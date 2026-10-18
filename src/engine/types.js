/**
 * Tipos (JSDoc) do conteúdo. Servem como documentação e autocomplete no editor.
 *
 * @typedef {Object} LocaleDef
 * @property {string} code   Código BCP-47 (ex.: "pt-BR")
 * @property {string} label  Rótulo curto no seletor (ex.: "PT")
 * @property {string} name   Nome completo do idioma
 *
 * @typedef {Object} SectionDef
 * @property {string} id       Âncora/ID único da seção (usado em #links)
 * @property {string} type     Chave do registry (hero, bento, about, marquee, projects, experience, process, plans, contact, footer)
 * @property {boolean} enabled Se false, não é renderizada
 *
 * @typedef {Object} PlanDef  Textos em locales/*.json → plans.categories.<cat>.plans.<id> (name, audience, features[])
 * @property {string} id
 * @property {boolean} highlight  true = card "Recomendado" (borda em gradiente, CTA de destaque)
 * @property {boolean} [inherits] true = mostra "Tudo do anterior +" antes dos itens
 * @property {{type: 'whatsapp'|'email'|'url', href?: string}} [cta]  Padrão whatsapp (overlay com categoria, plano e preço)
 *
 * @typedef {true|false|'price'|string} CompareValue  true = check, false = "—", "price" = mensalidade, "v:<id>" = locales → plans.values.<id>
 *
 * @typedef {Object} CompareRow
 * @property {string} id  Rótulo/tooltip em plans.rows.<id>.{label,tip}
 * @property {Object<string, CompareValue>} values  planId → valor
 * @property {number[]} [footnotes]  Notas sobrescritas (¹ ²) → plans.footnotes.<n>
 *
 * @typedef {Object} PlanCategory
 * @property {string} id  "sites" | "systems" (aba). Rótulo em plans.categories.<id>.label
 * @property {string} [priceKey]  Chave da tabela de preços em cada região ("sites" | "sistemas"); padrão = id
 * @property {{groups: {id: string, rows: CompareRow[]}[]}} compare  Grupos (rótulos em plans.groups.<id>)
 *
 * @typedef {Object} PlansConfig
 * @property {PlanCategory[]} categories
 * @property {{cta: {type: 'whatsapp'|'email'|'url', href?: string}}} [customBand]  Faixa "Sob Medida"
 * @property {string[]} trust  Ids da faixa de garantias (plans.trust.<id>)
 * @property {number[]} footnotes  Notas exibidas sob a tabela (plans.footnotes.<n>)
 * @property {boolean} disclaimer  Exibe plans.disclaimer sob a tabela
 * @property {string[]} faq  Ids das perguntas (plans.faq.<id>.{q,a})
 *
 * @typedef {Object} Region  Tabela de preços mensais de uma região (site.json → pricing.regions)
 * @property {string} id  BR | US | EU | MX | CL | CO | AR | LATAM (rótulo em plans.region.names.<id>)
 * @property {string} currency  ISO 4217 (BRL, USD, EUR, MXN, CLP, COP...)
 * @property {string} locale  Locale do Intl.NumberFormat (ex.: "es-MX"); sem casas decimais
 * @property {string[]} countries  Códigos de país/região BCP-47 que caem nesta região (ex.: "MX", "419")
 * @property {string[]} languages  Idiomas sem região que caem aqui (ex.: "pt" → BR)
 * @property {string} [flag]  Bandeira (components/Flag.jsx)
 * @property {Object<string, number>} sites  essencial, profissional, premium, premiumPainel
 * @property {Object<string, number>} sistemas  essencial, profissional, premium
 * @property {{amount: number, currency?: string}} [domainFee]  Taxa de transferência/registro do domínio (cancelamento < 12 meses) → {fee} em plans.domainClause
 * @property {Object} [alternatives]  Tabela alternativa desativada (ex.: AR em ARS)
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
 * @property {boolean} loader          Wordmark desenhado na 1ª visita da sessão (≤700ms)
 * @property {boolean} ambientBlobs    Blobs do hero se movendo lentamente (pausa fora da tela/aba oculta)
 * @property {boolean} headlineReveal  Título do hero palavra por palavra + sublinhado no destaque
 * @property {boolean} skeleton        Shimmer enquanto imagens carregam
 * @property {boolean} magnetic        CTAs "magnéticos" (máx. 7px)
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
 *
 * @typedef {Object} SiteConfig
 * @property {string} defaultLocale
 * @property {LocaleDef[]} locales
 * @property {ThemeConfig} theme
 * @property {Effects} effects
 * @property {SectionDef[]} sections
 * @property {StatDef[]} stats
 * @property {{items: string[]}} marquee  Nomes de tecnologias (não traduzidos)
 * @property {{name: string}} brand  Marca (wordmark no header/loader/rodapé), ex.: "Manpe"
 * @property {string[]} capabilities  Ids dos diferenciais (locales → capabilities.items.<id>.{name,description})
 * @property {{items: {ref: string, size: 'sm'|'md'|'xl', icon: string}[]}} bento  ref = "stat:<id>" | "cap:<id>"
 * @property {{steps: string[], autoAdvanceMs: number}} process  "Como funciona" (locales → process.steps.<id>)
 * @property {{email?: string, whatsapp?: string, whatsappDisplay?: string, github?: string, linkedin?: string}} contact
 *   whatsapp só dígitos com DDI. Textos pré-preenchidos em locales → contact.whatsappText / emailSubject
 * @property {PlansConfig} plansConfig
 * @property {{defaultRegion: string, regions: Region[]}} pricing  Preços por região (independe do idioma)
 *
 * @typedef {Object} ProjectDef
 * @property {string} id         Igual ao nome da pasta em public/projects/<id>/
 * @property {string[]} tags
 * @property {'production'|'in-progress'|'archived'|'internal'|'completed'} status  internal = "Em produção · Uso corporativo"
 * @property {boolean} [confidential]  true = selo "Confidencial" (sem links)
 * @property {string} cover      Nome do arquivo da capa dentro da pasta
 * @property {string[]} gallery  Arquivos da galeria
 * @property {{demo?: string, repo?: string}} links
 * @property {{enabled: boolean, url?: string}} testDrive  Fase 3 — hoje sempre "Em breve"
 */
export {};
