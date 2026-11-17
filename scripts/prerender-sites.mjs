import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { writeSiteFiles } from './site-seo.mjs';

const app = process.argv[2];
if (app !== 'studio' && app !== 'portfolio') throw new Error('Escolha studio ou portfolio.');
const output = resolve('artifacts', app, 'index.html');
const template = await readFile(output, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('O build precisa conter um root vazio antes do pré-render.');

// Build-time only: the published artifacts need no Node server or runtime SSR.
const serverOutput = resolve('artifacts', 'ssr', app);
await build({
  configFile: resolve('vite.sites.config.ts'),
  mode: app,
  build: {
    ssr: resolve('apps', app, 'render.tsx'),
    outDir: serverOutput,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'render.mjs' } },
  },
});
const { render } = await import(pathToFileURL(resolve(serverOutput, 'render.mjs')).href);
const html = render();
if (!html.includes('<h1') || !html.includes('manpe-scene')) throw new Error('Conteúdo ou bosque ausente no pré-render.');
// A replacement callback preserves literal dollar signs in supplied content.
await writeFile(output, template.replace(marker, () => `<div id="root">${html}</div>`));
await writeSiteFiles(app, resolve('artifacts', app));
console.log(`Pré-render ${app}: conteúdo e SVGs presentes no HTML estático.`);
