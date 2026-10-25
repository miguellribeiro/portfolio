/**
 * Plugin Vite: <head> de SEO pré-renderizado por idioma (sem JS no cliente).
 *
 * - dist/index.html     → idioma padrão (pt-BR) em "/"
 * - dist/<path>/index.html → demais idiomas (ex.: /en/, /es/), conforme site.json → locales[].path
 *
 * Tudo vem dos JSONs: site.json (siteUrl, locales, brand, contact, pricing.regions)
 * e locales/<idioma>.json (meta.title, meta.description, hero.*).
 * No index.html, o marcador <!--seo-head--> é substituído pelas tags abaixo.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const MARK = '<!--seo-head-->';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function load() {
  const site = readJson('src/data/site.json');
  const messages = Object.fromEntries(site.locales.map((l) => [l.code, readJson(`src/data/locales/${l.code}.json`)]));
  return { site, messages };
}

/** Países atendidos = regiões de preço do site.json (códigos ISO; "419" = América Latina). */
function areaServed(site, code) {
  const names = new Intl.DisplayNames([code], { type: 'region' });
  const seen = new Set();
  const out = [];
  (site.pricing?.regions || []).forEach((r) => (r.countries || []).forEach((c) => {
    if (seen.has(c)) return;
    if (/^[A-Z]{2}$/.test(c)) out.push({ '@type': 'Country', name: names.of(c), identifier: c });
    else if (/^\d{3}$/.test(c)) out.push({ '@type': 'Place', name: names.of(c) });
    else return; // ex.: "US-419" (hispânicos nos EUA) não é uma área geográfica
    seen.add(c);
  }));
  return out;
}

function jsonLd(site, m, loc, url) {
  const base = `${site.siteUrl}/`;
  const c = site.contact || {};
  const person = {
    '@type': 'Person',
    '@id': `${base}#miguel`,
    name: m.hero.title,
    jobTitle: m.hero.eyebrow,
    url,
    sameAs: [c.linkedin, c.github].filter(Boolean),
    worksFor: { '@id': `${base}#manpe` },
  };
  const service = {
    '@type': 'ProfessionalService',
    '@id': `${base}#manpe`,
    name: site.brand.name,
    url,
    description: m.hero.subtitle,
    image: `${site.siteUrl}${loc.ogImage}`,
    areaServed: areaServed(site, loc.code),
    founder: { '@id': `${base}#miguel` },
    availableLanguage: site.locales.map((l) => l.code),
    ...(c.whatsapp && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: `+${c.whatsapp}`,
        url: `https://wa.me/${c.whatsapp}`,
        availableLanguage: site.locales.map((l) => l.code),
      },
    }),
  };
  const data = { '@context': 'https://schema.org', '@graph': [person, service] };
  // "<" escapado: o JSON nunca fecha o <script> antes da hora
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Tags do <head> para um idioma (já indentadas para o index.html). */
export function renderHead(code, { site, messages } = load()) {
  const loc = site.locales.find((l) => l.code === code);
  const m = messages[code];
  const abs = (p) => `${site.siteUrl}${p}`;
  const url = abs(loc.path);
  const title = m.meta.title;
  const desc = m.meta.description;
  const img = abs(loc.ogImage);
  const alt = `${site.brand.name} — ${m.hero.title}, ${m.hero.eyebrow}`;
  const def = site.locales.find((l) => l.code === site.defaultLocale);
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...site.locales.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${abs(l.path)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${abs(def.path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.brand.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${loc.ogLocale}" />`,
    ...site.locales.filter((l) => l.code !== code).map((l) => `<meta property="og:locale:alternate" content="${l.ogLocale}" />`),
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${esc(alt)}" />`,
    `<script type="application/ld+json">${jsonLd(site, m, loc, url)}</script>`,
  ];
  return tags.join('\n    ');
}

function render(html, code, data) {
  if (!html.includes(MARK)) throw new Error(`[seo-heads] marcador ${MARK} ausente no index.html`);
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${code}"`)
    .replace(MARK, renderHead(code, data));
}

/** Idioma pelo caminho da URL (dev server): "/en/..." → "en". */
function codeFromUrl(site, url = '/', base = '/') {
  const rest = url.split(/[?#]/)[0].slice(base.length - 1);
  const hit = site.locales.find((l) => l.path !== '/' && (`${rest}/`).startsWith(l.path));
  return hit?.code || site.defaultLocale;
}

export default function seoHeads() {
  let template = '';
  let outDir = 'dist';
  let base = '/';
  return {
    name: 'seo-heads',
    configResolved(cfg) {
      outDir = resolve(cfg.root, cfg.build.outDir);
      base = cfg.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const data = load();
        if (ctx.server) return render(html, codeFromUrl(data.site, ctx.originalUrl, base), data);
        template = html; // já com os <script>/<link> de assets injetados pelo Vite
        return render(html, data.site.defaultLocale, data);
      },
    },
    writeBundle() {
      if (!template) return;
      const data = load();
      data.site.locales.filter((l) => l.path !== '/').forEach((l) => {
        const file = resolve(outDir, `.${l.path}`, 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, render(template, l.code, data));
      });
    },
  };
}
