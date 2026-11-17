import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test(`${app}: navegação, teclado, tema e isolamento`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    for (const link of await page.locator('nav a').all()) {
      const href = await link.getAttribute('href');
      await link.click();
      await expect(page.locator(href!)).toBeVisible();
    }
    await page.getByRole('button', { name: 'Ativar tema claro' }).click();
    await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
    const light = await page.locator('.site-shell').evaluate(el => getComputedStyle(el).backgroundColor);
    await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
    expect(await page.locator('.site-shell').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(light);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (app === 'studio') {
      await expect(page.getByRole('heading', { name: 'Trajetória profissional.' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Preparar mensagem' }).click();
      await expect(page.getByLabel('Seu nome')).toBeFocused();
      await expect(page.locator('[aria-invalid=true]')).toHaveCount(3);
      await page.getByLabel('Seu nome').fill('Pessoa de teste');
      await page.getByLabel('Seu e-mail').fill('teste@example.com');
      await page.getByLabel('O que você quer construir?').fill('Quero um site para meu negócio.');
      await page.getByRole('button', { name: 'Preparar mensagem' }).click();
      await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveAttribute('href', /^mailto:.*body=/);
      await page.getByLabel('O que você quer construir?').fill('Agora quero um sistema para a equipe.');
      await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Preparar mensagem' }).click();
      await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveAttribute('href', new RegExp(encodeURIComponent('Agora quero um sistema para a equipe.')));
      for (const plan of await page.locator('.plan').all()) {
        await expect(plan.locator('li').filter({ hasText: /^Resposta em até/ })).toHaveCount(1);
        await expect(plan.locator('li').filter({ hasText: /^(Página única|Até 5 páginas|Múltiplas páginas)/ })).toHaveCount(1);
      }
      await page.locator('.faq summary').first().click();
      await expect(page.locator('.faq details').first()).toHaveAttribute('open', '');
    } else {
      await expect(page.locator('body')).not.toContainText('R$');
      await expect(page.getByRole('heading', { name: 'Planos' })).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Sinapse', exact: true })).toBeVisible();
    }
    await page.goto(`http://127.0.0.1:${port}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mkdir('.impeccable/review', { recursive: true });
    await page.screenshot({ path: `.impeccable/review/${app}-${testInfo.project.name}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
