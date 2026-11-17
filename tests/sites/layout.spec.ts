import { test, expect } from '@playwright/test';
import { siteURL } from './site';

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test(`${app}: 320 px e texto a 200% preservam reflow e controles`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 960 });
    await page.goto(await siteURL(page, app, port));
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
    for (const size of ['100%', '200%']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value; }, size);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.getByRole('button', { name: 'Ativar tema claro' }).click();
      await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
      for (const link of await page.locator('nav a').all()) {
        await link.click();
        await expect(page.locator((await link.getAttribute('href'))!)).toBeVisible();
      }
    }
  });

  test(`${app}: status, timeout e continuação não deslocam conteúdo nem perdem foco`, async ({ page }) => {
    const url = await siteURL(page, app, port);
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route(/\.woff2?(\?.*)?$/, async route => { await gate; await route.fallback(); });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const geometry = () => page.locator('main').evaluate(el => {
        const box = el.getBoundingClientRect();
        return { top: box.top + scrollY, width: box.width };
      });
      const before = await geometry();
      await page.clock.fastForward(200);
      await expect(page.getByRole('status')).toBeVisible();
      expect(await geometry()).toEqual(before);
      await page.clock.fastForward(8000);
      await expect(page.getByRole('alert')).toBeVisible();
      expect(await geometry()).toEqual(before);
      const continueButton = page.getByRole('button', { name: 'Continuar com fontes alternativas' });
      await continueButton.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeFocused();
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(await geometry()).toEqual(before);
      await page.keyboard.press('Tab');
      await expect(page.locator('main a').first()).toBeFocused();
    } finally { release(); }
  });
}
