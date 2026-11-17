# Manpe — pacote de assets 1.0

Entrega da issue #3, Leonardo Da Vinci, 17/11/2026. SVGs autorais em paths simples, sem dependências de rede, fontes incorporadas, filtros, imagens raster, IDs ou scripts. Não é implementação do preloader nem do scheduler. A direção completa está no documento Manpe Studio — direção visual e storyboards.

## Integração

Copiar esta pasta para src/assets/manpe (ou caminho equivalente escolhido pelo frontend). Importar manpe-tokens.css uma vez e aplicar .manpe-scope no contêiner; tema explícito data-manpe-theme=dark ou light. Fontes usam as famílias já previstas no projeto, com fallback system-ui; não introduzir nova chamada de rede.

Para animar e herdar tokens, usar SVG inline/componentes JSX. No JSX converter style string para objeto, stroke-width para strokeWidth e os demais atributos SVG conforme React. data-part e aria-hidden permanecem iguais. Não usar innerHTML com conteúdo externo. Se usar img, passar alt vazio; cores serão os fallbacks escuros do arquivo, sem herança do tema. Não escolher img para os atores animados.

Arquivos: monkey.svg (200×200), capybara.svg (240×160), bird.svg (160×120), vegetation.svg (960×240). forest-static.svg é composição pronta para o estado estático. preview.html é uma prancha autocontida, não uma página de produção. logo-original.svg, quando presente, é snapshot do favicon publicado em https://manpestudio.com.br/favicon.svg; manter o mestre do repositório como fonte de verdade. Macaco da fauna NÃO é novo logo.

## Pivôs e wrappers

Coordenadas abaixo são unidades do viewBox do próprio asset. transform-box:view-box e transform-origin em px estão nos grupos móveis e no CSS. Não trocar por fill-box. A translação do ator usa wrapper EXTERNO; a pose usa grupos internos. Em forest-static, os grupos externos têm translate/scale de composição: preservar esses transforms e acrescentar outro wrapper para deslocar. Nunca resetar transforms de layout no movimento reduzido.

| Arquivo / data-part | Pivô | Movimento permitido |
| --- | --- | --- |
| monkey / swing | 118,18 | rotação a partir da mão; −12°, +7°, −3°, 0° |
| monkey / head | 92,92 | curiosidade até 6° |
| monkey / free-arm | 73,107 | alcance até 12° |
| monkey / tail | 74,123 | atraso de 80 ms, arco até 8° |
| monkey / eyes | 92,77 | piscar scaleY 1 → .15 → 1 |
| capybara / head | 158,79 | pastejo até 15°, focinho desce em direção à grama |
| capybara / jaw | 198,99 | duas mordidas de 2° |
| bird / body | 78,68 | pouso scaleY .94 → 1 |
| bird / wing | 91,59 | voo −18° → 18°; repouso 0° |
| vegetation / grass-a | 240,199 | scaleY 1 → .22 → 1 |
| vegetation / grass-b | 279,193 | idem, atraso de regeneração 180 ms |
| vegetation / grass-c | 312,190 | idem, atraso de regeneração 360 ms |

As patas separadas permitem troca de apoio; esta entrega não fixa ciclo de caminhada. Cada instância deve estar num SVG isolado ou namespacear data-part ao consultar dentro de sua ref. Não buscar grupos globalmente no document.

## Storyboards / contrato temporal

| Ator | Estados e duração | Condição de saída |
| --- | --- | --- |
| Entrada da marca | shell visível → espera opcional (>150 ms) → curiosidade 220 ms → acomodação 360–420 ms → header | prontidão real; nunca atrasar conteúdo pronto; limite visual de 1500 ms |
| Marca no header | logo mestre estático, slot 32 px reservado | sem repetição; resize acomoda imediatamente |
| Capivara | aproxima 1400 ms → baixa cabeça 500 ms → 2 mordidas de 350 ms → ergue 500 ms → sai 1900 ms | total 5000 ms; nova visita após 18–34 s ativos |
| Grama | mordida scaleY .22 em 200 ms → repouso 12–20 s → regenera em 900 ms | contar só tempo de cena ativa |
| Macaco | entra 1100 ms → balanços amortecidos 2000 ms → alcança 600 ms → sai 1300 ms | 5000 ms; nova visita após 24–45 s ativos |
| Pássaro | aproxima em arco 1000 ms → pousa 240 ms → repousa 1500 ms → decola 1100 ms | 3840 ms; nova visita após 12–27 s ativos |

