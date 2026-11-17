import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test(`${app}: fauna inline, temas e apoios preservados sem movimento`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    if (process.env.MANPE_OFFLINE_QA === '1') {
      await page.route('http://manpe.test/**', async route => {
        const path = new URL(route.request().url()).pathname;
        const types: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
        const file = resolve('artifacts', app, path === '/' ? 'index.html' : path.slice(1));
        await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] || 'application/octet-stream' });
      });
    }
    await page.goto(process.env.MANPE_OFFLINE_QA === '1' ? 'http://manpe.test/' : `http://127.0.0.1:${port}`);
    const scene = page.locator('.manpe-scene');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('aria-hidden', 'true');
    // Layout transforms survive both the static reset and the live media query.
    const anchors = () => scene.evaluate(el => {
      const svg = el.querySelector('svg')!;
      const world = svg.getScreenCTM()!.inverse();
      const point = (selector: string, x: number, y: number) => {
        const actor = el.querySelector<SVGGraphicsElement>(selector)!;
        const p = new DOMPoint(x, y).matrixTransform(actor.getScreenCTM()!).matrixTransform(world);
        return { x: p.x, y: p.y };
      };
      return { hand: point('[data-actor=monkey]', 118, 18), foot: point('[data-actor=bird]', 96, 106) };
    });
    for (const motion of ['no-preference', 'reduce'] as const) {
      await page.emulateMedia({ reducedMotion: motion });
      const positions = await anchors();
      expect(positions.hand.x).toBeCloseTo(584, 1);
      expect(positions.hand.y).toBeCloseTo(68, 1);
      expect(positions.foot.x).toBeCloseTo(900, 1);
      expect(positions.foot.y).toBeCloseTo(85, 1);
      expect(await scene.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    }
    const fur = () => scene.locator('[data-actor=monkey] ellipse').evaluate(el => getComputedStyle(el).fill);
    const dark = await fur();
    await page.getByRole('button', { name: 'Ativar tema claro' }).click();
    expect(await fur()).not.toBe(dark);
    await scene.scrollIntoViewIfNeeded();
    await scene.screenshot({ path: `artifacts/forest-${app}-${testInfo.project.name}-light.png` });
    await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
    await scene.scrollIntoViewIfNeeded();
    await scene.screenshot({ path: `artifacts/forest-${app}-${testInfo.project.name}-dark.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await scene.evaluate(el => {
      const sceneBox = el.getBoundingClientRect();
      return [...el.querySelectorAll<SVGGraphicsElement>('[data-actor]')].every(actor => {
        const box = actor.getBoundingClientRect();
        return box.left >= sceneBox.left - 1 && box.right <= sceneBox.right + 1;
      });
    })).toBe(true);
    await expect(page.locator('.brand img')).toHaveAttribute('src', '/favicon.svg');
    expect(errors).toEqual([]);
  });
}
