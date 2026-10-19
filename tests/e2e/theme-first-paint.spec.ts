import { test, expect } from '@playwright/test';
import { expectSiteTheme } from './set-mode';

for (const mode of ['light', 'dark'] as const) {
  for (const route of ['/', '/docs/components/input']) {
    test(`${mode}: ${route} paints the saved theme before hydration and keeps it after reload`, async ({
      page,
    }) => {
      await page.addInitScript((savedMode) => {
        localStorage.setItem('hextech-ui-color-mode', savedMode);
      }, mode);
      let release!: () => void;
      let blockedScripts = 0;
      const hydrationErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' && /hydrat/i.test(message.text()))
          hydrationErrors.push(message.text());
      });
      const hydration = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(/\/_next\/.*\.js(?:\?|$)/, async (request) => {
        blockedScripts++;
        await hydration;
        await request.continue();
      });
      const target = page.locator(route === '/' ? '.showcase-card' : '.preview-stage').first();
      const background = mode === 'light' ? 'rgb(247, 245, 238)' : 'rgb(1, 10, 19)';
      try {
        await page.goto(route, { waitUntil: 'commit' });
        await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
        await expect(target).toBeVisible();
        await expect.poll(() => blockedScripts).toBeGreaterThan(0);
        await expectSiteTheme(target, mode);
        // Network-blocked client bundles cannot fix a wrong server-rendered scope.
        if (route === '/')
          await expect(target).toHaveCSS(
            'background-image',
            new RegExp(mode === 'light' ? 'rgb\\(255, 255, 255\\)' : 'rgb\\(1, 10, 19\\)'),
          );
        else await expect(target).toHaveCSS('background-color', background);
      } finally {
        release();
        await page.unrouteAll({ behavior: 'wait' });
      }
      await page.waitForLoadState('domcontentloaded');
      if (route !== '/')
        await expect(page.locator('.component-preview')).toHaveAttribute(
          'data-preview-ready',
          'true',
        );
      await expectSiteTheme(target, mode);
      if (route !== '/') await expect(target).toHaveCSS('background-color', background);
      expect(hydrationErrors).toEqual([]);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
      await expectSiteTheme(target, mode);
      if (route !== '/') await expect(target).toHaveCSS('background-color', background);
    });
  }
}
