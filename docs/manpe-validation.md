# Evidência local — 17/11/2026

TypeScript estrito e builds independentes passaram em npm run build:sites. A suíte final passou 20 testes, zero falhas e zero skips, em Edge desktop 1440 × 960 e mobile 390 × 844 (MANPE_OFFLINE_QA=1 npm run test:sites -- --workers=2).

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
