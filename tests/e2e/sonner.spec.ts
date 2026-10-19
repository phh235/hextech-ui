import { test, expect } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';
import { selectExample } from './select-example';

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: Sonner shows styled notifications, actions and promises in the inherited theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, '/docs/components/sonner');
    await setMode(page, mode);
    await expect(page.locator('.preview-toolbar')).toHaveCount(0);
    await page.getByRole('button', { name: 'Show notification', exact: true }).click();
    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toContainText('Default Sonner');
    await expect(page.locator('[data-sonner-toaster]')).toHaveAttribute('data-sonner-theme', mode);
    await expect(toast).toHaveCSS('padding', '16px');
    await expect(toast).toHaveCSS('border-top-width', '2px');
    await expect(toast).toHaveCSS(
      'color',
      mode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(24, 42, 53)',
    );
    await expect(toast.locator('[data-title]')).toHaveCSS('text-transform', 'uppercase');
    const close = toast.getByRole('button', { name: 'Dismiss notification', exact: true });
    await page.keyboard.press('Tab');
    await close.focus();
    await expect(close).toHaveCSS('outline-style', 'solid');
    const before = await close.evaluate((e) => getComputedStyle(e).color);
    await close.hover();
    await expect(close).not.toHaveCSS('color', before);
    await close.press('Enter');
    await expect(toast).toBeHidden();
    await page.getByRole('button', { name: 'With action', exact: true }).click();
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect(
      page.getByRole('status', { name: '' }).filter({ hasText: 'Changes undone' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Promise', exact: true }).click();
    await expect(page.locator('[data-sonner-toast][data-type="loading"]')).toContainText(
      'Saving build',
    );
    const success = page.locator('[data-sonner-toast][data-type="success"]');
    await expect(success).toContainText('Build saved');
    await expect(success.locator('[data-icon] svg')).toHaveCSS(
      'color',
      mode === 'dark' ? 'rgb(56, 189, 248)' : 'rgb(3, 105, 161)',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
      "from '@/components/ui/sonner'",
    );
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
      'sonner.promise',
    );
  });
}

test('Sonner supports every audited story family and keeps persistent/loading notifications', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/docs/components/sonner');
    await setMode(page, mode);
    for (const [variant, type] of [
      ['Success', 'success'],
      ['Info', 'info'],
      ['Warning', 'warning'],
      ['Error', 'error'],
      ['Loading', 'loading'],
    ] as const) {
      await selectExample(page, { label: variant });
      await page.getByRole('button', { name: 'Show notification', exact: true }).click();
      const toast = page.locator(`[data-sonner-toast][data-type="${type}"]`);
      await expect(toast).toBeVisible();
      await expect(toast.locator('[data-icon]')).toHaveCSS('width', '20px');
      if (type !== 'loading') {
        const expected =
          type === 'error'
            ? mode === 'dark'
              ? 'rgb(245, 152, 152)'
              : 'rgb(160, 46, 58)'
            : type === 'warning'
              ? mode === 'dark'
                ? 'rgb(200, 170, 110)'
                : 'rgb(119, 87, 30)'
              : mode === 'dark'
                ? 'rgb(56, 189, 248)'
                : 'rgb(3, 105, 161)';
        await expect(toast.locator('[data-icon] svg')).toHaveCSS('color', expected);
      }
    }
  }
  await selectExample(page, { label: 'Top right' });
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  await expect(page.locator('[data-sonner-toast]')).toHaveAttribute('data-y-position', 'top');
  await expect(page.locator('[data-sonner-toast]')).toHaveAttribute('data-x-position', 'right');
  await selectExample(page, { label: 'Persistent' });
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  const persistent = page.locator('[data-sonner-toast]');
  await expect(persistent).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification', exact: true }).press('Enter');
  await expect(persistent).toBeHidden();
});
