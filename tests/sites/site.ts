import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

export async function siteURL(page: Page, app: 'studio' | 'portfolio', port: number) {
  if (process.env.MANPE_OFFLINE_QA !== '1') return `http://127.0.0.1:${port}`;
  const root = resolve('artifacts', app);
  await page.route('http://manpe.test/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const file = resolve(root, path === '/' ? 'index.html' : path.slice(1));
    if (!file.startsWith(root + sep)) { await route.abort(); return; }
    const types: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
    try { await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] || 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
  return 'http://manpe.test/';
}
