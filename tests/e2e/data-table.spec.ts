// Rich behavioral states use internal fixtures; catalog/composition suites verify public demos and copied source.
import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('rich table sorts, selects pages and paginates', async ({ page }) => {
  await openPage(page, '/internal/components/data-table');
  const grid = page.getByRole('grid', { name: 'Practice roster' });
  await expect(grid.getByRole('row')).toHaveCount(4);
  await grid.getByRole('columnheader', { name: /Score/ }).getByRole('button').click();
  await expect(grid.getByRole('row').nth(1)).toContainText('Quinn');
  await expect(grid.getByRole('columnheader', { name: /Score/ })).toHaveAttribute(
    'aria-sort',
    'descending',
  );
  await grid.getByRole('checkbox', { name: 'Select current page' }).click();
  await expect(grid.locator('tbody [aria-selected="true"]')).toHaveCount(3);
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(grid.getByRole('row')).toHaveCount(3);
  await expect(page.getByRole('status').filter({ hasText: 'Page 2' })).toContainText('3 selected');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
test('rich table navigates cells, edits without stealing arrows, resizes and reorders', async ({
  page,
}) => {
  await openPage(page, '/internal/components/data-table');
  const grid = page.getByRole('grid', { name: 'Practice roster' });
  const first = grid.getByRole('row').nth(1).getByRole('gridcell').nth(1);
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(grid.getByRole('row').nth(2).getByRole('gridcell').nth(1)).toBeFocused();
  await page.keyboard.press('Alt+ArrowUp');
  await expect(grid.getByRole('row').nth(1)).toContainText('Rowan');
  await grid.getByRole('row').nth(1).getByRole('gridcell').nth(3).focus();
  await page.keyboard.press('F2');
  const note = grid.getByRole('textbox', { name: 'Note for Rowan' });
  await expect(note).toBeFocused();
  await note.fill('Map review');
  await page.keyboard.press('ArrowLeft');
  await expect(note).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(grid.getByRole('row').nth(1).getByRole('gridcell').nth(3)).toBeFocused();
  const resize = grid.getByRole('slider', { name: 'Resize Player column' });
  const before = Number(await resize.inputValue());
  await resize.focus();
  await page.keyboard.press('ArrowRight');
  await expect(resize).toHaveValue(String(before + 1));
  const edge = await resize.boundingBox();
  if (!edge) throw new Error('Column resize edge is missing');
  await page.mouse.move(edge.x + edge.width / 2, edge.y + edge.height / 2);
  await page.mouse.down();
  try {
    await page.mouse.move(edge.x + edge.width / 2 + 32, edge.y + edge.height / 2);
    await expect(resize).toHaveValue(String(before + 33));
  } finally {
    await page.mouse.up();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
