import { expectSiteTheme, setMode } from './set-mode';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import manifest from '../../packages/react/component-manifest.json' with { type: 'json' };
import { openPage } from './navigation';

for (const mode of ['dark', 'light'] as const) {
  test(`${mode} preference persists and follows previews and dialog portals`, async ({ page }) => {
    await openPage(page, '/');
    await setMode(page, mode);
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
    await openPage(page, '/docs/components/dialog');
    await expect(page.locator('#nd-docs-layout')).toBeVisible();
    await expectSiteTheme(page.locator('.preview-stage'), mode);
    await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
    await expectSiteTheme(page.locator('.hx-modal-viewport'), mode);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await page.screenshot({
      path: `.artifacts/screenshots/native-fumadocs-${mode}-${test.info().project.name}.png`,
      fullPage: true,
    });
  });

  for (let offset = 0; offset < manifest.length; offset += 12) {
    const batch = manifest.slice(offset, offset + 12);
    test(`${mode} component catalog pages ${offset + 1}–${offset + batch.length} remain readable and fit their viewport`, async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile);
      test.setTimeout(180000);
      await openPage(page, '/');
      await setMode(page, mode);
      const failures = [];
      for (const item of batch) {
        await openPage(page, `/docs/components/${item.name}`);
        await expectSiteTheme(page.locator('.preview-stage'), mode);
        const violations = (
          await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
        ).violations;
        if (violations.length) failures.push({ component: item.name, violations });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          item.name,
        ).toBe(true);
      }
      await test.info().attach(`${mode}-catalog-${offset + 1}-a11y`, {
        body: JSON.stringify(failures, null, 2),
        contentType: 'application/json',
      });
      expect(failures).toEqual([]);
    });
  }
}
