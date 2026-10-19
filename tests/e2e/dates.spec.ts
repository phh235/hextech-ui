import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('calendar roving focus, month navigation, and range selection work', async ({ page }) => {
  await openPage(page, '/docs/components/calendar');
  const calendar = page.getByRole('group', { name: 'Session date', exact: true });
  const selected = calendar.getByRole('button', {
    name: 'Saturday, October 17, 2026',
    exact: true,
  });
  await selected.focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    calendar.getByRole('button', { name: 'Sunday, October 18, 2026', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect(calendar.getByRole('grid')).toHaveAccessibleName('November 2026');
  await page.keyboard.press('Enter');
  await expect(calendar.locator('[role="gridcell"][aria-selected="true"]')).toHaveCount(1);
  const range = page.getByRole('group', { name: 'Training window', exact: true });
  await range.getByRole('button', { name: 'Tuesday, October 20, 2026', exact: true }).click();
  await range.getByRole('button', { name: 'Thursday, October 22, 2026', exact: true }).click();
  await expect(range.locator('[role="gridcell"][aria-selected="true"]')).toHaveCount(3);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
test('date picker focuses its selected day, updates the native field and restores focus', async ({
  page,
}) => {
  await openPage(page, '/docs/components/date-picker');
  const trigger = page.getByRole('button', { name: 'Open Session date calendar', exact: true });
  await trigger.click();
  const calendar = page.getByRole('group', { name: 'Session date calendar', exact: true });
  const day = calendar.getByRole('button', { name: 'Saturday, October 17, 2026', exact: true });
  await expect(day).toBeFocused();
  await calendar.getByRole('button', { name: 'Tuesday, October 20, 2026', exact: true }).click();
  await expect(calendar).toBeHidden();
  await expect(page.getByLabel('Session date', { exact: true })).toHaveValue('2026-10-20');
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Choose Training range', exact: true }).click();
  const range = page.getByRole('group', { name: 'Training range calendar', exact: true });
  await range.getByRole('button', { name: 'Tuesday, October 20, 2026', exact: true }).click();
  await expect(range).toBeVisible();
  await range.getByRole('button', { name: 'Thursday, October 22, 2026', exact: true }).click();
  await expect(page.getByLabel('Training start', { exact: true })).toHaveValue('2026-10-20');
  await expect(page.getByLabel('Training end', { exact: true })).toHaveValue('2026-10-22');
});
test('date range editing preserves invalid drafts and blocks invalid native form values', async ({
  page,
}) => {
  await openPage(page, '/docs/components/date-picker');
  const start = page.getByLabel('Training start', { exact: true });
  const end = page.getByLabel('Training end', { exact: true });
  await end.fill('2026-10-10');
  await expect(end).toHaveValue('2026-10-10');
  await expect(end).toHaveAttribute('aria-invalid', 'true');
  expect(await end.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(false);
  await end.fill('2026-10-25');
  await expect(end).not.toHaveAttribute('aria-invalid', 'true');
  await expect(start).toHaveValue('2026-10-14');
  expect(await end.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(true);
});
test('search clear restores focus and toast notifications can be dismissed', async ({ page }) => {
  await openPage(page, '/docs/components/search-field');
  const search = page.getByRole('searchbox', { name: 'Search builds' });
  await search.fill('Balanced');
  await page.getByRole('button', { name: 'Clear Search builds' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await openPage(page, '/docs/components/toast');
  await page.getByRole('button', { name: 'Success' }).click();
  await expect(page.getByText('Build saved', { exact: true })).toBeVisible();
  // Base UI exposes toast actions to keyboard users after entering the viewport.
  await page.keyboard.press('F6');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByText('Build saved', { exact: true })).toBeHidden();
});
