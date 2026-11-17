const { chromium } = require('playwright');
const { buildSync } = require('esbuild');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// Deterministic source harness: native WAAPI, held stages and virtual active time.
// It verifies boundaries, not natural playback, FPS or React unmount behavior.
const bundle = buildSync({ entryPoints: ['packages/ui/manpe/forestMotion.ts'], bundle: true, format: 'iife', globalName: 'ManpeMotion', write: false }).outputFiles[0].text;
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    async function setup(width) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 1000));
      await page.setContent('<svg><g data-actor="capybara"><g data-part="head"></g><g data-part="jaw"></g></g><g data-actor="monkey"><g data-part="tail"></g><g data-part="swing"></g><g data-part="free-arm"></g></g><g data-actor="bird"><g data-part="wing"></g><g data-part="body"></g></g><g data-part="grass-a"></g><g data-part="grass-b"></g><g data-part="grass-c"></g></svg>');
      await page.addScriptTag({ content: bundle });
      await page.evaluate(() => {
        Math.random = () => 0;
        window.calls = [];
        const nativeAnimate = Element.prototype.animate;
        Element.prototype.animate = function (frames, options) {
          const animation = nativeAnimate.call(this, frames, options);
          animation.pause(); // Controlled completion makes the Promise.all boundary observable.
          window.calls.push({ target: this.dataset.part || this.dataset.actor, frames, options, at: performance.now() });
          return animation;
        };
        window.motion = ManpeMotion.createForestMotion(document.querySelector('svg'));
        window.motion.setLimit(3); // Isolate stage ordering; production limits are covered by motion.spec.ts.
        window.motion.setActive(true);
      });
      const finish = async selector => page.evaluate(async selector => {
        const animations = document.querySelector(selector).getAnimations();
        if (!animations.length) throw new Error('No animation: ' + selector);
        const done = animations.map(animation => animation.finished);
        animations.forEach(animation => animation.finish());
        await Promise.all(done);
        await Promise.resolve();
      }, selector);
      const reductions = async () => {
        await page.clock.fastForward(18000);
        await finish('[data-actor=capybara]');
        await finish('[data-actor=capybara] [data-part=head]');
      };
      const regrown = () => page.evaluate(() => window.calls.filter(call => call.target.startsWith('grass-') && call.frames[0].transform === 'scaleY(.22)').length);
      return { page, errors, finish, reductions, regrown };
    }
    for (const width of [1440, 390]) {
      const { page, errors, finish, reductions, regrown } = await setup(width);
      await reductions();
      await finish('[data-part=grass-a]');
      await finish('[data-part=grass-b]');
      await page.clock.fastForward(20001);
      assert.equal(await regrown(), 0, 'Rest must not start before the final reduction');
      await page.evaluate(() => window.motion.setActive(false));
      await finish('[data-part=grass-c]'); // Completion while inactive must create only a suspended wait.
      await page.clock.fastForward(50000);
      assert.equal(await regrown(), 0);
      await page.evaluate(() => window.motion.setActive(true));
      await page.clock.fastForward(3000);
      await page.evaluate(() => window.motion.setActive(false));
      await page.clock.fastForward(50000);
      assert.equal(await regrown(), 0, 'Paused time must not consume the rest');
      await page.evaluate(() => window.motion.setActive(true));
      await page.clock.fastForward(8999);
      assert.equal(await regrown(), 0);
      await page.clock.fastForward(1);
      assert.equal(await regrown(), 3, 'All grasses regenerate only after 12000 active ms');
      await finish('[data-actor=monkey]');
      const tail = await page.evaluate(() => window.calls.find(call => call.target === 'tail').options);
      const swing = await page.evaluate(() => window.calls.find(call => call.target === 'swing').options);
      assert.equal(tail.delay, 80);
      assert.equal(tail.duration, 1920);
      assert.equal(tail.delay + tail.duration, swing.duration);
      await page.evaluate(() => window.motion.dispose());
      assert.equal(await page.locator('svg').evaluate(el => el.getAnimations({ subtree: true }).length), 0);
      assert.deepEqual(errors, []);
      results.push({ width, allReductionsRequired: true, activeRestMs: 12000, pausedCompletion: true, remainingRestPreserved: true, tailDelayMs: tail.delay, tailDurationMs: tail.duration });
      await page.close();

      for (const boundary of ['reducing', 'completion-microtask', 'resting', 'regenerating']) {
        const rig = await setup(width);
        await rig.reductions();
        if (boundary === 'completion-microtask') {
          await rig.page.evaluate(() => {
            for (const grass of document.querySelectorAll('[data-part^=grass-]')) grass.getAnimations().forEach(animation => animation.finish());
            window.motion.dispose();
          });
        } else {
          if (boundary !== 'reducing') {
            for (const name of ['grass-a', 'grass-b', 'grass-c']) await rig.finish('[data-part=' + name + ']');
            if (boundary === 'regenerating') await rig.page.clock.fastForward(12000);
          }
          await rig.page.evaluate(() => window.motion.dispose());
        }
        const before = await rig.page.evaluate(() => window.calls.length);
        await rig.page.clock.fastForward(200000);
        assert.equal(await rig.page.evaluate(() => window.calls.length), before, 'Disposed work cannot schedule new animations');
        assert.equal(await rig.page.locator('svg').evaluate(el => el.getAnimations({ subtree: true }).length), 0);
        assert.equal(await rig.page.locator('svg').getAttribute('data-motion'), 'static');
        assert.equal(await rig.page.locator('[data-state]').count(), 0);
        assert.deepEqual(rig.errors, []);
        results.push({ width, disposedAt: boundary, animationsAfter: 0, noNewWork: true });
        await rig.page.close();
      }
    }
    fs.mkdirSync('artifacts', { recursive: true });
    fs.writeFileSync('artifacts/motion-boundaries-report.json', JSON.stringify({ method: 'source bundle, native WAAPI held stages, virtual clock; no natural timing/FPS claim', results }, null, 2));
    console.log(JSON.stringify({ passed: results.length, results }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
