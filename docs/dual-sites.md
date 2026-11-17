# Fatia vertical #4

## Executar

```sh
npm ci
npm run dev:studio
npm run dev:portfolio
```

As aplicações usam portas 5174 e 5175. Cada comando pode rodar em um terminal.

```sh
npm run build:sites
npm run test:sites
```

`build:sites` faz a checagem estrita de TypeScript e gera `artifacts/studio` e `artifacts/portfolio`. Os testes usam o Microsoft Edge instalado, sob Playwright, nas larguras 1440 e 390. As capturas ficam em `.impeccable/review/`.

Previews: `npm run preview:studio` (4174) e `npm run preview:portfolio` (4175). Esses endereços são locais; não foram publicados.

## Fronteiras

- `apps/studio/content.ts`: serviços, quatro planos Brasil com herança explícita, FAQ e contatos comerciais, migrados dos dados existentes. Trabalhos/produtos descrevem o próprio ecossistema verificável, em homologação.
- `apps/portfolio/content.ts`: projetos Sinapse/Bankup, histórico e stack, sem importar preços ou conteúdo comercial.
- `packages/ui`: somente tipos de apresentação, shell e tokens; nenhum catálogo de conteúdo compartilhado.
- `vite.sites.config.ts`: escolhe a aplicação no build. Não usa hostname nem parâmetros no navegador para misturar as duas páginas.
- Links entre sites apontam explicitamente aos domínios finais; não simulam uma publicação local.
- O formulário não possui endpoint. Valida campos, foca o primeiro erro e prepara um link `mailto:` para revisão do visitante. Não declara envio concluído.

`npm run build`, `vite.config.js`, `wrangler.jsonc` e o frontend legado continuam funcionando. A troca da publicação deve ser feita por Infra/DevOps após o contrato #2 e aprovação. Não apontar o Worker atual para a raiz de `artifacts`, que contém duas aplicações distintas.

## Validação e limites

Os testes verificam foco do skip link, âncoras de navegação, tema computado, largura sem overflow, erros de execução, formulário inválido/válido, FAQ, ausência de preços no portfólio e ausência da trajetória no comercial.

As páginas novas começam em pt-BR/BRL. Os idiomas e preços internacionais continuam disponíveis no legado e não foram migrados nesta fatia. As páginas novas têm títulos, descrição e canonical próprios, mas ainda precisam de SEO final, pré-renderização, sitemap e metadados sociais antes da publicação. `robots.txt` impede rastreamento dos previews; revisar esse arquivo na preparação de produção.

Conteúdo da fatia: trabalho próprio e produto Ecossistema web Manpe, identificados como homologação. Cases de clientes só entram com fonte e autorização específicas. Procedência, preloader e bosque: docs/manpe-motion.md. Pendente de revisão independente: fronteiras por Platão, movimento por Leonardo, QA/perfil mobile por Freud, endpoints #7 e QA de publicação #8. Contribuições profissionais usam apenas fatos presentes no histórico existente, sem métricas ou certificações adicionais.

## Movimento e evidências

Contrato e procedência em docs/manpe-motion.md; resultado dos testes e limites da medição em docs/manpe-validation.md. Para testar os builds sem portas locais, definir MANPE_OFFLINE_QA=1 antes de npm run test:sites. node scripts/review-manpe.cjs gera capturas dos builds usando o Edge instalado.
