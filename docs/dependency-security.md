# Dependências de build — 17/11/2026

Delta sobre c6aa8889bfb23d29d77a304523aa0d98a943c09f, na branch do PR #1 (rascunho).

## Correção aplicada

package.json exige vite ^6.4.6; package-lock.json fixa Vite 6.4.6 e esbuild 0.25.12. A instalação anterior tinha Vite 5.4.21 e esbuild 0.21.5. Executado npm install --save-dev vite@^6.4.6, sem audit fix --force, overrides ou exclusões de avisos.

O plugin React instalado (@vitejs/plugin-react 4.7.0) declara suporte a Vite 6. npm ls vite esbuild @vitejs/plugin-react não apontou conflito. Ambiente validado: Node 24.15.0 e npm 11.14.1. Vite 6 declara Node ^18.0.0 || ^20.0.0 || >=22.0.0.

A linha 6.4 preserva Rollup/esbuild e o contrato de configuração existente. 6.4.6 também é a correção indicada pelo upstream para GHSA-p4f5-76q4-ffq7, publicado em 10/11/2026; portanto não usar versões anteriores apenas para reduzir a contagem do audit.

Fontes: https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7 e https://github.com/advisories/GHSA-67mh-4wv8-2f99. Metadados e versões conferidos no registro npm nesta rodada.

## Validação executada

- npm run build:sites: tipos estritos, builds cliente/SSR e pré-render dos dois sites aprovados.
- HTML final de studio e portfolio contém h1 e manpe-scene; nenhum root vazio. Publicáveis continuam artifacts/studio e artifacts/portfolio; artifacts/ssr continua intermediário.
- npm run build: legado aprovado.
- MANPE_OFFLINE_QA=1 npm run test:sites -- --project=desktop --workers=2 --reporter=json: 23 aprovados.
- Mesmo comando com --project=mobile: 23 aprovados. Total calculado dos relatórios: 46; sem falhas, skips ou flaky.
- node scripts/check-manpe-motion-boundaries.cjs: dez cenários aprovados, incluindo o empacotamento pelo novo esbuild. Mantêm-se os limites do harness descritos em manpe-validation.md.

Logs e relatórios locais: artifacts/dependency-gate/ (build-sites.log, build-legacy.log, desktop.json, mobile.json, motion.log e audit.log). Relatório dirigido adicional: artifacts/motion-boundaries-report.json. O modo offline serve os artefatos ao Edge; não substitui teste de preview público.

## Bloqueio remanescente: picomatch

npm audit --json continua retornando exit 1: quatro pacotes classificados como high (picomatch e os caminhos transitivos fdir, tinyglobby e vite), todos ligados a GHSA-fc5q-39xc-vjpf. Isso não representa quatro falhas independentes. Os avisos anteriores de esbuild e do próprio código Vite já não aparecem nesse resultado.

A árvore agora contém picomatch 4.0.7, fdir 6.5.0 e tinyglobby 0.2.17. O registro npm consultado oferece picomatch 4.0.7 como versão mais recente. O advisory revisado/atualizado em 17/11/2026 declara versões <=4.0.7 afetadas e nenhuma versão corrigida: https://github.com/advisories/GHSA-fc5q-39xc-vjpf.

Não aplicar a sugestão automática de voltar a Vite 6.2.7: ela reabre avisos Vite já corrigidos. Não foi demonstrada exploração deste projeto, nem foi declarada ausência de risco. Não há aceite de risco ou aprovação de segurança nesta entrega. Próximo passo: reconsolidar o gate com este lock e manter o bloqueio até correção upstream ou mitigação verificável e decisão de segurança.

PR permanece rascunho. Sem solicitação formal de review, merge, deploy ou DNS; #4/#6 permanecem em revisão e #7/#8 mantêm seus próprios gates.
