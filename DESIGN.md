---
name: Ecossistema Manpe — fatia inicial
description: Ameixa e rosa, tipografia expressiva e conteúdo com respiro nas duas aplicações.
colors:
  dark-bg: "#1a0b14"
  dark-surface: "#24111c"
  dark-ink: "#fceaf2"
  dark-muted: "#c9a3b6"
  dark-accent: "#ff5fa2"
  dark-on-accent: "#1a0b14"
  dark-line-fallback: "#654451"
  dark-wash-fallback: "#34202b"
  light-bg: "#fff7fa"
  light-surface: "#ffeff5"
  light-ink: "#2a0f1e"
  light-muted: "#6b4458"
  light-accent: "#981345"
  light-on-accent: "#fff7fa"
  light-line-fallback: "#ab8092"
  light-wash-fallback: "#f5e4ec"
  adaptive-line: "color-mix(in srgb, var(--ink) 38%, var(--bg))"
  adaptive-wash: "color-mix(in srgb, var(--ink) 8%, var(--bg))"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3.4rem, 7vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-.035em"
  display-mobile:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.8rem, 10vw, 4.8rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-.035em"
  display-emphasis:
    fontFamily: "Instrument Serif, serif"
    fontWeight: 400
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.2rem, 4vw, 3.7rem)"
    lineHeight: 1.1
    letterSpacing: "-.035em"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "1.6rem"
    lineHeight: 1.2
    letterSpacing: "-.035em"
  project-title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "2.6rem"
    lineHeight: 1.2
    letterSpacing: "-.035em"
  body:
    fontFamily: "Inter, sans-serif"
    lineHeight: 1.7
  lead:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.15rem"
    lineHeight: 1.7
  navigation:
    fontFamily: "Inter, sans-serif"
    fontSize: ".875rem"
  price:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "2.7rem"
    fontWeight: 600
  summary:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
rounded:
  control: "6px"
  plan: "12px"
spacing:
  gap-small: "8px"
  gap-tag: "12px"
  gap-control: "16px"
  content-small: "20px"
  content: "24px"
  block: "32px"
  heading-bottom: "40px"
  column: "48px"
  section-mobile: "56px"
  hero-mobile-top: "64px"
  hero-mobile-bottom: "72px"
  section: "80px"
  hero-top: "100px"
  hero-bottom: "120px"
components:
  button-primary-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-on-accent}"
    rounded: "{rounded.control}"
    padding: "15px 22px"
  button-primary-light:
    backgroundColor: "{colors.light-accent}"
    textColor: "{colors.light-on-accent}"
    rounded: "{rounded.control}"
    padding: "15px 22px"
  button-hover-dark:
    backgroundColor: "{colors.dark-ink}"
    textColor: "{colors.dark-bg}"
  button-hover-light:
    backgroundColor: "{colors.light-ink}"
    textColor: "{colors.light-bg}"
  plan-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.plan}"
    padding: "32px"
  plan-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.plan}"
    padding: "32px"
  input-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.control}"
    padding: "14px"
    width: "100%"
  input-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.control}"
    padding: "14px"
    width: "100%"
---

# Design System: Ecossistema Manpe

## Overview

**Creative North Star: "Ameixa e rosa com respiro"**

A direção aprovada em `PRODUCT.md` combina fundos ameixa, acentos rosa, tipografia expressiva e curvas rasas. O sistema base usa blocos editoriais espaçosos, títulos com presença e texto de apoio mais discreto. A identidade herda as famílias tipográficas já instaladas e o símbolo existente do legado; não redefine a marca.

Este documento registra a base compartilhada da fatia #4, extraída de `packages/ui/tokens.css`, `packages/ui/Shell.tsx`, `apps/studio/App.tsx`, `apps/studio/ContactForm.tsx` e `apps/portfolio/App.tsx`, com limites de `PRODUCT.md` e `docs/dual-sites.md`. Os tokens do frontmatter descrevem essa base, sem incorporar o vocabulário separado de assets ou de cenas em integração. O estado é de homologação inicial: este registro não certifica assets finais, bosque, preloader ou produção.

As superfícies aplicam a mesma identidade com objetivos distintos: o studio tem modo **Persuade**, conduzindo à avaliação de serviços e planos; o portfólio tem modo **Experience**, apresentando projetos e trajetória profissional. São contextos de aplicação, não novos temas nem um modo global compartilhado. O código inicial do portfólio ainda começa por uma introdução tipográfica, sem hero de projeto visual.

