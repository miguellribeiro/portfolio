# Manpe — Portfólio de Miguel Ribeiro (PT/ES/EN)

Portfólio profissional em **Vite + React**, com renderização **orientada a dados**: todo o conteúdo
(textos, projetos, planos, ordem das seções, tema) vive em arquivos JSON. Adicionar, remover,
traduzir ou reordenar conteúdo **não exige mexer em componentes**.

> **v2 (MVP)**: conteúdo real da marca **Manpe** (Miguel Ribeiro — Líder Técnico & Desenvolvedor Full Stack),
> bento de diferenciais, projetos em trilho horizontal, "Como funciona", planos mensais por região e
> seletor de idioma próprio. Veja a seção [v2](#v2--manpe-mvp).

---

## 1. Visão e objetivos

- Ser a **porta de entrada para clientes e recrutadores**: em poucos segundos, transmitir quem eu sou,
  o que entrego e como contratar.
- Comunicar **maturidade, compromisso e qualidade** — no conteúdo e no próprio código (acessível,
  rápido, bem estruturado, fácil de manter).
- Ser **trilíngue** (pt-BR, es, en) desde o início.
- Servir de base para, futuramente, oferecer um **Test Drive** guiado dos sistemas que desenvolvo.

### Público
- **Clientes** (empresas/PMEs) buscando sistemas, ERPs, integrações e aplicações web.
- **Recrutadores e líderes técnicos** avaliando experiência, stack e qualidade.

---

## 2. Stack

- Vite 5 + React 18 (JavaScript), CSS puro com **CSS variables** (sem libs de UI).
- [`motion`](https://motion.dev) (`motion/react`, `LazyMotion` com `domMax` carregado sob demanda) para parallax, timeline, galeria e a pílula deslizante dos toggles (`layoutId`).
- Fontes auto-hospedadas via `@fontsource` (Bricolage Grotesque, Inter, JetBrains Mono, Instrument Serif).
- [`lenis`](https://lenis.darkroom.engineering) opcional (smooth scroll, carregado sob demanda).
- i18n próprio e leve (Context API), sem dependências extras.
- ESLint 9 (flat config).
- Deploy: **Cloudflare Workers** (static assets, `wrangler.jsonc`).

### Scripts
| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção em `dist/` |
| `npm run preview` | serve o build localmente |
| `npm run lint` | ESLint |

---

## 3. Arquitetura — motor de renderização

```
site.json ──► sections[] (ordem + enabled)
                 │
                 ▼
     PageRenderer ──► registry[type] ──► <Componente id=... />
                                             │
                    useI18n().t('chave') ◄───┘  (textos de locales/<idioma>.json)
```

1. `src/data/site.json` define as seções (`{ id, type, enabled }`) **na ordem em que aparecem**.
2. `src/engine/PageRenderer.jsx` percorre essa lista e, para cada `type`, busca o componente em
   `src/engine/registry.js`.
3. Cada componente em `src/sections/` lê **dados estruturais** (`site.json`, `projects.json`) e
   **textos** pelo `t()` do i18n.
4. `src/engine/validate.js` roda em modo dev e **avisa no console** sobre chaves de tradução
   ausentes, `type` desconhecido, projetos sem campos obrigatórios, etc.
5. Tipos do conteúdo estão documentados em JSDoc em `src/engine/types.js`.

### Decisão: onde ficam os textos?
**Separação estrutura × texto.**
- `projects.json`, `site.json → plansConfig` e `site.json → pricing` guardam só o que **não se traduz**
  (id, tags, status, imagens, links, preços por região, tipo de CTA).
- Todos os textos ficam em `locales/<idioma>.json`, **indexados pelo id** (`projects.items.<id>`,
  `plans.categories.<cat>.plans.<id>`).

Vantagem: para traduzir o site inteiro, basta um arquivo por idioma; o validador acusa o que faltar.

### Seções disponíveis (registry)
`hero`, `bento` (aliases `stats`, `counters`, `capabilities`, `skills`), `about`, `marquee`, `projects`,
`experience` (alias `timeline`), `testimonials` (desativada), `process` (alias `steps`), `plans` (alias `pricing`),
`contact`, `footer`.

---

## 4. Estrutura de pastas

```
portfolio/
├─ public/
│  ├─ favicon.svg
│  └─ projects/<project-id>/      # imagens de cada projeto (cover, gallery-N)
├─ src/
│  ├─ data/
│  │  ├─ site.json                # config compartilhada: tema, seções, contatos, planos, idiomas
│  │  ├─ projects.json            # projetos (dados estruturais)
│  │  └─ locales/{pt-BR,es,en}.json
│  ├─ engine/                     # registry, PageRenderer, loader, validação, tema, efeitos, tipos, region (preços)
│  ├─ i18n/                       # provider + hook useI18n
│  ├─ components/                 # Header, Wordmark, ListSelect/LanguageSelect/RegionSelect, Flag, ThemeToggle,
│  │                              # Section, Loader, Counter, Icon, SmartImage, Segmented, ChannelOverlay/Link, PlansCompare…
│  ├─ sections/                   # um componente por tipo de seção
│  ├─ hooks/                      # useCardFx, useMagnetic, usePlanCta, useMediaQuery
│  ├─ App.jsx  main.jsx  styles.css
├─ index.html  vite.config.js  eslint.config.js
└─ LICENSE  .editorconfig  .gitignore
```

---

## 5. Como editar o conteúdo (passo a passo)

### 5.1 Adicionar um projeto
1. Crie a pasta `public/projects/meu-projeto/` com `cover.webp` (e, se quiser, `gallery-1.webp`…).
2. Em `src/data/projects.json`, adicione:
   ```json
   {
     "id": "meu-projeto",
     "tags": ["React", "Node.js"],
     "status": "production",
     "confidential": false,
     "cover": "cover.webp",
     "gallery": ["gallery-1.webp"],
     "links": { "demo": "https://...", "repo": "" },
     "testDrive": { "enabled": false, "url": "" }
   }
   ```
   - `status`: `production` | `in-progress` | `archived` | `internal` ("Em produção · Uso corporativo") | `completed` ("Concluído").
   - `confidential: true` mostra o selo **Confidencial** (use sem links).
   - Links vazios não aparecem; com `gallery` vazia a capa não abre o lightbox.
   - A numeração "01", "02" é automática (ordem do array). O card final "Seu projeto aqui" é sempre o último.
3. Em **cada** `locales/*.json → projects.items`: `"meu-projeto": { "title", "description", "alt" }`.
   Tags traduzíveis: `projects.tags.<Tag>` (ex.: `"Arquitetura": "Architecture"`); sem entrada, a tag aparece como está.

### 5.2 Trocar as capas pelas prints reais
As capas atuais (`public/projects/sinapse/cover.svg`, `public/projects/bankup/cover.svg`) são **ilustrações
abstratas** — os sistemas são corporativos e não expõem telas. Para usar prints reais:
1. Capture em 1600×1000 ou 1200×750 (16:10), **com dados fictícios** (nunca dados de clientes/colaboradores).
2. Exporte em WebP (~80% de qualidade, até ~200 KB): `cwebp -q 80 print.png -o cover.webp`.
3. Salve em `public/projects/<id>/cover.webp` (+ `gallery-1.webp`, `gallery-2.webp`… se quiser galeria).
4. Atualize `cover` / `gallery` no `projects.json` e revise o `alt` nos 3 idiomas.
A capa fica escurecida/dessaturada por padrão e ganha cor no hover/foco — não é preciso editar a imagem.

### 5.3 Planos (abas, cards, comparativo, notas, FAQ)
Todos os planos são **mensais, pré-pagos, sem taxa de adesão**. Estrutura em `site.json → plansConfig`:

| Chave | O que faz |
|---|---|
| `categories[]` | abas (`sites`, `systems`): `{ id, priceKey, plans[], compare.groups[] }` |
| `categories[].plans[]` | `{ id, highlight, inherits, cta? }` — `highlight` = "Recomendado"; `inherits` = "Tudo do anterior +" |
| `compare.groups[]` | `{ id, rows: [{ id, values: { <planoId>: true \| false \| "price" \| "v:<id>" }, footnotes?: [1,2] }] }` |
| `customBand` | faixa "Sob Medida" (`cta.type`: whatsapp/email/url) |
| `trust` | ids da faixa de garantias → `plans.trust.<id>` |
| `footnotes` | notas ¹ ² exibidas sob a tabela → `plans.footnotes.<n>` |
| `disclaimer` | `true` exibe `plans.disclaimer` sob a tabela |
| `faq` | ids das perguntas → `plans.faq.<id>.{q,a}` |

Textos: `plans.categories.<cat>.{label, plans.<id>.{name, audience, features[]}}`, `plans.groups.<id>`,
`plans.rows.<id>.{label,tip}`, `plans.values.<id>`. Na tabela, `"price"` mostra a mensalidade da região.
O CTA abre o overlay e depois o WhatsApp com `contact.planMessage`
(`{category}`, `{plan}`, `{price}` = preço regional formatado).

### 5.3.1 Preços por região (`site.json → pricing`)
O preço **não depende do idioma** da interface, e sim da **região**:
1. escolha manual no seletor "Brasil · BRL" da seção Planos (salva em `localStorage` → `portfolio.region`);
2. senão, a primeira tag de `navigator.languages` cujo país esteja em `countries` (ex.: `es-MX` → MX, `en-GB` → EU, `es-PE` → LATAM);
3. senão, o idioma sem região em `languages` (`pt` → BR, `en` → US, `es` → LATAM, `de`/`fr`/`it`… → EU);
4. senão, `defaultRegion` (US).

```json
{ "id": "MX", "currency": "MXN", "locale": "es-MX", "flag": "MX",
  "countries": ["MX"], "languages": [],
  "sites": { "essencial": 499, "profissional": 999, "premium": 1899, "premiumPainel": 2999 },
  "sistemas": { "essencial": 2499, "profissional": 4499, "premium": 8499 },
  "domainFee": { "amount": 500, "currency": "MXN" } }
```
- Formatação: `Intl.NumberFormat(locale, { style: 'currency', currency })`, sem casas decimais.
- `domainFee` = taxa de transferência/registro do domínio em cancelamentos antes de 12 meses; entra no
  `{fee}` de `plans.domainClause` (nota ² e FAQ de cancelamento/domínio).
- Nome da região em `plans.region.names.<id>` (3 idiomas). Regiões fora do BRL mostram `plans.currencyNote`.
- **Argentina**: cobrada em USD (inflação). A tabela em ARS fica em `alternatives` com `enabled: false`;
  para ativar, copie os valores para `sites`/`sistemas`/`domainFee` e troque `currency` para `ARS`.
- Nova região: adicione o objeto em `pricing.regions`, o nome em `plans.region.names` e, se quiser, a bandeira em `components/Flag.jsx`.

| Região | Moeda | Sites (Ess./Prof./Prem./Prem.+Painel) | Sistemas (Ess./Prof./Prem.) | Taxa domínio |
|---|---|---|---|---|
| BR | BRL | 149 / 297 / 549 / 897 | 697 / 1.297 / 2.497 | 150 |
| US | USD | 49 / 99 / 199 / 299 | 249 / 499 / 899 | 50 |
| EU | EUR | 45 / 89 / 179 / 279 | 229 / 449 / 849 | 50 |
| MX | MXN | 499 / 999 / 1.899 / 2.999 | 2.499 / 4.499 / 8.499 | 500 |
| CL | CLP | 24.990 / 49.990 / 89.990 / 149.990 | 119.990 / 229.990 / 449.990 | 25.000 |
| CO | COP | 99.900 / 199.900 / 389.900 / 619.900 | 489.900 / 899.900 / 1.749.900 | 100.000 |
| AR | USD | 49 / 99 / 199 / 299 | 249 / 499 / 899 | 50 (alt. ARS 30.000, desativada) |
| LATAM | USD | 49 / 99 / 199 / 299 | 249 / 499 / 899 | 50 |

### 5.4 Adicionar ou traduzir um idioma
1. Copie `locales/pt-BR.json` para `locales/fr.json` e traduza.
2. Em `src/engine/content.js`: `import fr from '../data/locales/fr.json'` e inclua em `messages`.
3. Em `site.json → locales`: `{ "code": "fr", "label": "FR", "name": "Français" }` e, para a bandeira, um SVG em `components/Flag.jsx`.

### 5.5 Reordenar / ativar / desativar seções
Edite a ordem do array `site.json → sections` ou altere `enabled`. Ex.: para mostrar depoimentos,
`"testimonials" → "enabled": true`.

### 5.6 Alterar o tema
Veja a seção **Design system** abaixo (`site.json → theme` e `effects`).

### 5.7 Contatos
`site.json → contact`:
```json
{ "email": "miguelanperibeiro@gmail.com", "whatsapp": "5512991827172",
  "whatsappDisplay": "+55 12 99182-7172",
  "linkedin": "https://www.linkedin.com/in/miguel-antonio-pereira-ribeiro",
  "github": "https://github.com/miguellribeiro" }
```
- `whatsapp` só com dígitos (DDI + DDD + número); `whatsappDisplay` é o texto exibido/copiado.
- Mensagem pré-preenchida do WhatsApp: `contact.whatsappText`; assunto do e-mail: `contact.emailSubject`;
  mensagem dos planos: `contact.planMessage` (`{plan}`, `{billing}`, `{currency}`) — em cada idioma.
- Os canais aparecem na seção Contato (cards com copiar), no rodapé e no botão do cabeçalho.
- Ao clicar, um overlay do canal ("Abrindo WhatsApp…") aparece por ~700ms e então abre o link
  (Esc/Cancelar interrompe; "Abrir agora" abre na hora). Com movimento reduzido, abre direto.
  Se o navegador bloquear a nova aba, o link abre na própria página. Campos vazios ocultam o canal.

## 6. Design system

Direção visual **"Rosé & Wine"**: B2B profissional com personalidade — rosa/vinho, profundidade
(blobs, grade, grão, cards sobrepostos), tipografia expressiva e movimento sutil. Tudo em `src/data/site.json`.

### 6.1 Paleta (`theme.palette.light|dark`)
| Token | Light | Dark (rose-black) | Uso |
|---|---|---|---|
| `bg` | `#FFF7FA` | `#1A0B14` | fundo |
| `surface` / `surface2` | `#FFFFFF` / `#FFEFF5` | `#24111C` / `#2E1623` | cards / seções alternadas |
| `border` | `#F3CFDD` | `#3D1F2F` | bordas |
| `text` / `muted` | `#2A0F1E` / `#6B4458` | `#FCEAF2` / `#C9A3B6` | texto |
| `primary` / `onPrimary` | `#D81B60` / `#FFFFFF` | `#FF5FA2` / `#1A0B14` | preenchimento de botões, pílulas |
| `primaryText` | `#C2185B` | `#FF7AB3` | primária em texto (AA) |
| `secondary` | coral `#B4442A` | pêssego `#FFB38A` | texto de apoio |
| `accent` | berry `#7A1E4F` | orquídea `#E879B9` | detalhes |
| `highlight` / `onHighlight` | `#FF8A65` / `#2A0F1E` | `#F5C26B` / `#1A0B14` | CTA do plano recomendado |
| `success` | `#0F7A6C` | `#7FE3CF` | checks, status |
| `gradient` | `#C2185B → #D81B60 → #E5533D` | `#FF5FA2 → #FF7F8E → #FFB38A` | bordas; em texto **só em tamanhos grandes** |
| `mesh` / `meshOpacity` | `#FF6FA8 #FFB199 #F7A8D0` / `.22` | `#FF4F9A #8A1F55 #FF9E7A` / `.30` | blobs do hero |

Cada chave vira `--c-<chave-em-kebab>` (`primaryText` → `--c-primary-text`, `surface2` → `--c-surface2`),
`gradient` → `--grad`, `mesh` → `--mesh-1..3`; o `<meta name="theme-color">` acompanha o `bg`.
Todas as combinações de texto foram checadas para contraste **WCAG AA** nos dois temas.

### 6.2 Tipografia (`theme.fonts`)
- **Bricolage Grotesque** 600/700 — títulos · **Inter** 400/500 — corpo · **JetBrains Mono** — números,
  tags, preços · **Instrument Serif** itálico — apenas a palavra `[[destacada]]` do título do hero.
- Auto-hospedadas via `@fontsource` (subset latin, `font-display: swap`), importadas em `src/main.jsx`.
  Para trocar: instale `@fontsource/<fonte>`, troque o import e o nome em `theme.fonts`.

### 6.3 Efeitos (`effects`)
| Chave | Efeito |
|---|---|
| `loader` | wordmark Manpe: "M" desenhado (stroke) + revelação do texto + varredura + fade, ≤700ms, 1ª visita da sessão |
| `heroMesh` / `ambientBlobs` | blobs do hero / movimento lento 30–45s (pausa com aba oculta ou hero fora da tela) |
| `grain` / `bgGrid` | ruído SVG (~4%) e grade no hero |
| `headlineReveal` | título palavra por palavra com máscara (~40ms) + sublinhado em gradiente que cresce |
| `scrollReveal` | fade + 16px ao rolar (CSS scroll-driven com `@supports`; fallback IntersectionObserver) |
| `skeleton` | shimmer enquanto imagens carregam (aspect-ratio fixo, sem CLS) |
| `parallax` | camadas do hero (malha e texto; 40–80px) |
| `magnetic` | CTAs "magnéticos" (Ver projetos, Fale comigo, planos; máx. 7px) |
| `cardTilt` | inclinação 3D dos cards (máx. 6deg) — **desligado por padrão** |
| `cursorSpotlight` | brilho + borda em gradiente que seguem o cursor nos cards |
| `marquee` / `counters` | faixa de tecnologias / contagem animada |
| `dividers` | `"diagonal"` \| `"wave"` \| `"none"` |
| `smoothScroll` | Lenis (carregado só se ligado) — **desligado por padrão** |

Micro-interações fixas: gradiente que desliza nos botões + seta que avança, checks da tabela que se
redesenham no hover da linha, pílula deslizante nas abas (Sites/Sistemas, comparativo mobile).

**Movimento reduzido** (`prefers-reduced-motion`): `MotionConfig reducedMotion="user"` + CSS — sem loader,
blobs estáticos, skeleton estático, só fades simples, overlays de contato abrem o link na hora.

### 6.4 Contadores e tecnologias
- `site.json → stats`: `{ "id", "value", "decimals?", "prefix?", "suffix?" }`; rótulos em `stats.items.<id>`.
  O separador decimal segue o idioma (99,9% / 99.9%).
- `site.json → capabilities`: ids → `capabilities.items.<id>.{name, description}`.
- `site.json → bento.items`: `{ "ref": "stat:<id>" | "cap:<id>", "size": "sm" | "md" | "xl", "icon": "shield" }`
  (ícones em `components/Icon.jsx`). `xl` = caixa grande com brilho animado.
- `site.json → marquee.items`: nomes de tecnologias (não traduzidos); título em `marquee.title`.
- Título do hero: `hero.headline`; o trecho entre `[[ ]]` recebe o gradiente.
- Marca: `site.json → brand.name` + `components/Wordmark.jsx` (header, loader e rodapé) e `public/favicon.svg`.
  Para trocar o logo, altere só esses dois arquivos.

---

## 7. Estratégia de i18n

- Seletor de idioma próprio no cabeçalho (bandeira SVG + código): listbox ARIA com setas, Enter, Esc,
  typeahead, clique fora e retorno de foco. O mesmo componente (`ListSelect`) é usado no seletor de região.
- **Uma URL por idioma** (`site.json → locales[].path`): `/` (pt-BR), `/en/`, `/es/`. O idioma vem
  **só do caminho** (sem detecção pelo navegador), para o conteúdo nunca divergir do `<head>` da URL.
- Ao trocar, o seletor navega para a URL do idioma (mantendo a rolagem). Links antigos com `?lang=xx`
  redirecionam para `/xx/`. A região/preço continua independente do idioma.
- **SEO pré-renderizado** (`scripts/seo-heads.js`, plugin do Vite): o build gera `dist/index.html`,
  `dist/en/index.html` e `dist/es/index.html`, cada um com `<html lang>`, `title`/`description`
  (de `meta` no locale), canonical absoluto, `hreflang` (+ `x-default` → `/`), `og:*`, `twitter:*`
  e JSON-LD (Person + ProfessionalService). Nada disso é trocado via JS — crawlers e prévias de
  link não executam JS. `siteUrl`, `ogLocale` e `ogImage` ficam em `site.json`.
- `public/robots.txt` e `public/sitemap.xml` (com alternates `xhtml:link`) apontam para `siteUrl`.
- Assets do `index.html` com caminho absoluto (`/favicon.svg`), para funcionar também em `/en/` e `/es/`.
- Chave ausente → fallback para o idioma padrão + aviso no console (dev).

---

## 8. Roadmap

### Fase 1 — MVP ✅
Motor de renderização por JSON, i18n PT/ES/EN, tema claro/escuro, vitrine com galeria/lightbox,
planos, contato, validação de conteúdo, workflow de deploy.

### Redesign visual ✅
- **Fase A** ✅ tokens de tema via JSON, hero com mesh/grade/grão e gradiente no título, scroll reveal,
  cards com zoom/borda em gradiente/spotlight, contadores, marquee, divisores, plano recomendado em destaque,
  rótulos mono.
- **Fase B** ✅ `motion` (LazyMotion): parallax em camadas no hero com mockup de painel + cards flutuantes,
  timeline com cabeçalho sticky e progresso ligado ao scroll, animações da galeria, tilt e Lenis opcionais.
- **Fase C** ✅ paleta "Rosé & Wine", nova tipografia, loader com monograma, skeletons, blobs ambientes,
  título animado, micro-interações, títulos de seção sem duplicação, planos comparativos (toggle,
  tabela, garantias, FAQ) e contatos reais com overlay de abertura.

### v2 — Manpe (MVP) ✅
- **Identidade**: marca Manpe (wordmark SVG com "M" desenhado no loader, favicon M), títulos/meta novos.
- **Conteúdo real** nos 3 idiomas: hero, sobre, diferenciais, experiência, projetos Sinapse e Bankup; sem "(exemplo)".
- **Hero** mínimo e imersivo (malha animada, título gigante com destaque em brilho, CTAs magnéticos); mockup removido.
- **Bento** unindo números (contadores animados) e diferenciais.
- **Projetos** em trilho horizontal fixo no desktop (scroll vertical → horizontal) e swipe com scroll-snap no mobile/
  movimento reduzido; capa dessaturada que ganha cor no hover, tags que sobem em sequência, card "Seu projeto aqui".
- **Como funciona**: stepper de 4 etapas (sem prazos), avanço automático lento e pausável.
- **Planos** mensais pré-pagos com abas Sites/Sistemas, faixa Sob Medida, tabelas por categoria com notas ¹ ²,
  aviso de escopo, garantias e **preços por região** (BRL, USD, EUR, MXN, CLP, COP).
- **Cabeçalho**: seletor de idioma em dropdown, botão de tema com morph sol/lua centralizado.

### Próximos passos
- Prints reais (WebP, dados fictícios) no lugar das capas abstratas; OG image por idioma.
- Depoimentos reais (ativar `testimonials`).
- Domínio próprio (CNAME), `sitemap.xml`, `robots.txt`.
- Checkout/assinatura (Pix, boleto, cartão internacional) e página de termos/contrato.
- Estudos de caso detalhados (Sinapse, Bankup).

### Fase 2 — Conteúdo real + imagens + domínio
- Textos reais (bio, competências, experiência) nos 3 idiomas.
- Projetos reais com capturas de tela (sem expor dados de clientes; usar dados fictícios).
- Planos e preços definidos; CTAs reais (WhatsApp/e-mail/checkout).
- Deploy em produção + domínio próprio (CNAME), Open Graph image, `sitemap.xml`, `robots.txt`.

### Fase 3 — Test Drive
Aba/rota dedicada para **acesso limitado e guiado** aos sistemas desenvolvidos:
- **Contas demo** por projeto, com perfis de permissão restritos (somente leitura ou ações seguras).
- **Tours guiados** (passo a passo destacando funcionalidades-chave).
- **Dados sandbox** fictícios, recriados/resetados periodicamente; nunca dados reais.
- **Sessões com tempo limitado** (ex.: 30 min) e expiração automática.
- **Autenticação** leve (link mágico/e-mail ou formulário de solicitação) para controlar acesso e
  evitar abuso; rate limiting.
- **Analytics** de uso do demo (quais telas, tempo, conversão para contato).
- No portfólio: o campo `testDrive` de cada projeto passa de "Em breve" para um botão real.

### Fase 4 — Extras
- Blog / estudos de caso (cases) com MDX.
- Formulário de contato (Formspree, função serverless ou backend próprio) com anti-spam.
- Analytics com foco em privacidade (Plausible/Umami).
- CMS headless opcional (ex.: Decap, Sanity) mantendo o mesmo formato JSON.

---

## 9. Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/pt-br/) em pt-BR —
  `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `content:` (para mudanças só de conteúdo).
- **Branches**: `main` (produção, deploy automático), `feat/<nome>`, `fix/<nome>`, `content/<nome>`.
  Mudanças via Pull Request.
- Código: ESLint limpo, componentes pequenos, sem textos fixos no JSX (sempre via `t()`).

---

## 10. Deploy

### Cloudflare Workers (oficial: https://manpestudio.com.br)
Worker `manpestudio`, deploy a cada push na `main`. `wrangler.jsonc` publica `dist/` como static assets.
O `html_handling` padrão (`auto-trailing-slash`) já serve `/en/` → `dist/en/index.html`
(e redireciona `/en` e `/en/index.html` → `/en/`). Caminhos inexistentes → 404.
Teste local: `npm run build && npx wrangler dev` (sem login; requer Node 22+).

### GitHub Pages (migração concluída — fase 2)
O workflow de deploy do Pages foi removido. O último deploy publicado continua no ar com as páginas de
redirecionamento (canonical, meta refresh 0 e `location.replace` para a URL equivalente em `siteUrl`).
Para republicá-las, se preciso: `BASE_PATH=/portfolio/ node scripts/pages-redirect.js _pages`.

### Vercel
Importe o repositório; framework Vite; build `npm run build`; output `dist`. Não defina `BASE_PATH`.

---

## 11. Checklist de TODOs

- [x] Substituir todos os textos de exemplo (3 idiomas) — v2
- [x] Preencher `site.json → contact` com dados reais
- [x] Adicionar projetos reais; remover os projetos de exemplo
- [ ] Trocar as capas SVG por prints reais em WebP
- [x] Definir planos e preços reais por região
- [x] Deploy na Cloudflare (Worker `manpestudio`) e GitHub Pages só com redirecionamentos
- [x] Domínio próprio, OG image, sitemap e robots
- [x] Números reais em `site.json → stats`
- [ ] Revisar acessibilidade (Lighthouse) e performance
- [ ] Planejar Fase 3 (Test Drive)

## Licença
MIT — veja [LICENSE](LICENSE).
