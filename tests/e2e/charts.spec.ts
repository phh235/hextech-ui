import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('charts provide keyboard selection, toggleable series and complete readable data', async ({
  page,
}) => {
  await openPage(page, '/docs/components/charts');
  const chart = page.locator('svg[tabindex="0"]').first();
  await expect(page.locator('[data-hextech-chart-ready]').first()).toHaveAttribute(
    'data-hextech-chart-ready',
    'true',
  );
  await expect(chart).toBeVisible();
  await expect(page.locator('svg[tabindex="0"]')).toHaveCount(5);
  const custom = page.locator('figure').filter({ hasText: 'Compose your own' }).locator('svg');
  await expect(custom).toBeVisible();
  expect(await custom.evaluate((node) => node.outerHTML)).toContain('--hextech-ui-gold-300');
  await chart.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Selected' })).toContainText('minute');
  const frame = page.locator('figure').filter({ hasText: 'Training timeline' });
  const resources = frame.getByRole('button', { name: 'Resources series' });
  await resources.click();
  await expect(resources).toHaveAttribute('aria-pressed', 'false');
  await frame.getByRole('button', { name: 'Pressure series' }).click();
  await expect(frame.getByText('All series are hidden.')).toBeVisible();
  await frame.getByText('View chart data', { exact: true }).click();
  await expect(frame.getByRole('table')).toBeVisible();
  await expect(frame.getByRole('row')).toHaveCount(6);
  await expect(frame.getByRole('cell', { name: '39', exact: true })).toBeVisible();
  await resources.click();
  await expect(frame.locator('svg[tabindex="0"]')).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
