import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
import path from 'node:path';
export default defineConfig({
  ...base,
  testDir: './tests/visual',
  testMatch: '**/*.spec.ts',
  workers: 2,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.005,
      stylePath: path.resolve('tests/visual/component-capture.css'),
    },
  },
  reporter: [['list']],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
