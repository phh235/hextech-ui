import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('virtualized list keeps active descendants mounted, navigates far rows and selects', async ({
  page,
}) => {
  await openPage(page, '/docs/components/virtual-listbox');
  const list = page.getByRole('listbox', { name: 'Practice builds' });
  await list.focus();
  expect(await list.getByRole('option').count()).toBeLessThan(30);
  await page.keyboard.press('End');
  const last = list.getByRole('option', { name: 'Practice build 1000', exact: true });
  await expect(last).toBeVisible();
  await expect(last).toHaveAttribute('aria-posinset', '1000');
  await expect(last).toHaveAttribute('aria-setsize', '1000');
  await expect(list).toHaveAttribute('aria-activedescendant', (await last.getAttribute('id'))!);
  await page.keyboard.press('Space');
  await expect(last).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'Selected builds:' })).toContainText(
    '1000',
  );
  await page.keyboard.press('Home');
  const first = list.getByRole('option', { name: 'Practice build 0001', exact: true });
  await expect(first).toBeVisible();
  await first.click();
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await list.focus();
  for (let index = 0; index < 9; index++) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(
    list.getByRole('option', { name: 'Practice build 0010', exact: true }),
  ).toHaveAttribute('aria-selected', 'false');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
