import { selectExample } from './select-example';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';
test('object combobox uses IDs, custom content, disabled options and refreshed identities', async ({
  page,
}) => {
  await openPage(page, '/docs/components/combobox');
  await selectExample(page, { label: 'Object records' });
  const input = page.getByRole('combobox', { name: 'Party leader', exact: true });
  await expect(input).toHaveValue('Avery');
  await page.getByRole('button', { name: 'Refresh option records' }).click();
  await expect(input).toHaveValue('Avery refreshed');
  await input.fill('Sage');
  await expect(page.getByRole('option', { name: 'Sage', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await input.fill('Row');
  await expect(page.getByRole('option', { name: 'Rowan', exact: true })).toContainText('Guard');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Rowan');
  await page.getByRole('button', { name: 'Read form IDs' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Submitted IDs:' })).toHaveText(
    'Submitted IDs: rowan',
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
test('object multiple selection preserves stable chips and serializes every selected ID', async ({
  page,
}) => {
  await openPage(page, '/docs/components/multiple-select');
  await selectExample(page, { label: 'Object records' });
  await page.getByRole('button', { name: 'Refresh option records' }).click();
  await expect(
    page.getByRole('button', { name: 'Remove Avery refreshed', exact: true }),
  ).toBeVisible();
  await page.getByRole('combobox', { name: 'Party members', exact: true }).fill('Row');
  await page.getByRole('option', { name: 'Rowan', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Read form IDs' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Submitted IDs:' })).toHaveText(
    'Submitted IDs: avery, rowan',
  );
  await page.getByRole('button', { name: 'Remove Avery refreshed', exact: true }).click();
  await page.getByRole('button', { name: 'Remove Rowan', exact: true }).click();
  await expect(page.getByText('No party members selected', { exact: true })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
test('autocomplete retains free text, accepts optional suggestions and submits text', async ({
  page,
}) => {
  await openPage(page, '/docs/components/autocomplete');
  const input = page.getByRole('combobox', { name: 'Build query', exact: true });
  await input.fill('A completely custom build');
  await page.keyboard.press('Escape');
  await expect(input).toHaveValue('A completely custom build');
  await page.keyboard.press('Escape');
  await expect(input).toHaveValue('A completely custom build');
  await page.getByRole('button', { name: 'Use query', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Query:' })).toHaveText(
    'Query: A completely custom build',
  );
  await input.fill('Row');
  await page.getByRole('option', { name: 'Rowan', exact: true }).click();
  await expect(input).toHaveValue('Rowan');
  await page.getByRole('button', { name: 'Use query', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Query:' })).toHaveText('Query: Rowan');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});

test('selection sizes differ and closed Escape clearing is explicitly opt-in', async ({ page }) => {
  await openPage(page, '/docs/components/multiple-select');
  await selectExample(page, { label: 'Object records' });
  const chips = page.getByRole('group', { name: 'Party members selections' });
  const size = page.getByRole('combobox', { name: 'Record control size' });
  await size.selectOption('small');
  const small = (await chips.boundingBox())!.height;
  await size.selectOption('medium');
  const medium = (await chips.boundingBox())!.height;
  await size.selectOption('large');
  const large = (await chips.boundingBox())!.height;
  expect(small).toBeLessThan(medium);
  expect(medium).toBeLessThan(large);
  const input = page.getByRole('combobox', { name: 'Party members', exact: true });
  await input.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Remove Avery', exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Escape clears selections' }).check();
  await input.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Remove Avery', exact: true })).toHaveCount(0);
});

test('preserving closed Escape values still dismisses a parent dialog', async ({ page }) => {
  await openPage(page, '/docs/components/combobox');
  await selectExample(page, { label: 'Object records' });
  await page.getByRole('button', { name: 'Try selection in a dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Party leader dialog' });
  const input = dialog.getByRole('combobox', { name: 'Dialog party leader', exact: true });
  await input.fill('Row');
  await expect(page.getByRole('option', { name: 'Rowan', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('combobox', { name: 'Party leader', exact: true })).toHaveValue(
    'Avery',
  );
});
