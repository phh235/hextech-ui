// Rich behavioral states use internal fixtures; catalog/composition suites verify public demos and copied source.
import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dialog contains focus, supports editing and escape, and restores focus', async ({ page }) => {
  await openPage(page, '/internal/components/dialog');
  const trigger = page.getByRole('button', { name: 'Edit profile' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Display name' }).fill('Moonlight');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('alert dialog requires a decision and respects cancellation', async ({ page }) => {
  await openPage(page, '/internal/components/alert-dialog');
  await page.getByRole('button', { name: 'Leave party', exact: true }).click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toHaveAccessibleName('Leave this party?');
  await page.mouse.click(5, 300);
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Stay in party' }).click();
  await expect(dialog).toBeHidden();
});

test('popover, menu actions and nested menu keyboard selection work', async ({ page }) => {
  await openPage(page, '/internal/components/popover');
  await page.getByRole('button', { name: 'Party details' }).click();
  await expect(page.getByText('A little more context.')).toBeVisible();
  await page.getByRole('button', { name: 'Got it' }).click();
  await openPage(page, '/internal/components/menu');
  const trigger = page.getByRole('button', { name: 'Build actions' });
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Save build', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Build saved locally.' })).toContainText(
    'Build saved locally.',
  );
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Export', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Text format' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('tabs and disclosure controls expose associated content', async ({ page }) => {
  await openPage(page, '/internal/components/tabs');
  await page.getByRole('tab', { name: 'Runes', exact: true }).click();
  await expect(page.getByText('Choose the details that fit your playstyle.')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'History', exact: true })).toBeDisabled();
  await openPage(page, '/internal/components/accordion');
  const trigger = page.getByRole('button', { name: 'Do I own the source?' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByText('Yes. Registry installation copies editable source into your project.'),
  ).toBeVisible();
  await openPage(page, '/internal/components/collapsible');
  await page.getByRole('button', { name: 'Show build notes' }).click();
  await expect(
    page.getByText('Keep the first step simple. Adapt after the lane is understood.'),
  ).toBeVisible();
});

test('number bounds, slider keyboard updates, and progress semantics hold', async ({ page }) => {
  await openPage(page, '/internal/components/number-field');
  const input = page.getByRole('textbox', { name: 'Party size' });
  await expect(input).toHaveValue('3');
  await page.getByRole('button', { name: 'Increase Party size' }).click();
  await expect(input).toHaveValue('4');
  await page.getByRole('button', { name: 'Increase Party size' }).click();
  await expect(input).toHaveValue('5');
  await expect(page.getByRole('button', { name: 'Increase Party size' })).toBeDisabled();
  await openPage(page, '/internal/components/slider');
  const slider = page.getByRole('slider', { name: 'Effects intensity' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '41');
  await expect(page.getByRole('slider', { name: 'Minimum range' })).toHaveAttribute(
    'aria-valuenow',
    '25',
  );
  await openPage(page, '/internal/components/progress');
  await expect(page.getByRole('progressbar', { name: 'Build progress' })).toHaveAttribute(
    'aria-valuenow',
    '64',
  );
  await expect(page.getByRole('progressbar', { name: 'Finding a match' })).not.toHaveAttribute(
    'aria-valuenow',
  );
});

test('select, filtered combobox, empty state and removable chips work', async ({ page }) => {
  await openPage(page, '/internal/components/select');
  await page.getByRole('combobox', { name: 'Preferred role' }).click();
  await page.getByRole('option', { name: 'Jungle', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Preferred role' })).toContainText('Jungle');
  await openPage(page, '/internal/components/combobox');
  const combo = page.getByRole('combobox', { name: 'Find a role', exact: true });
  await combo.fill('Jun');
  await expect(page.getByRole('option', { name: 'Jungle', exact: true })).toBeVisible();
  await page.getByRole('option', { name: 'Jungle', exact: true }).click();
  await expect(combo).toHaveValue('Jungle');
  await combo.fill('unmatched query');
  await expect(page.getByText('No results found.')).toBeVisible();
  await openPage(page, '/internal/components/multiple-select');
  await expect(page.getByRole('button', { name: 'Remove Support' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Preferred roles', exact: true }).fill('Jun');
  await page.getByRole('option', { name: 'Jungle', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Remove Jungle' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Support' }).click();
  await expect(page.getByRole('button', { name: 'Remove Support' })).toBeHidden();
});
