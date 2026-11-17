# Evidência local — 17/11/2026

TypeScript estrito e builds independentes passaram em npm run build:sites. A suíte final passou 36 testes, zero falhas e zero skips, em Edge desktop 1440 × 960 e mobile 390 × 844 (MANPE_OFFLINE_QA=1 npm run test:sites -- --workers=2).

## Cobertura

- Conteúdo completo da #4 com trabalho/produto próprio identificado como homologação; isolamento profissional/comercial; temas, teclado, formulário e FAQ. Slot do mascote permanece à direita nas duas aplicações.
- #5: carregamento rápido, fontes retidas, timeout de 8 s, limite visual de 1,5 s, logo ausente, retry por recarga, continuação com fallback e movimento reduzido. Conteúdo permanece acessível e a mensagem fica numa faixa própria.
- #6: estados dos três atores, grama regenerada, simultaneidade, pausa manual/aba/offscreen, tempo restante preservado, limpeza ao alternar preferência, recriação no resize e apoios estáticos.

## Amostra de performance

Amostra CDP de 300 ms ativa e 300 ms fora da tela. Leituras de geometria contam chamadas getBoundingClientRect/getBBox originadas no bundle, separando inspeções do Playwright. Timers são instrumentados.

| Site | Viewport (px) | Leituras JS na amostra ativa | Layouts nativos ativos | Tempo de layout (ms) | Layouts offscreen | Timers offscreen |
| --- | --- | --- | --- | --- | --- | --- |
| studio | 1440 × 960 | 0 | 19 | 1.126 | 0 | 0 |
| studio | 390 × 844 | 0 | 19 | 1.020 | 0 | 0 |
| portfolio | 1440 × 960 | 0 | 0 | 0.000 | 0 | 0 |
| portfolio | 390 × 844 | 0 | 1 | 0.044 | 0 | 0 |

SVG pode exigir layouts nativos para desenhar transforms: isso não é prova de composição exclusiva em GPU. A amostra verifica ausência de leituras de geometria por frame no código e de trabalho recorrente fora da tela. Alguns intervalos não capturaram frames ativos; os resultados não são medição de FPS ou certificação em celular físico. A suíte acelera o relógio de esperas e termina etapas WAAPI para cobrir estados, sem alterar os intervalos de produção. A limpeza testada usa o mesmo retorno de useEffect executado no unmount/remount; não é um ensaio separado de heap.

## Reprodução e limites

Os builds foram servidos por interceptação local Playwright, sem publicação ou chamadas aos domínios finais. Isso não valida rede, DNS ou Cloudflare. npm run test:sites sem MANPE_OFFLINE_QA continua disponível com previews Vite reais.

Capturas revisadas em .impeccable/review (npm run test:sites e node scripts/review-manpe.cjs). Relatório completo: artifacts/motion-test-report.json; amostras também ficam nos anexos performance-sample do Playwright. Artefatos locais são ignorados pelo Git. Validação visual de Leonardo e QA independente de Freud permanecem etapas do planejamento. Nenhum merge ou deploy realizado.

## Correções após QA independente — PR #1

O status de recursos passou para uma faixa fixa no canto inferior, com altura limitada e rolagem própria: carregamento, timeout e remoção deixam a geometria do main inalterada. O mascote continua decorativo. A continuação com fontes alternativas transfere foco para main antes de remover o botão, sem rolar a página; Tab segue para a primeira ação do conteúdo.

O cabeçalho móvel usa grid com prioridade explícita sobre o CSS base. Até 480 px, marca/mascote, tema e navegação ocupam linhas próprias. Marca com largura flexível, quebras de palavras longas, controles limitados ao contêiner e campos encolhíveis preservam o reflow sem esconder overflow. Regressões em tests/sites/layout.spec.ts verificam os dois sites a 320 px com texto normal e 200%, controles utilizáveis e status/timeout/foco; intro.spec.ts verifica também teclado após falha real do logo.

Ensaio complementar executado por HTTP loopback real, sem interceptação Playwright: node scripts/check-manpe-layout.cjs. Edge 157.0.4341.60, cache desativado, latência configurada de 150 ms, download/upload 200000 B/s e CPU 4×; viewports 1440 × 960 e 390 × 960. CLS calculado pela maior janela de sessão (intervalos menores que 1 s, janela até 5 s), excluindo entradas com interação recente. Uma navegação fria por combinação:

| Site | Viewport (px) | CLS | Largura do documento (px) |
| --- | --- | --- | --- |
| studio | 1440 × 960 | 0.033218 | 1440 |
| studio | 390 × 960 | 0.001455 | 390 |
| portfolio | 1440 × 960 | 0.001696 | 1440 |
| portfolio | 390 × 960 | 0.000617 | 390 |

As quatro amostras ficaram abaixo de 0,1. Reflow complementar via HTTP: ambos os sites a 320 × 960 mantiveram scrollWidth 320 px com font-size raiz 100% e 200%, sem elementos fora da largura da viewport. O status foi isolado nos testes de geometria com as fontes retidas; os CLS residuais acima incluem a troca de fontes. São amostras locais, não dados de campo nem certificação de dispositivos físicos.

Relatório bruto: artifacts/layout-http-report.json. Capturas: .impeccable/review/*-http-layout.png. A suíte completa final passou 36/36 testes com MANPE_OFFLINE_QA=1, workers=2. Sem merge/deploy.

## Complemento: fallback sem JavaScript

Após a correção de reflow, o QA informou que o build anterior devolvia body vazio sem JS. Os dois builds agora pré-renderizam o próprio App, com hidratação progressiva. A suíte completa passou 36/36 testes, incluindo JavaScript desligado e módulo retido/liberado em desktop e mobile; verifica HTML preservado sem remount, ausência de erros de hidratação, navegação/FAQ nativos e disponibilidade correta dos controles.

No ensaio HTTP real, com JS desligado a 390 × 960: studio contém 1 h1, 11 SVGs e 4 grupos data-actor; portfolio contém 1 h1, 4 SVGs e 4 grupos data-actor. Tema permanece desabilitado nos dois e fieldset do formulário permanece desabilitado no studio; contato mailto continua no HTML. Ambos mantêm scrollWidth 390 px. HTML bruto também contém heading e bosque, sem depender de inspeção de DOM criado pelo cliente. Capturas adicionais *-no-js-http-forest.png. A tabela CLS acima foi atualizada para a amostra fria do build pré-renderizado.

O QA informou ainda ensaio próprio de StrictMode com cinco desmontagens/remontagens por largura, inclusive durante WAAPI do pássaro, sem timers/observers/listeners/animações após unmount. Esse ensaio independente não foi repetido nesta rodada; os testes de movimento existentes continuam aprovados. A arquitetura do pré-render foi encaminhada a Platão para revisão; não constitui autorização de release.
