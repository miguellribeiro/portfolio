import { test, expect } from '@playwright/test';
import { siteURL } from './site';

declare global {
  interface Window { __manpeAudit: { timers: Set<number>; observers: number; geometryReads: number } }
}

for (const [app, port] of [['studio', 4174], ['portfolio', 4175]] as const) {
  test(`${app}: fauna independente, pausa real, retorno e limpeza`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
    await page.addInitScript(() => {
      Math.random = () => .25;
      const audit = window.__manpeAudit = { timers: new Set<number>(), observers: 0, geometryReads: 0 };
      const originalSet = window.setTimeout.bind(window);
      const originalClear = window.clearTimeout.bind(window);
      window.setTimeout = ((callback: TimerHandler, delay?: number, ...args: unknown[]) => {
        const id = originalSet(() => { audit.timers.delete(id); if (typeof callback === 'function') callback(...args); }, delay);
        audit.timers.add(id);
        return id;
      }) as typeof window.setTimeout;
      window.clearTimeout = ((id?: number) => { if (id !== undefined) audit.timers.delete(id); originalClear(id); }) as typeof window.clearTimeout;
      const readBounds = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () { if (new Error().stack?.includes('/assets/')) audit.geometryReads++; return readBounds.call(this); };
      const readBox = SVGGraphicsElement.prototype.getBBox;
      SVGGraphicsElement.prototype.getBBox = function (options?: SVGBoundingBoxOptions) { if (new Error().stack?.includes('/assets/')) audit.geometryReads++; return readBox.call(this, options); };
      const Original = window.IntersectionObserver;
      window.IntersectionObserver = class extends Original {
        private counted = false;
        observe(target: Element) { if (!this.counted) { audit.observers++; this.counted = true; } super.observe(target); }
        disconnect() { if (this.counted) { audit.observers--; this.counted = false; } super.disconnect(); }
      };
    });
    await page.goto(await siteURL(page, app, port));
    await expect(page.locator('.brand-intro')).toHaveAttribute('data-phase', 'header');
    const scene = page.locator('.manpe-scene');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-motion', 'running');
    await page.clock.fastForward(46000);
    const limit = testInfo.project.name === 'mobile' ? 1 : 2;
    expect(Number(await scene.getAttribute('data-active-actors'))).toBeLessThanOrEqual(limit);
    expect(await scene.evaluate(el => el.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');
    const metrics = async () => Object.fromEntries((await client.send('Performance.getMetrics')).metrics.map(metric => [metric.name, metric.value]));
    await page.waitForTimeout(100);
    const geometryBefore = await page.evaluate(() => window.__manpeAudit.geometryReads);
    const activeBefore = await metrics();
    await page.waitForTimeout(300);
    const activeAfter = await metrics();
    const geometryAfter = await page.evaluate(() => window.__manpeAudit.geometryReads);
    expect(geometryAfter).toBe(geometryBefore);
    await page.getByRole('button', { name: 'Pausar animações' }).click();
    await expect(scene).toHaveAttribute('data-motion', 'paused');
    const before = await scene.evaluate(el => el.getAnimations({ subtree: true }).map(animation => animation.currentTime));
    await page.clock.fastForward(90000);
    expect(await scene.evaluate(el => el.getAnimations({ subtree: true }).map(animation => animation.currentTime))).toEqual(before);
    expect(await page.evaluate(() => window.__manpeAudit.timers.size)).toBe(0);
    await expect(page.getByRole('button', { name: 'Retomar animações' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Retomar animações' }).click();
    await expect(scene).toHaveAttribute('data-motion', 'running');

    const states = new Set<string>();
    // Finish actual WAAPI sequences one stage at a time, keeping the production delay ranges.
    for (let visit = 0; visit < 3; visit++) {
      for (let step = 0; step < 6; step++) {
        const snapshot = await scene.evaluate(el => {
          const states = [...el.querySelectorAll<SVGElement>('[data-state]')].map(actor => `${actor.dataset.actor}:${actor.dataset.state}`);
          el.getAnimations({ subtree: true }).forEach(animation => animation.finish());
          return { states, count: Number((el as HTMLElement).dataset.activeActors) };
        });
        snapshot.states.forEach(state => states.add(state));
        expect(snapshot.count).toBeLessThanOrEqual(limit);
      }
      await page.clock.fastForward(1201);
    }
    expect([...states]).toEqual(expect.arrayContaining(['capybara:grazing', 'capybara:chewing', 'monkey:swinging', 'monkey:reaching', 'bird:landing', 'bird:resting']));
    await page.clock.fastForward(14001);
    await scene.evaluate(el => el.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    expect(await scene.locator('[data-part=grass-a]').evaluate(el => (el as SVGElement).style.transform)).toBe('scaleY(1)');

    // Moving above the footer cancels every armed timeout and pauses all WAAPI work.
    await page.locator('.header').scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-motion', 'paused');
    expect(await page.evaluate(() => window.__manpeAudit.timers.size)).toBe(0);
    const idleBefore = await metrics();
    await page.waitForTimeout(300);
    const idleAfter = await metrics();
    expect(idleAfter.LayoutCount).toBe(idleBefore.LayoutCount);
    await testInfo.attach('performance-sample', { body: JSON.stringify({ viewport: testInfo.project.use.viewport, active: { before: activeBefore, after: activeAfter, geometryReads: geometryAfter - geometryBefore }, offscreen: { before: idleBefore, after: idleAfter }, offscreenTimers: 0 }), contentType: 'application/json' });
    await client.detach();
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-motion', 'running');
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await expect(scene).toHaveAttribute('data-motion', 'paused');
    expect(await page.evaluate(() => window.__manpeAudit.timers.size)).toBe(0);
    await page.clock.fastForward(120000);
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
    await expect(scene).toHaveAttribute('data-motion', 'running');

    // Preference changes exercise the same disposal path as effect unmount/remount.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(scene).toHaveAttribute('data-motion', 'static');
    expect(await scene.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => ({ timers: window.__manpeAudit.timers.size, observers: window.__manpeAudit.observers }))).toEqual({ timers: 0, observers: 0 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(scene).toHaveAttribute('data-motion', 'running');
    expect(await page.evaluate(() => window.__manpeAudit.observers)).toBe(1);
    expect(Number(await scene.getAttribute('data-active-actors'))).toBe(0);
    await page.setViewportSize({ width: testInfo.project.name === 'mobile' ? 1440 : 390, height: 960 });
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-motion', 'running');
    expect(await page.evaluate(() => window.__manpeAudit.observers)).toBe(1);
  });
}
