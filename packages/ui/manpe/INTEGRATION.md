# Integração do pacote #3

## Origem preservada

Os dez arquivos originais em assets/ foram comparados byte a byte com shared/manpe-assets em 17/11/2026: todos idênticos. O pacote declara autoria de Leonardo em seu README. O logo mestre existente no repositório permanece a fonte de identidade; o macaco da fauna é decorativo.

O commit 22addca30b20ec2f80bc1e8f0ad28da4606b6881 introduziu scripts/import-manpe-assets.py, Artwork.tsx, Forest.tsx, forest.css, forest.spec.ts e a integração em Shell.tsx. Sua identidade Git é Aristóteles; não há evidência suficiente para atribuir a escrita anterior de cada arquivo. Leonardo informou que não escreveu esse conjunto. Nada foi descartado durante a reconciliação. Veja docs/manpe-motion.md.

Execute python scripts/import-manpe-assets.py na raiz para regenerar o JSX a partir do pacote. É uma conversão de autoria; o cliente não faz parsing nem innerHTML. O script tem o caminho local do pacote de origem.

## Execução atual #5 / #6

Shell monta BrandIntro e Forest nos dois sites. BrandIntro aguarda fontes e decode do logo; usa um slot reservado de 32 px à direita, sem overlay ou bloqueio de foco. Erro/timeout oferecem recarga e continuação com fallback em faixa própria.

Forest conserva wrappers externos de layout e wrappers internos de deslocamento/pose. Mão do macaco (118,18) ancora em (584,68); pés do pássaro (96,106) ancoram em (900,85). Os transforms de composição sobrevivem à redução de movimento. Tokens são importados uma vez; tema é explícito.

ActiveScene controla o relógio ativo, timers restantes e progresso WAAPI. forestMotion define os três ciclos, grama e esperas independentes após conclusão, com limite 2 desktop / 1 mobile. Mudança de faixa do viewport reinicia a cena sem acumular ações. IntersectionObserver, visibilidade da aba e pausa manual suspendem timers/animações. Movimento reduzido mantém cena estática e desmonta o controlador. Os retornos dos effects limpam listeners, observers, timers e animações.

## Validação

TypeScript e ambos os builds passaram. A suíte final teve 36 testes aprovados em Edge a 1440 e 390 px. Testa conteúdo, teclado, temas, preloader, três ciclos, grama, pausa, visibilidade, redução de movimento e reinicialização. Evidências e limites em docs/manpe-validation.md.

A suíte usa interceptação Playwright (MANPE_OFFLINE_QA=1); o ensaio complementar em scripts/check-manpe-layout.cjs usa HTTP loopback real. Isso não valida DNS ou publicação. O pré-render estático dos dois builds mantém conteúdo e SVGs sem JavaScript; a hidratação preserva o HTML e habilita tema/formulário. As amostras locais não certificam FPS ou celular físico. Revisão independente de movimento/QA permanece etapa do planejamento. Não houve merge ou deploy.
