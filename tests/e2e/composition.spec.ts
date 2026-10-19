import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';
import { setMode } from './set-mode';

test.describe.configure({ timeout: 90000 });

test('narrow viewports bound popovers and toasts with the isolated length scale', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page, '/docs/components/popover');
  await page.getByRole('button', { name: 'Details', exact: true }).click();
  const popup = page.getByRole('dialog');
  await expect(popup).toBeVisible();
  await popup.evaluate((element) => {
    element.parentElement!.style.width = '1000px';
  });
  expect(
    await popup.evaluate((element) => element.parentElement!.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(358);
  await openPage(page, '/docs/components/toast');
  await page.getByRole('button', { name: 'Error', exact: true }).click();
  await expect(page.locator('.hx-toast')).toHaveCSS('width', '358px');
});

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: checkbox groups synchronize their parent and submit stable values`, async ({
    page,
  }) => {
    await openPage(page, '/docs/components/checkbox-group');
    await setMode(page, mode);
    const parent = page.getByRole('checkbox', { name: 'All roles', exact: true });
    await expect(parent).toHaveAttribute('aria-checked', 'mixed');
    await expect(parent.locator('svg path')).toHaveAttribute('d', 'M4 10h12');
    await parent.focus();
    await page.keyboard.press('Space');
    for (const role of ['top', 'jungle', 'support'])
      await expect(page.getByRole('checkbox', { name: role, exact: true })).toBeChecked();
    await page.getByRole('checkbox', { name: 'top', exact: true }).uncheck();
    await expect(parent).toHaveAttribute('aria-checked', 'mixed');
    await expect(page.getByRole('status')).toContainText('jungle');
    const values = await page
      .getByRole('form', { name: 'Role selection', exact: true })
      .evaluate((form) => new FormData(form as HTMLFormElement).getAll('roles'));
    expect(values).toEqual(['jungle', 'support']);
  });

  test(`${mode}: grouped inputs retain labels, clear focus and 8px field spacing`, async ({
    page,
  }) => {
    await openPage(page, '/docs/components/input-group');
    await setMode(page, mode);
    const input = page.getByRole('textbox', { name: 'Profile handle', exact: true });
    await expect(input).toHaveValue('starlight');
    await page.getByRole('button', { name: 'Clear profile handle', exact: true }).click();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await openPage(page, '/docs/components/fieldset');
    await expect(page.getByRole('group', { name: 'Party details', exact: true })).toBeVisible();
    const field = page.locator('.hx-field').first();
    await expect(field).toHaveCSS('row-gap', '8px');
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
  });

  test(`${mode}: composed forms validate groups, submit, disable pending work and reset`, async ({
    page,
  }) => {
    await openPage(page, '/docs/forms');
    await setMode(page, mode);
    const preview = page.getByRole('region', { name: 'Composed party settings', exact: true });
    await expect(preview).toHaveAttribute('data-preview-ready', 'true');
    const name = preview.getByRole('textbox', { name: 'Party display name', exact: true });
    await name.fill('');
    await preview.getByRole('checkbox', { name: 'support', exact: true }).uncheck();
    const submit = preview.getByRole('button', { name: 'Save party', exact: true });
    await submit.click();
    await expect(preview.getByText('Use at least 2 characters.', { exact: true })).toBeVisible();
    await expect(preview.getByText('Choose at least one role.', { exact: true })).toBeVisible();
    await name.fill('Dawn patrol');
    await preview.getByRole('checkbox', { name: 'top', exact: true }).check();
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(name).toBeDisabled();
    await expect(preview.getByRole('status')).toHaveText('Saved locally: Dawn patrol (top).');
    await preview.getByRole('button', { name: 'Reset party', exact: true }).click();
    await expect(name).toHaveValue('The night shift');
    await expect(preview.getByRole('checkbox', { name: 'support', exact: true })).toBeChecked();
    await preview.screenshot({
      path: `.artifacts/party-settings-${mode}-${test.info().project.name}.png`,
    });
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
  });

  test(`${mode}: measurements, party avatars and item actions expose correct semantics`, async ({
    page,
  }) => {
    await openPage(page, '/docs/components/meter');
    await setMode(page, mode);
    await expect(page.getByRole('meter', { name: 'Health', exact: true })).toHaveAttribute(
      'aria-valuenow',
      '720',
    );
    await expect(page.getByRole('meter', { name: 'Health', exact: true })).toHaveAttribute(
      'aria-valuemax',
      '1000',
    );
    await openPage(page, '/docs/components/avatar-group');
    await expect(page.getByRole('group', { name: 'Your party', exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Hextech UI', exact: true })).toBeVisible();
    await openPage(page, '/docs/components/item');
    const invite = page.getByRole('button', { name: 'Invite Starlight', exact: true });
    await invite.focus();
    await expect(invite).toBeFocused();
    if (test.info().project.name === 'mobile') {
      const content = await page.locator('[data-slot="item-content"]').boundingBox();
      const actions = await page.locator('[data-slot="item-actions"]').boundingBox();
      expect(content!.width).toBeGreaterThanOrEqual(160);
      expect(actions!.y).toBeGreaterThanOrEqual(content!.y + content!.height - 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
  });
}

test('public previews copy exactly their descriptive live source and never expose internal selectors', async ({
  page,
  request,
}) => {
  for (const name of [
    'fieldset',
    'checkbox-group',
    'input-group',
    'button-group',
    'meter',
    'avatar-group',
    'item',
  ]) {
    await openPage(page, '/docs/components/' + name);
    await expect(page.locator('.preview-toolbar')).toHaveCount(0);
    await page
      .locator('.component-preview')
      .getByRole('tab', { name: 'Code', exact: true })
      .click();
    const code = page
      .locator('.component-preview')
      .getByRole('tabpanel', { name: 'Code', exact: true });
    await expect(code).not.toContainText('function Example(');
    await expect(code).not.toContainText('@hextech-ui/react');
    const markdown = await request.get(`/docs/components/${name}.md`);
    expect(markdown.ok()).toBe(true);
    expect(await markdown.text()).toContain('API reference');
  }
});
