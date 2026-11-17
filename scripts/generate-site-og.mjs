// Optional authoring tool; normal builds copy the committed PNGs and need no browser.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { sites } from './site-seo.mjs';

const font = (await readFile(resolve('node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2'))).toString('base64');
const logo = (await readFile(resolve('public/favicon.svg'))).toString('base64');
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  for (const [app, site] of Object.entries(sites)) {
    await page.setContent(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:Brand;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:600}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;padding:60px 72px;background:#1a0b14;color:#fceaf2;font-family:Brand,system-ui,sans-serif;overflow:hidden}header{display:flex;align-items:center;gap:18px;font-size:30px}header img{width:58px;height:58px}h1{font-size:78px;line-height:1.08;letter-spacing:-2.5px;font-weight:600;margin:56px 0 24px}p{font-size:27px;margin:0;color:#c9a3b6}footer{display:flex;align-items:center;justify-content:space-between;margin-top:48px;font-size:22px;color:#ff7ab3}.line{width:270px;height:2px;background:#ff7ab3}
</style></head><body><header><img src="data:image/svg+xml;base64,${logo}" alt="">${escape(site.name)}</header><h1>${escape(site.imageHeading).replace(/\n/g, '<br>')}</h1><p>${escape(site.imageSubtitle)}</p><footer><span>${escape(new URL(site.origin).hostname)}</span><span class="line"></span></footer></body></html>`);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(image => image.decode())); });
    if (await page.evaluate(() => document.documentElement.scrollWidth > 1200 || document.documentElement.scrollHeight > 630)) throw new Error(`OG ${app} excede a tela.`);
    const output = resolve('apps', app, 'public', 'og.png');
    await page.screenshot({ path: output });
    console.log(`OG ${app}: ${output} (1200 × 630).`);
  }
} finally { await browser.close(); }
