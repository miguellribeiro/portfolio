# Portfólio — orientado a dados (PT/ES/EN)

Portfólio profissional em **Vite + React**, com renderização **orientada a dados**: todo o conteúdo
(textos, projetos, planos, ordem das seções, tema) vive em arquivos JSON. Adicionar, remover,
traduzir ou reordenar conteúdo **não exige mexer em componentes**.

> ⚠️ Todo o conteúdo atual é **exemplo/placeholder** ("Seu Nome", "Projeto Exemplo", preços zerados).
> Substitua antes de publicar oficialmente.

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
- Deploy estático: **GitHub Pages** (workflow incluso) ou **Vercel**.

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
- `projects.json` e `site.json → plans` guardam só o que **não se traduz** (id, tags, status,
  imagens, links, preços por moeda, tipo de CTA).
- Todos os textos ficam em `locales/<idioma>.json`, **indexados pelo id** (`projects.items.<id>`,
  `plans.items.<id>`).

Vantagem: para traduzir o site inteiro, basta um arquivo por idioma; o validador acusa o que faltar.

### Seções disponíveis (registry)
`hero`, `stats` (alias `counters`), `about`, `capabilities` (alias `skills`), `marquee`, `projects`, `experience` (alias `timeline`),
`testimonials` (desativada por padrão), `plans` (alias `pricing`), `contact`, `footer`.

---

## 4. Estrutura de pastas

```
portfolio/
├─ .github/workflows/deploy.yml   # build + deploy GitHub Pages
├─ public/
│  ├─ favicon.svg
│  └─ projects/<project-id>/      # imagens de cada projeto (cover, gallery-N)
├─ src/
│  ├─ data/
│  │  ├─ site.json                # config compartilhada: tema, seções, contatos, planos, idiomas
│  │  ├─ projects.json            # projetos (dados estruturais)
│  │  └─ locales/{pt-BR,es,en}.json
│  ├─ engine/                     # registry, PageRenderer, loader, validação, tema, efeitos, tipos
│  ├─ i18n/                       # provider + hook useI18n
│  ├─ components/                 # Header, Section, Loader, SmartImage, Segmented, ChannelOverlay/Link, PlansCompare…
│  ├─ sections/                   # um componente por tipo de seção
│  ├─ hooks/                      # useCardFx, useMagnetic, usePlanCta
│  ├─ App.jsx  main.jsx  styles.css
├─ index.html  vite.config.js  eslint.config.js
└─ LICENSE  .editorconfig  .gitignore
```

---

## 5. Como editar o conteúdo (passo a passo)

### 5.1 Adicionar um projeto
1. Crie a pasta `public/projects/meu-projeto/`.
2. Adicione `cover.webp` e `gallery-1.webp`, `gallery-2.webp`… (veja o README dentro de cada pasta).
3. Em `src/data/projects.json`, adicione:
   ```json
   {
     "id": "meu-projeto",
     "tags": ["React", "Node.js"],
     "status": "production",
     "cover": "cover.webp",
     "gallery": ["gallery-1.webp", "gallery-2.webp"],
     "links": { "demo": "https://...", "repo": "" },
     "testDrive": { "enabled": false, "url": "" }
   }
   ```
   `status`: `production` | `in-progress` | `archived`. Links vazios não são exibidos.
4. Em **cada** `locales/*.json`, em `projects.items`, adicione:
   ```json
   "meu-projeto": { "title": "...", "description": "...", "alt": "Descrição da imagem" }
   ```
5. `npm run dev` e confira o console (o validador aponta o que faltar).

### 5.2 Adicionar/trocar imagens
- Formato WebP, ~1200×750 (16:10), até ~200 KB.
- Nomes: `cover.webp`, `gallery-1.webp`, `gallery-2.webp`…
- Atualize `cover`/`gallery` no `projects.json`. Os `.svg` atuais são placeholders.

### 5.3 Planos (cards, toggle, comparativo e FAQ)
**Cards** — `site.json → plans` (formato antigo continua válido: `prices` = preço por projeto):
```json
{ "id": "sistema", "highlight": true, "inherits": true,
  "prices": { "BRL": 12000, "USD": 2800, "EUR": 2600 },
  "pricesMonthly": { "BRL": 1200, "USD": 280, "EUR": 260 },
  "cta": { "type": "whatsapp" } }
```
- `highlight`: card "Recomendado" (borda em gradiente, scale 1.02, CTA de destaque).
- `inherits`: mostra "Tudo do anterior +" antes dos itens.
- `prices`/`pricesMonthly`: preço "a partir de" por moeda. Se o modo escolhido não existir, mostra o
  outro com o período certo ("cobrança mensal"). Sem nenhum dos dois → "Proposta sob medida".
- `cta.type`: `whatsapp` (abre o overlay e depois o WhatsApp com plano + modo + moeda) | `email` | `url` (com `href`).
- Textos em `locales/*.json → plans.items.<id>`: `name`, `audience`, `features[]`, `cta`.
- A moeda vem de `currency` em cada idioma (pt-BR → BRL, es/en → USD); a nota "Valores em …" é automática.

