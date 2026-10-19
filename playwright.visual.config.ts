import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
import path from 'node:path';
export default defineConfig({
  ...base,
  testDir: './tests/visual',
  outputDir: path.resolve('.artifacts/visual-results'),
  snapshotPathTemplate: path.resolve(
    '.artifacts/visual-baselines/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
  ),
  testMatch: '**/*.spec.ts',
  workers: process.env.CI ? 1 : 2,
  timeout: 60000,
  use: { ...base.use, locale: 'en-US', launchOptions: { args: ['--lang=en-US'] } },
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
