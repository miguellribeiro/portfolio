# Execução de movimento #5 / #6

Contrato adotado antes da implementação em 17/11/2026: packages/ui/manpe/assets/README.md, seções Storyboards e Pausa. A entrega de Leonardo é o pacote de assets; a integração anterior está em 22addca.

## Entrada

Shell e conteúdo visíveis desde o primeiro render. O mascote ocupa slot fixo de 32 px no canto direito do header. Recursos críticos explícitos: decode da imagem mestre do header e document.fonts.ready (fontes usadas pelo shell). Depois de 150 ms de espera real, o mascote aparece em destaque decorativo, sem overlay, captura de foco ou bloqueio de cliques. Curiosidade de 220 ms e acomodação de até 420 ms; recurso pronto interrompe a curiosidade imediatamente. Não esperar ciclo mínimo. Limite visual 1500 ms desde a montagem; após isso o mascote acomoda e somente o status local permanece. Timeout de recursos: 8000 ms. Falha oferece Tentar novamente e Continuar com fontes alternativas; conteúdo permanece disponível. Resize encerra a viagem no slot. Navegação repetida não repete uma espera já resolvida. Movimento reduzido: mascote estático no slot, mantendo feedback de carregamento/erro.

## Bosque

Capivara 5000 ms (aproxima 1400, baixa 500, mastiga 700, ergue 500, sai 1900); espera independente 18–34 s ativos após concluir. Grama reduz em 200 ms, espera 12–20 s ativos e regenera 900 ms (moitas b/c com 180/360 ms de atraso).

Macaco 5000 ms (entra 1100, balança 2000, alcança 600, sai 1300); espera 24–45 s ativos após concluir. Pássaro 3840 ms (aproxima 1000, pousa 240, repousa 1500, sai 1100); espera 12–27 s ativos após concluir. Primeira espera segue as mesmas faixas. Limite 2 atores desktop / 1 mobile; conflitos são adiados. Depois de pausa não há recuperação de ações vencidas.

Controle comum de atividade: IntersectionObserver, visibilidade da aba, preferência de movimento e pausa manual. Pausa conserva tempo restante e progresso WAAPI; desmontagem cancela timers, animações e observadores. Reduced motion restaura apenas poses/deslocamentos internos, preservando transforms de layout. Animação usa transform/opacity; não há leituras de layout por frame nem setInterval.

## Procedência

O checkout estava limpo em 22addca30b20ec2f80bc1e8f0ad28da4606b6881 e o remoto apontava para o mesmo commit. Esse commit contém o importador, Artwork, Forest, CSS, testes e integração no Shell. Seu autor Git é Aristóteles; não há evidência adicional que identifique quem escreveu cada arquivo antes do commit. Não atribuir essa integração a Leonardo. Os dez arquivos de assets foram comparados com shared/manpe-assets e são idênticos byte a byte. A autoria declarada do pacote de assets é Leonardo (README original); os originais permanecem preservados. As mudanças de conteúdo, movimento e testes posteriores são realizadas nesta continuidade por Aristóteles.
