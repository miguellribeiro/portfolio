// Inspect built artifacts without depending on local preview ports.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

(async () => {
  const root = path.resolve(__dirname, '..');
  const review = path.join(root, '.impeccable/review');
  fs.mkdirSync(review, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    for (const [name, width, height, app] of [
      ['studio-desktop', 1440, 960, 'studio'],
      ['studio-mobile', 390, 844, 'studio'],
      ['portfolio-mobile', 390, 844, 'portfolio'],
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const base = path.join(root, 'artifacts', app);
      await page.route('http://manpe.test/**', async route => {
        const pathname = new URL(route.request().url()).pathname;
        const file = path.resolve(base, pathname === '/' ? 'index.html' : pathname.slice(1));
        if (!file.startsWith(base + path.sep)) { await route.abort(); return; }
        const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
        await route.fulfill({ body: fs.readFileSync(file), contentType: types[path.extname(file)] || 'application/octet-stream' });
      });
      await page.goto('http://manpe.test/');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(review, name + '-viewport.png') });
      if (app === 'studio') await page.locator('#produtos').screenshot({ path: path.join(review, name + '-products.png') });
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Capturas geradas em .impeccable/review.');
})().catch(error => { console.error(error); process.exitCode = 1; });
