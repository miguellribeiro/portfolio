import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const sites = JSON.parse(await readFile(new URL('./sites-metadata.json', import.meta.url), 'utf8'));
const marker = '<!--site-seo-->';
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function indexingMode(value = process.env.MANPE_INDEXING ?? 'preview') {
  if (value !== 'preview' && value !== 'production') throw new Error('MANPE_INDEXING deve ser preview ou production.');
  return value;
}

function siteFor(app) {
  if (!Object.hasOwn(sites, app)) throw new Error('Escolha studio ou portfolio.');
  return sites[app];
}

export function siteSeo(app) {
  const site = siteFor(app);
  const indexing = indexingMode();
  const url = `${site.origin}/`;
  const image = `${site.origin}/og.png`;
  const tags = [
    `<title>${escape(site.title)}</title>`,
    `<meta name="description" content="${escape(site.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${indexing === 'production' ? 'index, follow' : 'noindex, nofollow'}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escape(site.name)}" />`,
    `<meta property="og:title" content="${escape(site.title)}" />`,
    `<meta property="og:description" content="${escape(site.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    '<meta property="og:locale" content="pt_BR" />',
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escape(site.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(site.title)}" />`,
    `<meta name="twitter:description" content="${escape(site.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escape(site.imageAlt)}" />`,
  ];
  return {
    name: 'manpe-site-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (html.split(marker).length !== 2) throw new Error('Cada página precisa de exatamente um marcador site-seo.');
        return html.replace(marker, () => tags.join('\n    '));
      },
    },
  };
}

export async function writeSiteFiles(app, outputDirectory, mode = indexingMode()) {
  const site = siteFor(app);
  const indexing = indexingMode(mode);
  const output = resolve(outputDirectory);
  const robots = indexing === 'production'
    ? `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`
    : '# Preview: noindex is set in HTML and the X-Robots-Tag header.\nUser-agent: *\nAllow: /\n';
  // Allow crawling so crawlers can read noindex; robots.txt is not an access control.
  const headers = indexing === 'preview'
    ? '/*\n  X-Robots-Tag: noindex, nofollow\n'
    : '/404.html\n  X-Robots-Tag: noindex, nofollow\n';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.origin}/</loc></url></urlset>\n`;
  const notFound = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Página não encontrada — ${escape(site.name)}</title><meta name="robots" content="noindex, nofollow" /><link rel="icon" href="/favicon.svg" type="image/svg+xml" /><link rel="stylesheet" href="/404.css" /></head>
<body><main><a class="brand" href="${site.origin}/"><img src="/favicon.svg" alt="" width="40" height="40" />${escape(site.name)}</a><p class="code">404</p><h1>Esta página não foi encontrada.</h1><p>Confira o endereço ou volte à página inicial.</p><a class="home" href="${site.origin}/">Voltar ao início</a></main></body></html>\n`;
  const css = ':root{color-scheme:dark;font-family:system-ui,sans-serif;background:#1a0b14;color:#fceaf2}*{box-sizing:border-box}body{margin:0;padding:clamp(1.5rem,6vw,5rem)}main{max-width:48rem;margin:4vh auto}.brand{display:inline-flex;gap:.8rem;align-items:center;color:inherit;text-decoration:none;font-weight:650}.code{font-size:clamp(4rem,14vw,8rem);line-height:1;margin:4rem 0 1rem;color:#ff7ab3}h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.15;max-width:18ch}p{line-height:1.6}.home{display:inline-block;margin-top:1.5rem;padding:.9rem 1.3rem;background:#ff7ab3;color:#1a0b14;border-radius:3rem;font-weight:650;text-underline-offset:.2em}a:focus-visible{outline:3px solid #f5c26b;outline-offset:5px}\n';
  await Promise.all(Object.entries({ 'robots.txt': robots, '_headers': headers, 'sitemap.xml': sitemap, '404.html': notFound, '404.css': css }).map(([file, contents]) => writeFile(resolve(output, file), contents)));
}