**`site.json → plansConfig`**
| Chave | O que faz |
|---|---|
| `billing` | `{ "default": "project", "options": ["project", "monthly"] }` — toggle Projeto/Mensal |
| `examplePrices` | `true` exibe "Valores de exemplo — a definir." (**desligue quando os preços forem reais**) |
| `trust` | ids da faixa de garantias → `plans.trust.<id>` |
| `compare.categories[]` | `{ id, rows: [{ id, values: { <planoId>: true \| false \| "v:<id>" } }] }` → rótulos em `plans.categories.<id>`, `plans.rows.<id>.{label,tip}`, textos em `plans.values.<id>` |
| `faq` | ids das perguntas → `plans.faq.<id>.{q,a}` |

Valores na tabela: `true` = check, `false` = "—", `"v:w2_4"` = `plans.values.w2_4` (traduzido).
O validador (dev) avisa sobre plano inexistente na tabela, chaves `v:` sem tradução, etc.

### 5.4 Adicionar ou traduzir um idioma
1. Copie `locales/pt-BR.json` para `locales/fr.json` e traduza.
2. Em `src/engine/content.js`: `import fr from '../data/locales/fr.json'` e inclua em `messages`.
3. Em `site.json → locales`: `{ "code": "fr", "label": "FR", "name": "Français", "flag": "🇫🇷" }`.

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
| `loader` | monograma `brand.monogram` desenhado (stroke) + varredura + fade, ≤700ms, 1ª visita da sessão |
| `heroMesh` / `ambientBlobs` | blobs do hero / movimento lento 30–45s (pausa com aba oculta ou hero fora da tela) |
| `grain` / `bgGrid` | ruído SVG (~4%) e grade no hero |
| `headlineReveal` | título palavra por palavra com máscara (~40ms) + sublinhado em gradiente que cresce |
| `scrollReveal` | fade + 16px ao rolar (CSS scroll-driven com `@supports`; fallback IntersectionObserver) |
| `skeleton` | shimmer enquanto imagens carregam (aspect-ratio fixo, sem CLS) |
| `parallax` | camadas do hero (blobs, mockup e cards flutuantes; 30–60px) |
| `magnetic` | CTA principal "magnético" (máx. 4px) |
| `cardTilt` | inclinação 3D dos cards (máx. 6deg) — **desligado por padrão** |
| `cursorSpotlight` | brilho + borda em gradiente que seguem o cursor nos cards |
| `marquee` / `counters` | faixa de tecnologias / contagem animada |
| `dividers` | `"diagonal"` \| `"wave"` \| `"none"` |
| `smoothScroll` | Lenis (carregado só se ligado) — **desligado por padrão** |

Micro-interações fixas: gradiente que desliza nos botões + seta que avança, checks da tabela que se
redesenham no hover da linha, pílula deslizante nos toggles (idioma, Projeto/Mensal, abas).

**Movimento reduzido** (`prefers-reduced-motion`): `MotionConfig reducedMotion="user"` + CSS — sem loader,
blobs estáticos, skeleton estático, só fades simples, overlays de contato abrem o link na hora.

### 6.4 Contadores e tecnologias
- `site.json → stats`: `{ "id", "value", "decimals?", "prefix?", "suffix?", "example": true }`;
  rótulos em `locales/*.json → stats.items.<id>`. Com `example: true` aparece o aviso `stats.note`.
  **Os números atuais são de exemplo.**
- `site.json → marquee.items`: nomes de tecnologias (não traduzidos); título em `marquee.title`.
- Título do hero: `hero.headline`; o trecho entre `[[ ]]` recebe o gradiente.
- Mockup do painel (hero): textos em `hero.mockup` — ilustrativo, sem dados reais.

---

## 7. Estratégia de i18n

- Seletor **PT / ES / EN** sempre visível no cabeçalho (`aria-pressed` indica o ativo).
- Ordem de detecção: `?lang=` na URL → `localStorage` → idioma do navegador → `defaultLocale`.
- Ao trocar, o idioma é salvo e a URL é atualizada com `?lang=` (link compartilhável).
- SEO por idioma: `<html lang>`, `title`, `description` e `og:*` vêm de `meta` em cada locale.
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

### GitHub Pages
O workflow `.github/workflows/deploy.yml` roda lint + build a cada push na `main` e publica `dist/`.
O `base` do Vite é definido por `BASE_PATH=/<nome-do-repo>/` no workflow.
**Necessário uma vez**: em *Settings → Pages → Build and deployment*, selecionar **GitHub Actions**.

### Vercel
Importe o repositório; framework Vite; build `npm run build`; output `dist`. Não defina `BASE_PATH`.

---

## 11. Checklist de TODOs

- [ ] Substituir "Seu Nome" e todos os textos de exemplo (3 idiomas)
- [x] Preencher `site.json → contact` com dados reais
- [ ] Adicionar projetos reais e imagens WebP; remover os projetos de exemplo
- [ ] Definir planos e preços reais e desligar `plansConfig.examplePrices`
- [ ] Ativar GitHub Pages (fonte: GitHub Actions) ou conectar Vercel
- [ ] Domínio próprio, OG image, sitemap e robots
- [ ] Substituir os números de exemplo em `site.json → stats`
- [ ] Revisar acessibilidade (Lighthouse) e performance
- [ ] Planejar Fase 3 (Test Drive)

## Licença
MIT — veja [LICENSE](LICENSE).
