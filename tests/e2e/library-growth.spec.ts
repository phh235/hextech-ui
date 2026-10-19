import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';
import { setMode } from './set-mode';

// These scenarios visit several pages and run accessibility checks in every browser engine.
test.describe.configure({ timeout: 60000 });

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: named examples guard pending actions and retain controlled object selection`, async ({
    page,
  }) => {
    await openPage(page, '/docs/components/button');
    await setMode(page, mode);
    const saving = page.getByRole('region', { name: 'Saving an action', exact: true });
    await expect(saving).toHaveAttribute('data-preview-ready', 'true');
    await saving.getByRole('button', { name: 'Save build', exact: true }).click();
    await expect(saving.getByRole('button', { name: 'Saving build', exact: true })).toBeDisabled();
    await expect(saving.getByRole('status')).toHaveText('Build saved locally.');
    await openPage(page, '/docs/components/combobox');
    const selection = page.getByRole('region', {
      name: 'Controlled object selection',
      exact: true,
    });
    await expect(selection).toHaveAttribute('data-preview-ready', 'true');
    await selection.getByRole('combobox', { name: 'Build owner', exact: true }).fill('Rowan');
    await page.getByRole('option', { name: 'Rowan', exact: true }).click();
    await expect(selection.getByRole('status')).toHaveText('Owner ID: rowan');
  });

  test(`${mode}: form handles invalid values, server errors, pending work and reset`, async ({
    page,
  }) => {
    await openPage(page, '/docs/forms');
    const preview = page.locator('.usage-preview');
    await expect(preview).toHaveAttribute('data-preview-ready', 'true');
    await setMode(page, mode);
    const form = page.getByRole('form', { name: 'Profile form', exact: true });
    const input = form.getByRole('textbox', { name: 'Display name', exact: true });
    const submit = form.getByRole('button', { name: 'Save profile', exact: true });
    await submit.click();
    await expect(form.getByText('Use at least 2 characters.', { exact: true })).toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.fill('taken');
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(
      form.getByText('This display name is already taken.', { exact: true }),
    ).toBeVisible();
    await expect(input).toBeFocused();
    await input.fill('Starlight');
    await submit.click();
    await expect(form.getByRole('status')).toContainText('Profile saved locally');
    await form.getByRole('button', { name: 'Reset profile', exact: true }).click();
    await expect(input).toHaveValue('');
    await expect(form.getByRole('status')).toBeEmpty();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await preview.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(preview.getByRole('tabpanel', { name: 'Code' })).toContainText(
      '@/components/ui/field',
    );
    await expect(preview.getByRole('tabpanel', { name: 'Code' })).toContainText('zodResolver');
  });

  test(`${mode}: new canonical components expose useful recovery and image fallbacks`, async ({
    page,
  }) => {
    await openPage(page, '/');
    await setMode(page, mode);
    await openPage(page, '/docs/components/empty-state');
    const recovery = page.getByRole('region', { name: 'Create your first item', exact: true });
    await recovery.getByRole('button', { name: 'Create a build', exact: true }).click();
    await expect(recovery.getByRole('status')).toHaveText('Your first local build is ready.');
    await recovery.getByRole('button', { name: 'Reset collection', exact: true }).click();
    await expect(
      recovery.getByRole('button', { name: 'Create a build', exact: true }),
    ).toBeVisible();
    await page.route('**/icon.svg', (route) => route.abort());
    await openPage(page, '/docs/components/avatar');
    const avatar = page.getByRole('region', { name: 'Image with fallback', exact: true });
    await expect(avatar.locator('[aria-label="Hextech UI profile"]')).toHaveText('H');
    await openPage(page, '/docs/components/skeleton');
    await expect(page.getByRole('status', { name: 'Loading profile', exact: true })).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.preview-viewport [aria-hidden="true"]').first()).toHaveCSS(
      'animation-name',
      'none',
    );
    await openPage(page, '/docs/components/alert');
    await expect(page.locator('[data-hextech-ui="alert"]')).toHaveCount(4);
    await expect(page.locator('[data-hextech-ui="alert"][role="alert"]')).toHaveCount(0);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
  });
}

test('machine-readable docs retain the API and every named example', async ({ request }) => {
  const button = await request.get('/docs/components/button.md');
  expect(button.ok()).toBe(true);
  const text = await button.text();
  expect(text).toContain('API reference');
  expect(text).toContain('ButtonLoadingExample');
  expect(text).toContain('setPending');
  expect(text).not.toContain('<UsagePreview');
  expect(text).not.toContain('GENERATED REFERENCE');
  const form = await request.get('/docs/forms.md');
  expect(form.ok()).toBe(true);
  expect(await form.text()).toContain('zodResolver');
});
