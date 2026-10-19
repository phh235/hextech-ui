// Rich behavioral states use internal fixtures; catalog/composition suites verify public demos and copied source.
import { selectExample } from './select-example';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';

const settle = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
async function variant(page: Page, name: string) {
  await selectExample(page, { label: name });
  return page.getByRole('region', { name: 'Table loading demo', exact: true });
}

test('manual loading remains usable by keyboard and touch until exhaustion', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/internal/components/table-load-more');
  const demo = page.getByRole('region', { name: 'Table loading demo', exact: true });
  const action = demo.getByRole('button', { name: 'Load more rows', exact: true });
  if (isMobile) await action.tap();
  else {
    await action.focus();
    await action.press('Enter');
  }
  await expect(demo.locator('[data-row-count]')).toHaveText('6');
  await expect(demo.locator('[data-load-requests]')).toHaveText('1');
  await action.focus();
  await action.press('Enter');
  await expect(demo.locator('[data-row-count]')).toHaveText('9');
  const completed = demo.getByRole('button', { name: 'All rows loaded', exact: true });
  await expect(completed).toBeDisabled();
  await expect(completed).toBeFocused();
  await completed.press('Enter');
  await settle(page);
  await expect(demo.locator('[data-load-requests]')).toHaveText('2');
});

test('fresh intersection samples prevent extra loading after appended rows move the sentinel away', async ({
  page,
}) => {
  await openPage(page, '/internal/components/table-load-more');
  const demo = await variant(page, 'Automatic');
  const scroll = demo.getByRole('region', { name: 'Practice notes scroll area' });
  await settle(page);
  await expect(demo.locator('[data-load-requests]')).toHaveText('0');
  await scroll.focus();
  await page.keyboard.press('End');
  await expect(demo.locator('[data-row-count]')).toHaveText('15');
  await settle(page);
  await expect(demo.locator('[data-load-requests]')).toHaveText('1');
  await scroll.focus();
  await page.keyboard.press('End');
  await expect(demo.locator('[data-row-count]')).toHaveText('18');
  await settle(page);
  await expect(demo.locator('[data-load-requests]')).toHaveText('2');
  await expect(demo.getByRole('button', { name: 'All rows loaded', exact: true })).toBeDisabled();
  expect(
    (await new AxeBuilder({ page }).include('.component-preview').analyze()).violations,
  ).toEqual([]);
  expect(await demo.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
});

test('pending, stalled, failed, disabled and aborted loading states recover without duplicate requests', async ({
  page,
}) => {
  await openPage(page, '/internal/components/table-load-more');
  const demo = await variant(page, 'Async states');
  const count = demo.locator('[data-load-requests]');
  const complete = () =>
    demo
      .getByRole('button', { name: 'Complete load', exact: true })
      .evaluate((button) => (button as HTMLButtonElement).click());
  const scroll = demo.getByRole('region', { name: 'Practice notes scroll area' });
  await demo.getByLabel('Pause loading', { exact: true }).check();
  await demo.getByLabel('Keep progress unchanged', { exact: true }).check();
  await scroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(count).toHaveText('1');
  const loading = demo.getByRole('button', { name: 'Loading more rows', exact: true });
  await loading.focus();
  await loading.press('Enter');
  await expect(loading).toBeFocused();
  await expect(loading).toHaveCSS('opacity', '1');
  await expect(count).toHaveText('1');
  await complete();
  await settle(page);
  await expect(demo.getByRole('button', { name: 'Load more rows', exact: true })).toBeFocused();
  await scroll.evaluate((element) => {
    element.scrollTop = 0;
  });
  await settle(page);
  await scroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await settle(page);
  await expect(count).toHaveText('1');
  await demo.getByLabel('Keep progress unchanged', { exact: true }).uncheck();
  await demo.getByLabel('Reject request', { exact: true }).check();
  await demo.getByRole('button', { name: 'Load more rows', exact: true }).click();
  await expect(count).toHaveText('2');
  await complete();
  await expect(demo.getByRole('alert')).toHaveText('Could not load more rows.');
  await settle(page);
  await expect(count).toHaveText('2');
  expect(
    (await new AxeBuilder({ page }).include('.component-preview').analyze()).violations,
  ).toEqual([]);
  expect(
    (await new AxeBuilder({ page }).include('.component-preview').analyze()).violations,
  ).toEqual([]);
  await demo.getByLabel('Reject request', { exact: true }).uncheck();
  await demo.getByRole('button', { name: 'Retry loading rows', exact: true }).click();
  await expect(count).toHaveText('3');
  await demo.getByLabel('Show load row', { exact: true }).uncheck();
  await expect(demo.locator('[data-load-aborts]')).toHaveText('1');
  await expect(demo.locator('[data-row-count]')).toHaveText('12');
  await demo.getByLabel('Automatic loading', { exact: true }).uncheck();
  await demo.getByLabel('Show load row', { exact: true }).check();
  await demo.getByLabel('Disable loading', { exact: true }).check();
  await expect(demo.getByRole('button', { name: 'Load more rows', exact: true })).toBeDisabled();
  await demo.getByLabel('Disable loading', { exact: true }).uncheck();
  await demo.getByLabel('External loading', { exact: true }).check();
  await expect(loading).toBeDisabled();
  await loading.focus();
  await loading.press('Enter');
  await expect(count).toHaveText('3');
  await demo.getByLabel('External loading', { exact: true }).uncheck();
  await demo.getByRole('button', { name: 'Load more rows', exact: true }).click();
  await expect(count).toHaveText('4');
  await complete();
  await expect(demo.locator('[data-row-count]')).toHaveText('15');
});

test('rich DataTable composes the canonical loading row with correct grid counts', async ({
  page,
}) => {
  await openPage(page, '/internal/components/data-table');
  await selectExample(page, { label: 'Load more' });
  const demo = page.getByRole('region', { name: 'Data table loading demo', exact: true });
  const viewport = demo.getByRole('region', { name: 'Loading practice roster scroll area' });
  const grid = demo.getByRole('grid', { name: 'Loading practice roster' });
  await expect(grid).toHaveAttribute('aria-rowcount', '-1');
  await expect(grid.getByRole('row').first()).toHaveAttribute('aria-rowindex', '1');
  await settle(page);
  await expect(demo.locator('[data-roster-requests]')).toHaveText('0');
  await viewport.scrollIntoViewIfNeeded();
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(demo.locator('[data-roster-count]')).toHaveText('15');
  await settle(page);
  await expect(demo.locator('[data-roster-requests]')).toHaveText('1');
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(demo.locator('[data-roster-count]')).toHaveText('18');
  await expect(grid).toHaveAttribute('aria-rowcount', '20');
  await expect(grid.getByRole('row')).toHaveCount(20);
  expect(
    await grid
      .getByRole('row')
      .evaluateAll((rows) => rows.map((row) => row.getAttribute('aria-rowindex'))),
  ).toEqual(Array.from({ length: 20 }, (_, index) => String(index + 1)));
  await expect(grid.getByRole('button', { name: 'All rows loaded', exact: true })).toBeDisabled();
  await settle(page);
  await expect(demo.locator('[data-roster-requests]')).toHaveText('2');
  expect(
    (await new AxeBuilder({ page }).include('.component-preview').analyze()).violations,
  ).toEqual([]);
});
