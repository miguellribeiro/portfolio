import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  if (mode !== 'studio' && mode !== 'portfolio') throw new Error('Use --mode studio ou portfolio');
  return {
    root: resolve('apps', mode),
    plugins: [react()],
    server: { fs: { allow: [resolve('.')] } },
    build: { outDir: resolve('artifacts', mode), emptyOutDir: true },
  };
});
