# Integração do pacote #3

Os dez arquivos originais estão em `assets/`, preservados byte a byte. Execute
`python scripts/import-manpe-assets.py` para copiar novamente a entrega revisada
de `shared/manpe-assets` e gerar `Artwork.tsx`. A conversão é feita no build de
autoria; não há parsing, innerHTML ou dependência SVG no cliente.

`Forest.tsx` monta a cena compartilhada abaixo dos links de ambos os sites.
Cada ator tem um wrapper `data-actor` separado do wrapper de posição/escala e
dos grupos internos `data-part`. Consultas futuras devem ficar na ref do ator.
O logo original em `src/components/Wordmark.jsx` não foi alterado e o snapshot
da entrega não é importado pelo frontend.

A mão do macaco (118,18) encontra (584,68); os pés do pássaro (96,106)
encontram (900,85). A capivara está em translate(96,115) scale(.67), junto
à primeira moita e ao terreno. Na futura pose de pastejo, ajustar focinho e
troca de apoio durante a coreografia, sem alterar os pivôs internos.

Validação em 17/11/2026: TypeScript estrito e os dois builds passaram.
Quatro testes Playwright/Edge passaram, nos dois sites a 1440 e 390 px:
troca de cores, apoios preservados em movimento reduzido, ausência de
overflow horizontal e de animações na cena estática e de erros JS.
Capturas de cena nos temas claro/escuro em `artifacts/forest-*.png` foram
geradas; desktop escuro e mobile claro revisados visualmente.

O browser não iniciou no sandbox e o acesso às portas locais expirou pela
ferramenta nativa. Para a validação foi usado o Edge nativo, servindo os arquivos
compilados com interceptação Playwright (`MANPE_OFFLINE_QA=1`). Isso valida a
renderização dos builds, não a rede do preview ou a publicação.

Estado atual: estático. Sem pausa manual ou scheduler nesta integração.
Cronogramas, limite de simultaneidade, relógio ativo, visibilidade e pausa real
WAAPI/timers pertencem à issue #6. O teste estático não comprova esses recursos.
