import { test, expect } from '@playwright/test';
import { siteURL } from './site';

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test.describe(`${app}: HTML sem JavaScript`, () => {
    test.use({ javaScriptEnabled: false });
    test('conteúdo, SVGs, âncoras e contato permanecem disponíveis', async ({ page }) => {
      await page.goto(await siteURL(page, app, port));
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.manpe-scene')).toHaveAttribute('data-motion', 'static');
      await expect(page.locator('.manpe-scene [data-actor]')).toHaveCount(4);
      await expect(page.locator('.brand-mascot svg')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ativar tema claro' })).toBeDisabled();
      for (const link of await page.locator('nav a').all()) {
        await link.click();
        await expect(page.locator((await link.getAttribute('href'))!)).toBeInViewport();
      }
      if (app === 'studio') {
        await page.locator('.faq summary').first().click();
        await expect(page.locator('.faq details').first()).toHaveAttribute('open', '');
        await expect(page.getByLabel('Seu nome')).toBeDisabled();
        await expect(page.getByRole('button', { name: 'Preparar mensagem' })).toBeDisabled();
        await expect(page.locator('#contato > a')).toHaveAttribute('href', /^mailto:/);
      } else {
        await expect(page.locator('body')).not.toContainText('R$');
        await expect(page.locator('#projetos')).toContainText('Sinapse');
      }
    });
  });

  test(`${app}: hidratação preserva HTML e habilita controles após módulo retido`, async ({ page }) => {
    const url = await siteURL(page, app, port);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route(/\.js(\?.*)?$/, async route => { await gate; await route.fallback(); });
    try {
      await page.goto(url, { waitUntil: 'commit' });
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ativar tema claro' })).toBeDisabled();
      const main = await page.locator('main').elementHandle();
      release();
      await expect(page.getByRole('button', { name: 'Ativar tema claro' })).toBeEnabled();
      expect(await main!.evaluate(el => el === document.querySelector('main'))).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
      await page.getByRole('button', { name: 'Ativar tema claro' }).click();
      await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
      if (app === 'studio') await expect(page.getByRole('button', { name: 'Preparar mensagem' })).toBeEnabled();
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
