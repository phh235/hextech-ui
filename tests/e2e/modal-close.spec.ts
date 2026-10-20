import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';
import { setMode } from './set-mode';

test.describe.configure({ timeout: 60000 });

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: modal corner close is accessible, stays within the viewport and restores focus`, async ({
    page,
  }) => {
    await openPage(page, '/docs/components/dialog');
    await setMode(page, mode);
    const trigger = page.getByRole('button', { name: 'Edit profile', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Edit profile', exact: true });
    const close = dialog.getByRole('button', { name: 'Close dialog', exact: true });
    await expect(close).toBeVisible();
    const bounds = await close.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(40);
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await page.keyboard.press('Tab');
    await close.focus();
    await expect(close).toHaveCSS('outline-width', '2px');
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await openPage(page, '/docs/components/alert-dialog');
    const alertTrigger = page.getByRole('button', { name: 'Leave party', exact: true });
    await alertTrigger.click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Close dialog', exact: true })
      .click();
    await expect(page.getByRole('alertdialog')).toBeHidden();
    await expect(alertTrigger).toBeFocused();
    // Root package imports and direct subpaths share the same close affordance.
    await openPage(page, '/internal/components/dialog');
    await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
    await expect(
      page.getByRole('dialog').getByRole('button', { name: 'Close dialog', exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    // A default confirmation keeps the extra cancel affordance opt-in.
    await openPage(page, '/internal/components/alert-dialog');
    await page.getByRole('button', { name: 'Leave party', exact: true }).click();
    await expect(
      page.getByRole('alertdialog').getByRole('button', { name: 'Close dialog', exact: true }),
    ).toHaveCount(0);
  });
}
