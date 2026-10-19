import { selectExample } from './select-example';
import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import manifest from '../../packages/react/component-manifest.json' with { type: 'json' };

for (let offset = 0; offset < manifest.length; offset += 12) {
  const batch = manifest.slice(offset, offset + 12);
  test(`Catalog reference pages ${offset + 1}–${offset + batch.length} render without accessibility or runtime errors`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const item of batch) {
      await openPage(page, `/docs/components/${item.name}`);
      await expect(page.locator('h1')).toHaveText(item.title);
      await expect(page.getByRole('region', { name: item.title, exact: true })).toBeVisible();
      await expect(page.locator('.preview-viewport > *').first()).toBeVisible();
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
        item.name,
      ).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        item.name,
      ).toBe(true);
      await page.getByRole('region', { name: item.title, exact: true }).screenshot({
        path: `.artifacts/screenshots/${item.name}-${test.info().project.name}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}

test('button labels stay unchanged after activation, loading stays disabled, and source code is available', async ({
  page,
}) => {
  await openPage(page, '/docs/components/button');
  const button = page.getByRole('button', { name: 'Queue up', exact: true });
  await button.click();
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(button).toHaveText('Queue up');
  await expect(button).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Preparing', exact: true })).toBeDisabled();
  await selectExample(page, '1');
  await expect(page.getByRole('button', { name: /^Queue up/ })).toBeDisabled();
  await page.locator('.component-preview').getByRole('tab', { name: 'Code', exact: true }).click();
  const code = page
    .locator('.component-preview')
    .getByRole('tabpanel', { name: 'Code', exact: true });
  await expect(code).toContainText('Button');
  await expect(code).not.toContainText('setCount');
});

test('controlled checkbox, radio, switch, and toggle preserve keyboard semantics', async ({
  page,
}) => {
  await openPage(page, '/docs/components/checkbox');
  const checkbox = page.getByRole('checkbox', { name: 'Send me build updates' });
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Some roles selected' })).toHaveAttribute(
    'aria-checked',
    'mixed',
  );
  await openPage(page, '/docs/components/radio');
  await page.getByRole('radio', { name: 'top', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'jungle', exact: true })).toBeChecked();
  await openPage(page, '/docs/components/switch');
  const toggle = page.getByRole('switch');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toBeChecked();
  await openPage(page, '/docs/components/toggle');
  await page.getByRole('button', { name: 'Favorite setup' }).click();
  await expect(page.getByRole('button', { name: 'Favorite setup' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('field labels, disabled previews, and the A–Z component index work', async ({ page }) => {
  await openPage(page, '/docs/components/field');
  await page.getByRole('textbox', { name: 'Profile name' }).fill('Starlight');
  await expect(page.getByRole('textbox', { name: 'Invite code' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await openPage(page, '/docs/components/input');
  await selectExample(page, '1');
  await expect(page.getByRole('textbox', { name: 'Text input' })).toBeDisabled();
  await openPage(page, '/docs/components');
  const links = page
    .getByRole('navigation', { name: 'All components', exact: true })
    .getByRole('link');
  const names = await links.allTextContents();
  expect(names).toHaveLength(manifest.length);
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
  const result = page.getByRole('main').getByRole('link', { name: 'Checkbox', exact: true });
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL('/docs/components/checkbox');
});
