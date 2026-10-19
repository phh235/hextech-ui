import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  // Keep the heavier browser engines within a contributor machine's memory budget.
  workers: 1,
  testIgnore: ['**/docs.spec.ts', '**/landing.spec.ts'],
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/cross', open: 'never' }]],
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
