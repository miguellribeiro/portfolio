# Evidência local — 17/11/2026

Na retomada após ee55275, TypeScript estrito e os dois builds pré-renderizados passaram em npm run build:sites. A suíte passou 46 testes (23 desktop e 23 mobile), zero falhas, skips ou flaky, em Edge 1440 × 960 e 390 × 844. Execução MANPE_OFFLINE_QA=1, workers=2, um projeto por vez. Relatórios locais: artifacts/resume-desktop.json e artifacts/resume-mobile.json. As medições de performance e os ensaios históricos abaixo mantêm seus recortes; não foram apresentados como novos perfis desta correção.

## Cobertura

- Conteúdo completo da #4 com trabalho/produto próprio identificado como homologação; isolamento profissional/comercial; temas, teclado, formulário e FAQ. Slot do mascote permanece à direita nas duas aplicações.
- #5: carregamento rápido, fontes retidas, timeout de 8 s, limite visual de 1,5 s, logo ausente, retry por recarga, continuação com fallback e movimento reduzido. Conteúdo permanece acessível e a mensagem fica numa faixa própria.
- #6: estados dos três atores, grama regenerada, simultaneidade, pausa manual/aba/offscreen, tempo restante preservado, limpeza ao alternar preferência, recriação no resize e apoios estáticos.

## Amostra de performance histórica (anterior à retomada)

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

Capturas revisadas em .impeccable/review (npm run test:sites e node scripts/review-manpe.cjs). Relatório completo: artifacts/motion-test-report.json; amostras também ficam nos anexos performance-sample do Playwright. Artefatos locais são ignorados pelo Git. Os pareceres independentes já emitidos e seus limites estão registrados na seção final; os retestes específicos desta retomada têm estado próprio. Nenhum merge ou deploy realizado.

## Correções após QA independente — PR #1

O status de recursos ocupa uma região do fluxo com 8rem reservados desde o primeiro render, com altura limitada e rolagem própria: carregamento, timeout e remoção deixam a geometria do main inalterada. O mascote continua decorativo. A continuação com fontes alternativas transfere foco para main antes de remover o botão, sem rolar a página; Tab segue para a primeira ação do conteúdo.

O cabeçalho móvel usa grid com prioridade explícita sobre o CSS base. Até 480 px, marca/mascote, tema e navegação ocupam linhas próprias. Marca com largura flexível, quebras de palavras longas, controles limitados ao contêiner e campos encolhíveis preservam o reflow sem esconder overflow. Regressões em tests/sites/layout.spec.ts verificam os dois sites a 320 px com texto normal e 200%, controles utilizáveis e status/timeout/foco; intro.spec.ts verifica também teclado após falha real do logo.

Ensaio complementar executado por HTTP loopback real, sem interceptação Playwright: node scripts/check-manpe-layout.cjs. Edge 157.0.4341.60, cache desativado, latência configurada de 150 ms, download/upload 200000 B/s e CPU 4×; viewports 1440 × 960 e 390 × 960. CLS calculado pela maior janela de sessão (intervalos menores que 1 s, janela até 5 s), excluindo entradas com interação recente. Uma navegação fria por combinação:

| Site | Viewport (px) | CLS | Largura do documento (px) |
| --- | --- | --- | --- |
| studio | 1440 × 960 | 0.025097 | 1440 |
| studio | 390 × 960 | 0.001455 | 390 |
| portfolio | 1440 × 960 | 0.001398 | 1440 |
| portfolio | 390 × 960 | 0.000617 | 390 |

As quatro amostras ficaram abaixo de 0,1. Reflow complementar via HTTP: ambos os sites a 320 × 960 mantiveram scrollWidth 320 px com font-size raiz 100% e 200%, sem elementos fora da largura da viewport. O status foi isolado nos testes de geometria com as fontes retidas; os CLS residuais acima incluem a troca de fontes. São amostras locais, não dados de campo nem certificação de dispositivos físicos.