**Key Characteristics:**
- Ameixa e rosa com versões explícitas escura e clara.
- Bricolage Grotesque expressiva, Inter para leitura e Instrument Serif itálica nos destaques do hero.
- Seções abertas com divisórias; superfícies preenchidas reservadas a planos e campos.
- Dois sites com conteúdo independente e elementos visuais compartilhados.

## Colors

A paleta alterna ameixa escura e papel rosado, mantendo o rosa como ação e ênfase.

### Primary

- **Rosa vivo** (`dark-accent`): ações, destaques itálicos, tags de projeto, caret, foco e curva do hero comercial no tema escuro.
- **Rosa profundo** (`light-accent`): os mesmos papéis no tema claro.
- **Contraste sobre ação** (`dark-on-accent`, `light-on-accent`): texto das ações preenchidas. No hover, o botão passa a tinta sobre fundo, conforme as variantes do frontmatter.

### Neutral

- **Ameixa de fundo / papel rosado** (`dark-bg`, `light-bg`): plano de fundo de toda a aplicação.
- **Ameixa elevada / rosa de superfície** (`dark-surface`, `light-surface`): planos comerciais e campos de formulário.
- **Tinta e texto de apoio** (`*-ink`, `*-muted`): contraste principal e hierarquia secundária.
- **Divisória e banho tonal** (`*-line-fallback`, `*-wash-fallback`): valores de compatibilidade. Em navegadores com suporte, `adaptive-line` e `adaptive-wash` substituem os fallbacks usando a tinta e o fundo do tema corrente; não são cores fixas independentes.

O shell começa escuro e o controle alterna o estado local entre claro e escuro; não há persistência implementada nessa base. `light-dark()` mantém os seis papéis principais ligados ao `color-scheme` explícito. A seleção de texto usa o rosa vivo e a ameixa escura nos dois temas.

**The Theme Roles Rule.** Preserve os papéis de fundo, superfície, tinta, apoio, ação, texto sobre ação, linha e banho nos dois temas; as amostras de compatibilidade não substituem a composição adaptativa quando suportada.

## Typography

**Display Font:** Bricolage Grotesque, fallback sans-serif. O shell importa os pesos 600 e 700.

**Body Font:** Inter, fallback sans-serif. O shell importa os pesos 400 e 500; controles herdam a família de texto.

**Emphasis Font:** Instrument Serif, fallback serif, com arquivo itálico de peso 400. Aparece em `em` dentro do título principal, herdando seu tamanho e recebendo a cor de ação. Não existe família mono dedicada na base #4.

### Hierarchy

- **Display** (`display`, `display-mobile`): título principal de peso 600, largura máxima de 16ch e margem inferior de 32px. O tamanho móvel entra no breakpoint compartilhado.
- **Headline** (`headline`): títulos de seção com largura máxima de 23ch e margem inferior de 40px. O CSS não declara peso próprio para h2/h3; usa o peso padrão do elemento.
- **Title** (`title`, `project-title`): títulos de artigos, planos e projetos; projetos recebem a variante maior.
- **Body** (`body`): parágrafos com largura máxima de 70ch e margem inferior de 20px. O tamanho do corpo não é sobrescrito por um token próprio.
- **Lead** (`lead`): apoio do hero, em tinta secundária e até 52ch.
- **Navigation** (`navigation`): navegação e texto miúdo compartilham tamanho compacto. Não há transformação geral para maiúsculas.
- **Price / summary** (`price`, `summary`): preço e pergunta do FAQ, ambos com Bricolage de peso 600. O sufixo de periodicidade volta a Inter de peso 400 e tamanho de 1rem.

Títulos usam entreletra negativa e balanceamento de linhas. A serifada cria contraste dentro do hero; não substitui as famílias de títulos ou leitura.

## Layout

O contêiner central tem largura máxima de 1200px e retira 64px da viewport. Até 800px, retira 40px. Cabeçalho e rodapé mantêm a mesma largura do conteúdo. O cabeçalho tem altura mínima de 108px; em telas menores ele quebra linhas e posiciona a navegação após a marca e o controle de tema.

O hero usa os espaçamentos superior e inferior do frontmatter, reduzidos no breakpoint. Seções têm divisória superior e espaçamento vertical próprio, também reduzido no móvel. Grades de artigos e projetos têm duas colunas iguais e intervalo de 48px; planos usam duas colunas com intervalo de 24px. Todas passam para uma coluna até 800px. A trajetória usa coluna de período de 220px e conteúdo flexível, com intervalo de 32px; no móvel vira uma coluna com intervalo de 8px.

