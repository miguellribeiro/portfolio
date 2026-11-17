# SEO dos dois artefatos — 17/11/2026

Responsável pelos arquivos do build: Aristóteles. O recorte entregue é pt-BR, uma página por host; não autoriza publicação nem conclui equivalência de idiomas.

## Arquivos e hosts

scripts/sites-metadata.json define as identidades já usadas pelos apps: https://manpestudio.com.br/ para Studio e https://miguel.manpestudio.com.br/ para portfólio. O plugin scripts/site-seo.mjs injeta title, description, canonical, robots, Open Graph e Twitter no HTML compilado, antes do pré-render. Não depende de execução no navegador. Não anuncia hreflang nem locale alternativo sem páginas equivalentes.

Cada artifacts/<site>/ contém favicon.svg, favicon-32.png, apple-touch-icon.png, og.png, sitemap.xml, robots.txt, _headers, 404.html e 404.css. O SVG já existia nos dois apps; foi conferida sua cópia e resposta HTTP local, em vez de assumir ausência. PNGs de favicon/Apple preservam os assets existentes. As imagens sociais próprias têm 1200 × 630 e conteúdo distinto para marca e profissional. Os PNGs ficam versionados em apps/<site>/public; builds normais não precisam de Edge para gerá-los. scripts/generate-site-og.mjs é a ferramenta opcional de autoria com Edge e fontes locais, sem fonte externa.

O sitemap contém somente a raiz do próprio host. Não anuncia /en/, /es/, o outro host ou a página 404. A 404 é HTML estático sem JavaScript, sem meta refresh e sem canonical para a home; mantém noindex e link explícito à raiz do host correspondente.

## Preview e produção

O padrão é MANPE_INDEXING=preview: HTML contém noindex, nofollow e _headers contém X-Robots-Tag correspondente para /*. robots.txt permite crawling para que o robô consiga ler o noindex; robots não é controle de acesso e Disallow sozinho não garante retirada do índice. Não há garantia de remoção de índices já existentes nem proteção de acesso nesta implementação.

Para preparar localmente arquivos indexáveis, usar MANPE_INDEXING=production no comando de build. Nesse modo, o HTML da raiz contém index, follow e robots.txt anuncia o sitemap do próprio host. A 404 mantém noindex. Valores diferentes de preview/production são recusados. Essa opção só altera o artefato local e não constitui aprovação para release; o padrão final desta rodada foi restaurado para preview.

Referência Google: https://developers.google.com/search/docs/crawling-indexing/block-indexing.

## Contrato de hosting ainda a validar

Vite usa appType mpa: caminhos desconhecidos não devolvem a aplicação como SPA. O HTTP loopback confirmou favicon/PNG/OG com status 200 e tipos corretos, sitemap/robots acessíveis e /en, /en/, /en/index.html, /es, /es/, /es/index.html e /pagina-inexistente com status 404 nos dois previews.

O Vite preview não aplica o arquivo Cloudflare _headers nem associa automaticamente o corpo de 404.html às respostas de erro. O hosting deve servir a 404 personalizada com status HTTP 404 e aplicar os headers, sem regra catch-all para a home; isso precisa ser retestado nos destinos reais. Os arquivos estão preparados, mas wrangler.jsonc, DNS, roteamento e publicação atual não foram alterados. Infra mantém o contrato de release.

Referências Cloudflare: https://developers.cloudflare.com/workers/static-assets/headers/ e https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/.

## /en/ e /es/: bloqueio de equivalência

apps/studio/App.tsx e apps/portfolio/App.tsx ainda possuem conteúdo pt-BR; formulário, navegação e shell também permanecem em português. Os dois builds novos não geram /en/index.html ou /es/index.html. Não há tradução equivalente pronta, hreflang correspondente nem redirect dessas URLs para a raiz.

O legado continua gerando dist/en/index.html e dist/es/index.html com scripts/seo-heads.js, mas é a aplicação anterior com conteúdo comercial/profissional combinado. Não é equivalente aos dois apps novos. Seus arquivos não foram copiados como se fossem traduções dos apps separados.

O corte segue bloqueado: preservar os caminhos atuais no legado até entregar conteúdo e controles traduzidos, pré-render/hidratação por locale, canonical/hreflang/sitemap coerentes e regressões noJS/teclado/contato para cada idioma, ou decidir migração específica aprovada com destinos equivalentes. Não mapear idiomas para a raiz e não chamar o SEO desta fatia de SEO final da migração.

## Evidências e procedência

A rodada inicial no checkout principal executou build:sites em preview/production, oito verificações SEO em production e uma rodada final com 27 testes desktop e 27 mobile. Também executou um contrato estático local e quatro testes correspondentes. Essas alterações locais de contenção não pertenciam ao commit SEO; sua autoria não foi confirmada. Qin informou que seu harness usava uma cópia isolada. Não atribuir a ele as alterações locais nem a regravação observada dos artefatos.

Uma comparação inicial encontrou diferença de currentTime ao medir logo após pause(). O teste passou a aguardar animation.ready e exigir todas as animações pausadas antes de comparar os mesmos tempos após 90000ms simulados. O baseline de layout offscreen também aguarda a pausa e lê a geometria final antes de medir repouso. Não houve mudança no movimento de produção nem tolerância relaxada; seis repetições dirigidas passaram. Em outra ocorrência, um teste mobile não encontrou h1 e o mtime de artifacts/portfolio/index.html mudou dentro da janela da suíte. Isso não demonstra a causa, a autoria ou uma falha do pré-render; nem o resultado isolado 12/12 posterior comprova esse diagnóstico. Logs iniciais foram preservados.

## Reteste isolado do commit SEO

Exportado com git archive o commit a8421fdc18c6e1731073e2b7b09e65666f01a78d para diretório exclusivo reviews/seo-a8421fd-1794945516869/source, fora do checkout principal. npm ci --offline --ignore-scripts instalou o lock desse commit, sem incorporar arquivos locais de contenção. Ambiente: Node 24.15.0/npm 11.14.1/Edge. O fonte exportado foi inventariado antes da execução; após os testes, os hashes de todos os 160 arquivos do commit e dos 44 arquivos publicáveis de preview permaneceram iguais, com zero diferenças.

Nessa cópia isolada: build:sites passou em production e preview (tipos, cliente, SSR e pré-render). Os oito testes SEO passaram em production. A suíte completa preview passou 27 testes desktop e 27 mobile, total calculado de 54, sem falhas/skips/flaky. O HTTP loopback também passou nos dois sites; os limites sobre headers/template 404 no hosting permanecem os descritos acima. Nenhum outro build foi iniciado nessa cópia durante a suíte.

A auditoria online explícita npm audit --json retornou exit 1: quatro pacotes high, propagados do aviso picomatch. A mensagem de audit do npm ci --offline não foi usada como parecer. Esse reteste valida o commit SEO sem as alterações locais de contenção; não é reteste nem aprovação da mitigação de segurança proposta por outra entrega.

Recibo isolado em shared/manpe-seo-isolated-a8421fd: fonte do commit, hashes antes/depois, integrity.json, logs de instalação/build/audit/HTTP, relatórios Playwright e artefatos preview/production. Os OGs foram inspecionados visualmente na rodada de autoria; o reteste confirmou os PNGs versionados e suas dimensões.

Continua o bloqueio de picomatch descrito em dependency-security.md. Gates #2/#7/#8 e equivalência dos idiomas seguem abertos. PR continua rascunho; sem review formal, merge, deploy ou DNS.
