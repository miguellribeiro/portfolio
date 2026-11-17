// Real loopback HTTP: cold cache, slow network/CPU, CLS and text-only reflow.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, '.impeccable/review');
  fs.mkdirSync(output, { recursive: true });
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
  const browser = await chromium.launch({ channel: 'msedge' });
  const results = { browser: browser.version(), conditions: { latencyMs: 150, bytesPerSecond: 200000, cpuRate: 4, cache: false }, loads: [], reflow: [], noJavaScript: [], blockedModule: [], keyboard: [] };
  try {
    for (const app of ['studio', 'portfolio']) {
      const base = path.join(root, 'artifacts', app);
      const server = http.createServer((req, res) => {
        const pathname = new URL(req.url, 'http://localhost').pathname;
        const file = path.resolve(base, pathname === '/' ? 'index.html' : pathname.slice(1));
        if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
        fs.readFile(file, (error, body) => {
          res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
          res.end(error ? 'Not found' : body);
        });
      });
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      const url = `http://127.0.0.1:${server.address().port}`;
      try {
        for (const width of [1440, 390]) {
          const context = await browser.newContext({ viewport: { width, height: 960 } });
          const page = await context.newPage();
          await page.addInitScript(() => {
            window.layoutShifts = [];
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.layoutShifts.push({ value: entry.value, time: entry.startTime, sources: entry.sources.map(source => ({ node: source.node?.tagName, className: source.node?.className })) });
            }).observe({ type: 'layout-shift', buffered: true });
          });
          const cdp = await context.newCDPSession(page);
          await cdp.send('Network.enable');
          await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
          await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 200000 });
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
          await page.goto(url);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForFunction(() => document.querySelector('.brand-intro')?.getAttribute('data-phase') === 'header');
          await page.waitForTimeout(500);
          const data = await page.evaluate(() => ({ shifts: window.layoutShifts, scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
          // CLS is the maximum session window: <1 s between shifts, <=5 s per window.
          let cls = 0, sum = 0, start = 0, previous = 0;
          for (const shift of data.shifts) {
            if (shift.time - previous >= 1000 || shift.time - start > 5000) { sum = 0; start = shift.time; }
            sum += shift.value; previous = shift.time; cls = Math.max(cls, sum);
          }
          results.loads.push({ app, width, cls, ...data });
          await page.screenshot({ path: path.join(output, `${app}-${width}-http-layout.png`) });
          await context.close();
        }
        const page = await browser.newPage({ viewport: { width: 320, height: 960 } });
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => document.querySelector('.brand-intro')?.getAttribute('data-phase') === 'header');
        for (const fontSize of ['100%', '200%']) {
          await page.evaluate(size => { document.documentElement.style.fontSize = size; }, fontSize);
          const data = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow: [...document.querySelectorAll('body *')].flatMap(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 ? [{ tag: el.tagName, class: el.getAttribute('class'), left: r.left, right: r.right }] : []; }) }));
          results.reflow.push({ app, fontSize, ...data });
          await page.screenshot({ path: path.join(output, `${app}-320-${fontSize.slice(0, -1)}-http-layout.png`) });
        }
        await page.close();
        const staticContext = await browser.newContext({ viewport: { width: 390, height: 960 }, javaScriptEnabled: false });
        try {
          const staticPage = await staticContext.newPage();
          const response = await staticPage.goto(url);
          const raw = await response.text();
          const staticData = await staticPage.evaluate(() => ({ h1: document.querySelectorAll('h1').length, svg: document.querySelectorAll('svg').length, actors: document.querySelectorAll('.manpe-scene [data-actor]').length, themeDisabled: document.querySelector('.header > button').disabled, formDisabled: document.querySelector('fieldset')?.disabled ?? null, scrollWidth: document.documentElement.scrollWidth }));
          results.noJavaScript.push({ app, htmlContainsHeading: raw.includes('<h1'), htmlContainsScene: raw.includes('manpe-scene'), ...staticData });
          await staticPage.locator('.manpe-forest').screenshot({ path: path.join(output, app + '-no-js-http-forest.png') });
        } finally { await staticContext.close(); }
        const blockedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        try {
          await blockedPage.route(/\.js(\?.*)?$/, route => route.abort());
          await blockedPage.goto(url);
          await blockedPage.locator('nav a').first().click();
          if (app === 'studio') await blockedPage.locator('.faq summary').first().click();
          const blockedData = await blockedPage.evaluate(() => ({ h1: document.querySelectorAll('h1').length, actors: document.querySelectorAll('.manpe-scene [data-actor]').length, themeDisabled: document.querySelector('.header > button').disabled, formDisabled: document.querySelector('fieldset')?.disabled ?? null, hash: location.hash, faqOpen: document.querySelector('.faq details')?.open ?? null, query: location.search }));
          results.blockedModule.push({ app, ...blockedData });
        } finally { await blockedPage.close(); }
        const keyboardPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        try {
          await keyboardPage.route('**/favicon.svg', route => route.abort());
          await keyboardPage.goto(url);
          await keyboardPage.waitForSelector('[role=alert]');
          const visited = [];
          for (let step = 0; step < 100; step++) {
            await keyboardPage.keyboard.press('Tab');
            const target = await keyboardPage.evaluate(() => {
              const el = document.activeElement;
              if (el === document.body) return null;
              const visible = [...el.getClientRects()].some(rect => {
                const left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
                const top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
                const hit = right > left && bottom > top ? document.elementFromPoint((left + right) / 2, (top + bottom) / 2) : null;
                return Boolean(hit && el.contains(hit));
              });
              return { tag: el.tagName, id: el.id, text: el.textContent.trim(), visible };
            });
            if (!target) break;
            visited.push(target);
          }
          results.keyboard.push({ app, visited, alertPersists: await keyboardPage.locator('[role=alert]').count() === 1 });
        } finally { await keyboardPage.close(); }
      } finally { await new Promise(resolve => server.close(resolve)); }
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(root, 'artifacts/layout-http-report.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  for (const load of results.loads) { assert(load.cls <= 0.1, `${load.app}/${load.width}: CLS ${load.cls}`); assert(load.scrollWidth <= load.viewport, `${load.app}/${load.width}: overflow`); }
  for (const row of results.reflow) assert(row.scrollWidth <= row.width, `${row.app}/${row.fontSize}: overflow`);
  for (const row of results.blockedModule) { assert(row.h1 === 1 && row.actors === 4 && row.themeDisabled && row.hash && !row.query, `${row.app}: module-blocked fallback`); if (row.app === 'studio') assert(row.formDisabled && row.faqOpen); }
  for (const row of results.keyboard) { assert(row.alertPersists && row.visited.length > 10 && row.visited.every(target => target.visible) && row.visited.some(target => target.text === 'Voltar ao início'), `${row.app}: focus occlusion`); }
  for (const row of results.noJavaScript) { assert(row.htmlContainsHeading && row.htmlContainsScene && row.h1 === 1 && row.actors === 4 && row.themeDisabled && row.scrollWidth === 390, `${row.app}: static fallback`); if (row.app === 'studio') assert(row.formDisabled); }
})().catch(error => { console.error(error); process.exitCode = 1; });
