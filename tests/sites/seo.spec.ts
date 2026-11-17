import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteURL } from './site';

const production = process.env.MANPE_INDEXING === 'production';
for (const [app, port, origin, title] of [
  ['studio', 4174, 'https://manpestudio.com.br', 'Manpe Studio — Sites e sistemas'],
  ['portfolio', 4175, 'https://miguel.manpestudio.com.br', 'Miguel Ribeiro — Desenvolvedor Full Stack'],
] as const) {
  test.describe(`${app}: arquivos de SEO por host`, () => {
    test.use({ javaScriptEnabled: false });
    test('metadados estáticos não anunciam idiomas ausentes', async ({ page }) => {
      await page.goto(await siteURL(page, app, port));
      await expect(page).toHaveTitle(title);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}/`);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', production ? 'index, follow' : 'noindex, nofollow');
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}/`);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'pt_BR');
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}/og.png`);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${origin}/og.png`);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('link[hreflang], meta[property="og:locale:alternate"]')).toHaveCount(0);
      await expect(page.locator('h1')).toHaveCount(1);
      const source = await readFile(resolve('artifacts', app, 'index.html'), 'utf8');
      expect(source).not.toContain('<!--site-seo-->');
      expect(source).toContain('manpe-scene');
    });

    test('assets, sitemap, robots e 404 preservam o contrato do host', async ({ page }) => {
      const root = resolve('artifacts', app);
      const url = await siteURL(page, app, port);
      await page.goto(url);
      for (const path of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/og.png']) {
        const response = await page.goto(new URL(path, url).href);
        expect(response?.status()).toBe(200);
        expect((await response!.body()).length).toBeGreaterThan(100);
      }
      const png = await readFile(resolve(root, 'og.png'));
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
      const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
      expect([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])).toEqual([`${origin}/`]);
      expect(sitemap).not.toMatch(/hreflang|\/en\/|\/es\//);
      const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
      expect(robots).toContain('Allow: /');
      expect(robots).not.toContain('Disallow: /');
      expect(robots.includes(`Sitemap: ${origin}/sitemap.xml`)).toBe(production);
      const headers = await readFile(resolve(root, '_headers'), 'utf8');
      expect(headers).toBe(production ? '/404.html\n  X-Robots-Tag: noindex, nofollow\n' : '/*\n  X-Robots-Tag: noindex, nofollow\n');
      for (const locale of ['en', 'es']) await expect(readFile(resolve(root, locale, 'index.html'))).rejects.toThrow();
      await page.goto(new URL('/404.html', url).href);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página não foi encontrada.');
      await expect(page.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', `${origin}/`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      await expect(page.locator('script, meta[http-equiv="refresh"], link[rel="canonical"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  });
}
