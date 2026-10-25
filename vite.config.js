import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seoHeads from './scripts/seo-heads.js';

// Site oficial: https://manpestudio.com.br (Cloudflare Worker "manpestudio"), base "/".
// seoHeads() gera dist/index.html (pt-BR) + dist/en/ e dist/es/ com <head> pré-renderizado.
export default defineConfig({
  plugins: [react(), seoHeads()],
  base: process.env.BASE_PATH || '/',
});
