import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH é definido no workflow do GitHub Pages (ex.: /portfolio/).
// Em Vercel/domínio próprio, deixe "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
});