Curva espacial de entrada do pássaro (normalizada no viewBox da cena): M1020 36 C960 0 900 12 900 85. Slot de pouso: pés em 900,85; ajustar wrapper para que pés locais 96,106 coincidam com o galho. Capivara: alinhar patas y=142 ao terreno; colocalizar focinho na pose baixa com grama (não simplesmente reproduzir posição do preview). Macaco: mão 118,18 deve coincidir com o galho em 584,68 antes de balançar. Preview estático já ancora esses pontos aproximadamente; calibração exata cabe ao layout final.

Deslocamentos: cubic-bezier(.22,1,.36,1). Sem path morph, filtros animados ou will-change permanente. Pausas começam ao fim de cada ação. Desktop: no máximo 2 ações de fauna simultâneas; mobile: 1. Adiar conflitos. Nada depende de hover.

## Pausa e movimento reduzido

Estado inicial sempre estático; o frontend habilita movimento após verificar prefers-reduced-motion, IntersectionObserver, document.visibilityState e pausa manual. aria-hidden=true e focusable=false nos SVGs; controles fora da cena. Botão real com texto Pausar animações/Retomar animações e aria-pressed=true quando pausado. A ação de pausa preserva progresso; não usar data-motion=static para pausa, pois static reseta poses.

CSS cobre animações CSS. WAAPI/Motion/timers exigem pause()/resume ou cancelamento pelo orquestrador. Guardar tempo restante usando relógio ativo; não disparar eventos acumulados ao voltar. Limpar observers/timers/animações no unmount. Ao ativar movimento reduzido, cancelar ações e exibir forest-static ou resetar somente grupos de pose. Sem JS, todos os SVGs e o conteúdo continuam visíveis. Sem controles de movimento na prancha porque ela é inteiramente estática.

## Layout e fallback

Mobile: corpo 16 px, título 40 px, margens 16 px, seção 64 px, cena 160 px. Desktop ≥768 px: título 72 px, margens 32 px, largura máxima 1120 px, seção 112 px, cena 240 px. Espaçamentos 8/16/24/32/48 px; cards 18 px, controles 12 px. Reenquadrar vegetação e atores no mobile; preservar proporções. Manter a fauna numa faixa própria abaixo dos links, com altura reservada, sem sobreposição ao conteúdo.

O CSS usa valores sólidos universais; color-mix é aprimoramento protegido por @supports e serve apenas a divisória decorativa. A ação mantém cor sólida. Se clamp, light-dark ou offset-path não existirem, nada depende deles. Trajetórias podem ser transforms calculados por keyframes; SVG continua estático quando não há engine. Não usar border decorativa como contorno de formulário.

Contraste: ver validation.json gerado por código para ambos os temas. Pares de texto normal, ação e foco contra fundo foram verificados para cores sólidas. Verde e fauna são decorativos. Estados finais sobre fotos, transparências, hover/erro, foco em todos os componentes e validação de performance real pertencem ao QA de integração.

## Validação e limites

SVGs examinados estruturalmente: XML válido, sem IDs duplicáveis, referências remotas ou scripts. Métricas exatas no validation.json. Orçamento da cena: até 120 elementos e 35 KB gzip; ver resultados gerados. Não declarar frames, acessibilidade completa, build do portfolio ou navegação validados por esta prancha. Aristóteles valida importação, build, temas, pausa, redução de movimento, recorte e logo original no repositório antes de encerrar integração.