Relatório bruto: artifacts/layout-http-report.json. Capturas: .impeccable/review/*-http-layout.png. A suíte completa final passou 40/40 testes com MANPE_OFFLINE_QA=1, workers=2, executados por projeto (desktop/mobile). Sem merge/deploy.

## Complemento: fallback sem JavaScript

Após a correção de reflow, o QA informou que o build anterior devolvia body vazio sem JS. Os dois builds agora pré-renderizam o próprio App, com hidratação progressiva. A suíte completa passou 36/36 testes, incluindo JavaScript desligado e módulo retido/liberado em desktop e mobile; verifica HTML preservado sem remount, ausência de erros de hidratação, navegação/FAQ nativos e disponibilidade correta dos controles.

No ensaio HTTP real, com JS desligado a 390 × 960: studio contém 1 h1, 11 SVGs e 4 grupos data-actor; portfolio contém 1 h1, 4 SVGs e 4 grupos data-actor. Tema permanece desabilitado nos dois e fieldset do formulário permanece desabilitado no studio; contato mailto continua no HTML. Ambos mantêm scrollWidth 390 px. HTML bruto também contém heading e bosque, sem depender de inspeção de DOM criado pelo cliente. Capturas adicionais *-no-js-http-forest.png. A tabela CLS acima foi atualizada para a amostra fria do build pré-renderizado.

O QA informou ainda ensaio próprio de StrictMode com cinco desmontagens/remontagens por largura, inclusive durante WAAPI do pássaro, sem timers/observers/listeners/animações após unmount. Esse ensaio independente não foi repetido nesta rodada; os testes de movimento existentes continuam aprovados. O parecer inicial de Platão sobre a abordagem usou 59d28bf. Ele posteriormente revisou a implementação em ee55275, sem impedimento arquitetural, conforme QA v3 e registro da #4. Isso não é aprovação de infraestrutura, endpoints ou release.

## Erro persistente sem foco encoberto

O QA encontrou controles totalmente encobertos pelo status fixo em 59d28bf. A região agora fica no fluxo, entre header e main, com block-size de 8rem desde o SSR, inclusive vazia e após a continuação. Os estados rolam internamente quando o texto ampliado exige mais altura, sem alterar a geometria do main ou sobrepor o conteúdo. Mensagem e ação visual foram encurtadas; a continuação mantém o nome acessível completo.

Regressão tests/sites/keyboard.spec.ts percorre a página inteira só com Tab, sem dispensar erro, nos dois sites em 390×844/100% e 320×844/200%, com movimento reduzido e favicon abortado. Verifica visibilidade por elementFromPoint sobre fragmentos de cada alvo (links inline podem quebrar linha), passagem por todo FAQ, contato/formulário e rodapé, além do alerta persistente e main sem deslocamento. Quatro testes passaram; os dados ficam nos anexos keyboard-persistent-error e capturas *-error-reserved.png. A suíte completa final passou 20 testes desktop e 20 mobile, total 40.

O ensaio HTTP real repetiu Tab com erro persistente em 390×844: todos os 33 alvos do studio e 13 do portfolio permaneceram visíveis. Também abortou o módulo cliente separadamente de desligar JS: ambos preservaram 1 h1, 4 grupos de atores, âncoras nativas e controles JS desabilitados; FAQ do studio abriu e formulário permaneceu inerte, com query vazia. Os dados keyboard/blockedModule/noJavaScript e a tabela CLS atualizada estão em artifacts/layout-http-report.json. Reflow permaneceu em 320 px; não há overflow escondido. Sem merge/deploy.

## Retomada: fronteiras de movimento e contato

Correções sobre ee55275: as três reduções da grama são aguardadas antes do repouso; mastigação continua concorrente para manter a duração do ator. A cauda usa delay 80 ms e duração 1920 ms. O handler do contato valida máximos de 100/254/2000 unidades UTF-16 antes do trim/codificação, além dos mínimos/formato existentes. Surrogates isolados geram mensagem associada por aria-describedby e foco no campo; pares válidos, acentos, emoji, árabe e chinês permanecem aceitos. O rascunho anterior é removido ao preparar uma entrada inválida. FAQ descreve preparação de mailto, abertura de WhatsApp e revisão/envio nos respectivos aplicativos; foram removidas garantias sem evidência de ofuscação, criptografia ou conformidade.

Regressão tests/sites/contact.spec.ts: valores programáticos acima dos três máximos, aceitação nos máximos, quatro formas de Unicode malformado em cada campo, recuperação com Unicode válido, codificação de parâmetros e texto verificável da FAQ, em desktop/mobile. FormData nativo normaliza USVString: para exercitar a defesa contra UTF-16 malformado o teste injeta o valor na leitura get(), sem alegar que a entrada nativa reproduz URIError. A suíte também mantém fallback sem JS, hidratação, foco e teclado com erro persistente. Capturas gerais studio-desktop/mobile revisadas nesta rodada.

node scripts/check-manpe-motion-boundaries.cjs passou dez cenários (cinco por largura). O harness empacota o próprio forestMotion.ts com esbuild e usa Edge/WAAPI nativo em SVG isolado, etapas mantidas e relógio virtual. Verifica que duas reduções concluídas não bastam, que conclusão da terceira durante pausa arma apenas espera suspensa, repouso mínimo de 12000 ms ativos com conservação do restante, delay/duração da cauda e descarte durante redução, microtask de conclusão, repouso e regeneração. Após descarte não surgem novas animações e as existentes somem. Relatório: artifacts/motion-boundaries-report.json. O limite do harness é elevado apenas para isolar as fronteiras; os limites reais 2/1 e integração React continuam cobertos por motion.spec.ts. Não é reprodução natural, teste de FPS, aba oculta real ou unmount React.

## Pareceres independentes e limites atuais

Fonte consolidada lida integralmente: Drive, “Manpe — revisão independente e gate QA #8 — 17/11/2026”, versão 3, id 01a1ea9c-e59b-7188-a1c3-694702745324, head ee55275. É a referência das verificações independentes anteriores; as execuções locais desta retomada estão identificadas acima.

- Platão: parecer da implementação ee55275 sem impedimento arquitetural, incluindo SSR/hidratação, builds separados e controles inertes antes dos handlers. Builds/tipos, 16 testes selecionados e HTTP próprios. Não aprova endpoints/infra/release.
- Leonardo: parecer de movimento sobre 1e24e51, sem P0/P1 no scheduler examinado; P2 repouso da grama e P3 atraso da cauda motivaram esta correção. QA ampliou ciclos naturais e desmontagens nos heads registrados em seu relatório. Reteste dirigido do delta deve identificar o novo head; não presumir aceite pela correção do autor.
- Qin: parecer de segurança versão 2 sobre 1e24e51, favorável somente à continuidade da homologação no recorte estático, sem crítico/alto encontrado. Máximos, Unicode e FAQ motivaram esta correção. Reteste dirigido deve identificar o novo head; #7 permanece em andamento, incluindo retenção e controles conforme a futura integração.
- Freud/QA v3: #5 concluída no recorte funcional; gate #8 não aprovado. Build/tipos e 40 testes próprios em ee55275, HTTP/reflow/foco/fallback confirmados; lifecycle natural e observação de fauna têm os heads históricos explicitados no relatório. Aba realmente oculta, celular físico, leitor de tela real, perfil completo/atribuição de long tasks e E2E da integração continuam sem fechamento.
- #2: contrato de publicação/rollback e acesso Cloudflare confirmados no relatório; hosts/destinos, HTTPS/redirects, previews públicos autorizados, SEO final, migração /en/ e /es/ e snapshot de retorno continuam dependências próprias. Somente artifacts/studio e artifacts/portfolio são publicáveis; artifacts/ssr é intermediário.

#4/#6 permanecem em revisão. Esta correção não conclui #7/#8 nem autoriza envio para review, merge, deploy ou DNS. O PR permanece rascunho.
