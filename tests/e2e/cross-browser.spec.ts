import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setMode } from './set-mode';
test('complete code examples retain readable comments in both modes', async ({ page }) => {
  await openPage(page, '/docs/components/table-load-more');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  const code = page.locator('.preview-code pre').first();
  await page.locator('.preview-code figure.shiki code span[style]').first().waitFor();
  await expect(code).toContainText('Local demo data; replace this with your own data source.');
  await code.scrollIntoViewIfNeeded();
  for (const mode of ['dark', 'light'] as const) {
    await setMode(page, mode);
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
      mode,
    ).toEqual([]);
  }
});
test('native home navigation and previews work across browser engines', async ({ page }) => {
  await openPage(page, '/');
  await expect(page.locator('h1')).toContainText('League-inspired components.');
  for (const area of ['#nd-nav', '.site-footer']) {
    await expect(
      page.locator(`${area} a[href="https://github.com/phh235/hextech-ui"]`),
    ).toHaveCount(1);
  }
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark');
  await expect(page.locator('.showcase-card')).toHaveCount(12);
  await expect(page.locator('[data-hextech-chart-ready], .hx-table')).toHaveCount(0);
  await expect(page.getByRole('slider', { name: 'Music', exact: true })).toBeVisible();
  await expect(page.locator('.landing-open, .dx-grid, .hero-install')).toHaveCount(0);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.getByRole('tab', { name: 'Runes' }).click();
  await expect(
    page.locator('.showcase-card').getByRole('tabpanel', { name: 'Runes', exact: true }),
  ).toContainText('Choose the details');
  await page.getByRole('link', { name: 'Browse Components', exact: true }).click();
  await expect(page).toHaveURL('/docs/components');
  await expect(page.getByRole('heading', { name: /^All Components/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
