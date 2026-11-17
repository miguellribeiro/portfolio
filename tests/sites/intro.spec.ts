import { test, expect, type Page } from '@playwright/test';
import { siteURL } from './site';

async function freeze(page: Page) {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
}

test('entrada rápida e navegação repetida não impõem ciclo artificial', async ({ page }) => {
  const url = await siteURL(page, 'studio', 4174);
  await page.goto(url);
  await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
  await page.getByRole('link', { name: 'Encontrar meu plano' }).click();
  await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
  await page.reload();
  await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
  expect(await page.locator('.brand-mascot').evaluate(el => ({ width: el.clientWidth, height: el.clientHeight }))).toEqual({ width: 32, height: 32 });
});

test('fontes lentas: conteúdo e foco disponíveis; prontidão interrompe espera', async ({ page }) => {
  const url = await siteURL(page, 'studio', 4174);
  await freeze(page);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\.woff2?(\?.*)?$/, async route => { await gate; await route.fallback(); });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const slotBounds = () => page.locator('.brand-mascot').evaluate(el => { const box = el.getBoundingClientRect(); return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height }; });
    const slot = await slotBounds();
    await page.clock.fastForward(200);
    await expect(page.getByRole('status')).toContainText('O conteúdo já está disponível');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    release();
    await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', /transition|header/);
    await page.clock.fastForward(421);
    await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
    expect(await slotBounds()).toEqual(slot);
    await expect(page.getByRole('status')).toHaveCount(0);
  } finally { release(); }
});

test('timeout acessível, limite visual e recuperação ao recarregar', async ({ page }) => {
  const url = await siteURL(page, 'studio', 4174);
  await freeze(page);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\.woff2?(\?.*)?$/, async route => { await gate; await route.fallback(); });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.clock.fastForward(1600);
    expect(await page.locator('.brand-mascot svg').evaluate(el => (el as SVGElement).style.transform)).toBe('none');
    await page.clock.fastForward(6500);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    release();
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
  } finally { release(); }
});

test('logo ausente oferece continuação e movimento reduzido mantém mascote estático', async ({ page }) => {
  const url = await siteURL(page, 'studio', 4174);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/favicon.svg', route => route.abort());
  await page.goto(url);
  await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'error');
  expect(await page.locator('.brand-mascot svg').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await page.getByRole('button', { name: 'Continuar com fontes alternativas' }).click();
  await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('main')).toBeVisible();
});
