import { defineConfig } from '@playwright/test';

const BASE_URL =
  process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  // Ambiente compartilhado com outros candidatos: poucos workers para não sobrecarregar.
  workers: 2,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'api', testMatch: /.*\.api\.spec\.ts/ }],
});
