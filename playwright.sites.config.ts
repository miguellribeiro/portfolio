import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/sites',
  outputDir: 'artifacts/test-results',
  use: { channel: 'msedge', headless: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 960 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' } },
  ],
  webServer: process.env.MANPE_OFFLINE_QA === '1' ? undefined : [
    { command: 'npm run preview:studio -- --host 127.0.0.1', url: 'http://127.0.0.1:4174', reuseExistingServer: false },
    { command: 'npm run preview:portfolio -- --host 127.0.0.1', url: 'http://127.0.0.1:4175', reuseExistingServer: false },
  ],
});
