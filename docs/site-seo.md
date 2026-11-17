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

## Evidências desta rodada

build:sites passou em preview e production, com tipos, cliente, SSR e pré-render dos dois apps. O build local integrado também passou pelo novo contrato estático de segurança; quatro testes desse contrato passaram. As alterações de segurança são uma entrega própria em andamento e não são apresentadas como autoria do delta SEO.

Oito verificações SEO passaram em production. A rodada final de preview passou 27 testes desktop e 27 mobile, sem falhas/skips/flaky. scripts/check-site-seo-http.mjs registrou os contratos HTTP locais dos dois sites em artifacts/seo-gate/http.json. OGs foram inspecionados visualmente. Os resultados locais e os snapshots de metadados em production ficam em artifacts/seo-gate/.

Ocorrências preservadas nos logs: uma comparação inicial de pausa amostrou currentTime antes de a pausa WAAPI pendente concluir; o teste passou a aguardar animation.ready e exigir todas as animações pausadas antes de comparar os mesmos tempos após 90000ms simulados. O baseline de layout offscreen também aguarda a pausa e aplica a leitura final de geometria antes da medição de repouso. Não houve mudança no movimento de produção nem tolerância relaxada; seis repetições dirigidas passaram. Uma rodada mobile encontrou root vazio durante a regravação concorrente de artifacts/portfolio/index.html; a repetição SEO passou 12/12 e a suíte mobile completa posterior passou. Logs iniciais mantidos para não ocultar as ocorrências.

Continua o bloqueio de picomatch descrito em dependency-security.md. Gates #2/#7/#8 e equivalência dos idiomas seguem abertos. PR continua rascunho; sem review formal, merge, deploy ou DNS.
