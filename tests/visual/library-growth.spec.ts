import { test, expect } from '@playwright/test';
import { openPage } from '../e2e/navigation';
import { setMode } from '../e2e/set-mode';

for (const name of [
  'button',
  'input',
  'field',
  'checkbox',
  'radio',
  'switch',
  'tabs',
  'calendar',
]) {
  test(`light: ${name} default frame`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, `/docs/components/${name}`);
    await setMode(page, 'light');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.preview-viewport')).toHaveScreenshot(`${name}-light.png`);
  });
}

for (const mode of ['light', 'dark'] as const) {
  for (const name of ['toast', 'sonner']) {
    test(`${mode}: ${name} notification`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openPage(page, `/docs/components/${name}`);
      await setMode(page, mode);
      await page.evaluate(() => document.fonts.ready);
      await page
        .getByRole('button', {
          name: name === 'toast' ? 'Error' : 'Show notification',
          exact: true,
        })
        .click();
      const notification = page
        .locator(name === 'toast' ? '.hx-toast' : '[data-sonner-toast]')
        .first();
      await expect(notification).toBeVisible();
      await page.mouse.move(0, 0);
      await expect(notification).toHaveScreenshot(`${name}-${mode}.png`);
    });
  }
  for (const name of ['skeleton', 'alert', 'avatar', 'empty-state']) {
    test(`${mode}: ${name} default frame`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openPage(page, `/docs/components/${name}`);
      await setMode(page, mode);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.preview-viewport')).toHaveScreenshot(`${name}-${mode}.png`);
    });
  }
  for (const name of ['select', 'menu']) {
    test(`${mode}: ${name} open popup`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openPage(page, `/docs/components/${name}`);
      await setMode(page, mode);
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator('.preview-viewport')
        .getByRole(name === 'select' ? 'combobox' : 'button')
        .first()
        .click();
      await page.mouse.move(0, 0);
      await expect(page.getByRole(name === 'select' ? 'listbox' : 'menu').first()).toHaveScreenshot(
        `${name}-popup-${mode}.png`,
      );
    });
  }
  test(`${mode}: validated form`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, '/docs/forms');
    const preview = page.locator('.usage-preview');
    await expect(preview).toHaveAttribute('data-preview-ready', 'true');
    await setMode(page, mode);
    await page.getByRole('button', { name: 'Save profile', exact: true }).click();
    await expect(page.getByText('Use at least 2 characters.', { exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(preview.locator('.usage-viewport')).toHaveScreenshot(`form-error-${mode}.png`);
  });
}