Ações e tags quebram linha naturalmente. O formulário tem largura máxima de 720px. Os valores de `spacing` são recorrências e medidas extraídas do CSS, não uma escala abstrata nova: existem medidas específicas de controles e de pequenos afastamentos além delas.

## Elevation & Depth

A base é plana: não há box-shadow, gradiente, blur ou elevação animada nos componentes documentados. Fundo e superfície fornecem a separação tonal; linhas de 1px organizam seções, artigos, projetos, FAQ e trajetória. O rosa conduz o olhar sem criar uma terceira camada decorativa.

A única animação explícita da base é o desenho da curva SVG do hero comercial, em 1.4s com ease-out. A rolagem é suave; ambas as animações são removidas quando o visitante prefere movimento reduzido. Não há duração ou easing global de transições nos controles.

## Shapes

Controles e tags têm cantos discretos (`control`), enquanto planos usam o raio maior (`plan`). Seções, projetos e trajetória permanecem abertos e separados por linhas. Botões não são cápsulas; planos não possuem borda nem sombra declarada. A curva rasa do hero comercial é um traço SVG fino, não um recorte de seção.

## Components

### Buttons

A ação preenchida é direta: rosa com contraste sobre ação, peso 500, altura mínima de 48px e intervalo interno de 16px quando há seta. O hover troca para tinta com texto da cor do fundo. O foco visível usa contorno de ação de 3px afastado 5px. A base não define uma variante active ou disabled própria. Ações secundárias são links de texto, não um segundo botão preenchido.

O alternador de tema é transparente, com borda de linha de 1px, raio de controle e padding de 12px por 16px; hover aplica banho tonal. Sua descrição acessível informa o tema que será ativado.

### Cards / Containers

Planos comerciais usam superfície, raio de plano e padding de 32px, reduzido a 24px no móvel. Preço, lista e CTA seguem a mesma hierarquia em cada item. Não há plano destacado com decoração especial. Artigos de serviço e projetos usam linhas e espaço aberto, sem envoltório de card preenchido.

### Inputs / Fields

Campos e textarea têm largura total, superfície, borda de linha de 1px, raio de controle e padding de 14px. Labels ficam acima dos campos. Erros aplicam borda de ação, mensagem textual e associação acessível; o primeiro campo inválido recebe foco. Não existe estado disabled visual específico implementado.

O formulário prepara uma mensagem revisável no aplicativo de e-mail do visitante. O estado preparado usa banho tonal e texto explícito; não representa confirmação de envio.

### Navigation

Links simples com altura mínima de 44px, texto compacto e mudança para a cor de ação no hover. A lista quebra linha e ganha largura total na linha seguinte do cabeçalho móvel; não há menu hambúrguer, item ativo destacado ou cabeçalho fixo nessa base. O skip link aparece ao receber foco e leva ao conteúdo principal.

### Tags and project rows

Tags de stack são itens informativos com borda, raio de controle e padding de 12px por 18px, sem seleção nem clique. Tags de projeto são texto de ação separado por pontos médios. Projetos usam título e contexto em duas colunas no desktop e uma no móvel.

### FAQ

Perguntas usam details/summary nativos, divisória inferior e padding vertical de 20px. Summary tem padding vertical de 8px e a família expressiva; o marcador e os estados de abertura permanecem nativos.

## Do's and Don'ts

### Do:

- **Do** preserve a direção aprovada de ameixa e rosa, as fontes existentes e o símbolo herdado.
- **Do** use os mesmos papéis semânticos nos temas escuro e claro.
- **Do** mantenha foco visível, labels e mensagens de erro textuais, respeitando movimento reduzido.
- **Do** aplique as grades e o breakpoint existentes antes de criar uma nova regra de layout.
- **Do** trate studio e portfólio como superfícies independentes com a mesma linguagem visual.

### Don't:

- **Don't** apresente esta documentação da base #4 como identidade final, entrega de bosque/preloader ou autorização de produção.
- **Don't** transforme tags informativas em controles sem definir comportamento e acessibilidade.
- **Don't** acrescente sombras ou variantes de componentes como se já existissem no sistema documentado.
- **Don't** misture planos e assinatura na apresentação profissional do portfólio.
- **Don't** descreva a preparação local de e-mail como envio concluído.
