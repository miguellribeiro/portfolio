import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { preview } from 'vite';

const results = [];
for (const app of ['studio', 'portfolio']) {
  const server = await preview({ configFile: resolve('vite.sites.config.ts'), mode: app, logLevel: 'silent', preview: { host: '127.0.0.1', port: 0, strictPort: true } });
  try {
    const address = server.httpServer.address();
    assert(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const checks = [];
    for (const [path, status, mime] of [
      ['/', 200, 'text/html'], ['/favicon.svg', 200, 'image/svg+xml'],
      ['/favicon-32.png', 200, 'image/png'], ['/apple-touch-icon.png', 200, 'image/png'],
      ['/og.png', 200, 'image/png'], ['/sitemap.xml', 200, 'text/xml'],
      ['/robots.txt', 200, 'text/plain'], ['/404.html', 200, 'text/html'],
      ['/en', 404, null], ['/en/', 404, null], ['/en/index.html', 404, null],
      ['/es', 404, null], ['/es/', 404, null], ['/es/index.html', 404, null], ['/pagina-inexistente', 404, null],
    ]) {
      const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
      assert.equal(response.status, status, `${app} ${path}`);
      const type = response.headers.get('content-type');
      if (mime) assert(type?.startsWith(mime), `${app} ${path}: ${type}`);
      const body = Buffer.from(await response.arrayBuffer());
      if (path === '/') assert(body.includes(Buffer.from('manpe-scene')), 'HTML pré-renderizado ausente.');
      if (status === 404) assert(!body.includes(Buffer.from('manpe-scene')), 'Uma URL ausente devolveu a home.');
      checks.push({ path, status: response.status, contentType: type, xRobotsTag: response.headers.get('x-robots-tag'), bytes: body.length });
    }
    results.push({ app, checks });
  } finally { await new Promise((done, reject) => server.httpServer.close(error => error ? reject(error) : done())); }
}
await mkdir(resolve('artifacts/seo-gate'), { recursive: true });
const output = resolve('artifacts/seo-gate/http.json');
await writeFile(output, JSON.stringify({ method: 'Vite preview HTTP loopback; does not apply Cloudflare _headers or custom 404 routing.', results }, null, 2));
console.log(`SEO HTTP: ${results.length} hosts locais aprovados; relatório em ${output}.`);
