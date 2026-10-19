import { selectExample } from '../e2e/select-example';
import { test, expect } from '@playwright/test';
import { openPage } from '../e2e/navigation';
const cases = [
  'autocomplete',
  'combobox',
  'multiple-select',
  'button',
  'card',
  'input',
  'field',
  'checkbox',
  'radio',
  'switch',
  'tabs',
  'calendar',
  'tree',
  'token-field',
  'charts',
  'data-table',
  'table-load-more',
  'tag-group',
  'select',
  'date-picker',
];
for (const name of cases)
  test(`${name} retains its reviewed default geometry`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, `/internal/components/${name}`);
    await page.evaluate(() => document.fonts.ready);
    if (name === 'token-field')
      await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toHaveAttribute(
        'aria-busy',
        'false',
      );
    if (name === 'charts')
      await expect(page.locator('[data-hextech-chart-ready="true"]')).toHaveCount(5);
    if (name === 'table-load-more')
      await expect(page.locator('[data-hextech-ui="table-load-more"]')).toHaveAttribute(
        'data-hextech-ready',
        'true',
      );
    await expect(page.locator('.preview-viewport')).toHaveScreenshot(`${name}-default.png`);
  });
test('input focus and disabled frames retain their reference styling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/internal/components/input');
  const input = page.getByRole('textbox', { name: 'Text input', exact: true });
  await input.focus();
  await input.evaluate((node: HTMLInputElement) =>
    node.setSelectionRange(node.value.length, node.value.length),
  );
  await expect(page.locator('.preview-viewport')).toHaveScreenshot('input-focus.png');
  await selectExample(page, '1');
  await expect(input).toBeDisabled();
  await expect(page.locator('.preview-viewport')).toHaveScreenshot('input-disabled.png');
});

test('button focus and disabled states retain their visual hierarchy', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/internal/components/button');
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'Queue up', exact: true }).focus();
  await expect(page.locator('.preview-viewport')).toHaveScreenshot('button-focus.png');
  await selectExample(page, '1');
  await expect(page.locator('.preview-viewport')).toHaveScreenshot('button-disabled.png');
});
test('scoped dark dialog retains portal theme and layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/internal/components/dialog');
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  await page.mouse.move(0, 0);
  await expect(page.getByRole('dialog')).toHaveScreenshot('dialog-dark-portal.png');
});
for (const name of ['combobox', 'multiple-select'])
  test(`${name} object records retain layout and custom option content`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, `/internal/components/${name}`);
    await selectExample(page, { label: 'Object records' });
    await page.getByRole('button', { name: 'Refresh option records' }).click();
    if (name === 'combobox') {
      await page.getByRole('button', { name: 'Show Party leader options' }).click();
      await expect(page.getByRole('listbox')).toHaveScreenshot('combobox-object-options.png');
    } else
      await expect(page.locator('.preview-viewport')).toHaveScreenshot(
        'multiple-select-object-chips.png',
      );
  });

test('table loading retains keyboard focus and its pending appearance', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/internal/components/table-load-more');
  await selectExample(page, { label: 'Async states' });
  const demo = page.getByRole('region', { name: 'Table loading demo', exact: true });
  await demo.getByLabel('Automatic loading', { exact: true }).uncheck();
  await demo.getByLabel('Pause loading', { exact: true }).check();
  await page.keyboard.press('Tab');
  await expect(demo.getByRole('button', { name: 'Load more rows', exact: true })).toBeEnabled();
  await demo.getByRole('button', { name: 'Load more rows', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(demo.getByRole('button', { name: 'Loading more rows', exact: true })).toBeFocused();
  await expect(page.locator('.preview-viewport')).toHaveScreenshot('table-load-more-loading.png');
});
