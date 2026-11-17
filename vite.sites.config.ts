import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { siteSeo } from './scripts/site-seo.mjs';

export default defineConfig(({ mode }) => {
  if (mode !== 'studio' && mode !== 'portfolio') throw new Error('Use --mode studio ou portfolio');
  return {
    root: resolve('apps', mode),
    appType: 'mpa',
    plugins: [react(), siteSeo(mode)],
    server: { fs: { allow: [resolve('.')] } },
    build: { outDir: resolve('artifacts', mode), emptyOutDir: true },
  };
});
