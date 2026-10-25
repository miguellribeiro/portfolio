/**
 * GitHub Pages (fase 1 da migração): publica só páginas de redirecionamento para o
 * site oficial (site.json → siteUrl). Cada caminho em /<repo>/ responde HTML com
 * canonical + meta refresh 0 + location.replace para a URL equivalente.
 *
 * Uso: BASE_PATH=/portfolio/ node scripts/pages-redirect.js <pasta-de-saída>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(resolve(root, 'src/data/site.json'), 'utf8'));
const out = resolve(process.argv[2] || '_pages');
const base = process.env.BASE_PATH || '/portfolio/';
const paths = site.locales.map((l) => l.path); // ["/", "/es/", "/en/"]

// Fallback JS: /<repo>/en/... → <siteUrl>/en/ ; demais caminhos → <siteUrl>/ (o site antigo era uma página só).
// Query e hash seguem junto (o site novo converte ?lang=xx em /xx/).
const script = `(function(){var b=${JSON.stringify(base.replace(/\/$/, ''))},s=${JSON.stringify(site.siteUrl)},ps=${JSON.stringify(paths)};`
  + 'var r=location.pathname.indexOf(b)===0?location.pathname.slice(b.length):location.pathname,t="/";'
  + 'for(var i=0;i<ps.length;i++){if(ps[i]!=="/"&&(r+"/").indexOf(ps[i])===0)t=ps[i];}'
  + 'location.replace(s+t+location.search+location.hash);})();';

const page = (url) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${site.brand.name} — ${site.siteUrl.replace(/^https?:\/\//, '')}</title>
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${url}">
<script>${script}</script>
</head>
<body><p><a href="${url}">${url}</a></p></body>
</html>
`;

const write = (file, url) => {
  const f = resolve(out, file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, page(url));
};
paths.forEach((p) => write(`.${p}index.html`, `${site.siteUrl}${p}`));
write('404.html', `${site.siteUrl}/`);
console.log(`[pages-redirect] ${paths.length + 1} páginas em ${out} → ${site.siteUrl}`);
