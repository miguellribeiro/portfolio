import { test, expect } from '@playwright/test';
import { siteURL } from './site';

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test(`${app}: Tab pela página inteira com erro persistente nunca encobre foco`, async ({ page }, testInfo) => {
    const url = await siteURL(page, app, port);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/favicon.svg', route => route.abort());
    const traversals = [];
    for (const [width, fontSize] of [[390, '100%'], [320, '200%']] as const) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('alert')).toBeVisible();
      await page.evaluate(size => { document.documentElement.style.fontSize = size; }, fontSize);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const geometry = () => page.locator('main').evaluate(el => el.getBoundingClientRect().top + scrollY);
      const top = await geometry();
      await page.screenshot({ path: `.impeccable/review/${app}-${width}-error-reserved.png` });
      const visited = [];
      for (let step = 0; step < 100; step++) {
        await page.keyboard.press('Tab');
        const target = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          if (el === document.body) return null;
          // Inline links can wrap: the union's center may be blank between lines.
          const fragments = [...el.getClientRects()].map(rect => {
            const left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
            const top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
            const hit = right > left && bottom > top ? document.elementFromPoint((left + right) / 2, (top + bottom) / 2) : null;
            return { visible: Boolean(hit && el.contains(hit)), hit: hit?.className };
          });
          return { tag: el.tagName, id: el.id, text: el.textContent?.trim(), href: el.getAttribute('href'), inMain: Boolean(el.closest('main')), visible: fragments.some(fragment => fragment.visible), fragments };
        });
        if (!target) break;
        visited.push(target);
        expect(target.visible, JSON.stringify({ width, fontSize, target })).toBe(true);
      }
      expect(visited.some(target => target.inMain)).toBe(true);
      expect(visited.some(target => target.text === 'Voltar ao início')).toBe(true);
      if (app === 'studio') {
        expect(visited.filter(target => target.tag === 'SUMMARY')).toHaveLength(8);
        expect(visited.some(target => target.id === 'contact-email')).toBe(true);
        expect(visited.some(target => target.text === 'Preparar mensagem')).toBe(true);
      }
      await expect(page.getByRole('alert')).toHaveCount(1);
      expect(await geometry()).toBe(top);
      traversals.push({ width, fontSize, visited });
    }
    await testInfo.attach('keyboard-persistent-error', { body: JSON.stringify(traversals, null, 2), contentType: 'application/json' });
  });
}
