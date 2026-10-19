import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import blocks from '../../packages/react/block-manifest.json' with { type: 'json' };
test('every original block renders with accessible controls and no viewport overflow', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const block of blocks) {
    await openPage(page, `/docs/blocks/${block.name}`);
    await expect(page.locator('.preview-viewport')).not.toBeEmpty();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
      block.name,
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      block.name,
    ).toBe(true);
    await page.getByRole('region', { name: block.title, exact: true }).screenshot({
      path: `.artifacts/screenshots/block-${block.name}-${test.info().project.name}.png`,
    });
  }
  expect(errors).toEqual([]);
});
test('account form validates signup and provides explicit local-only recovery', async ({
  page,
}) => {
  await openPage(page, '/docs/blocks/auth');
  await page.getByRole('tab', { name: 'Sign up', exact: true }).click();
  await page.getByRole('textbox', { name: 'Display name' }).fill('Sage');
  await page.getByRole('textbox', { name: 'Email address' }).fill('sage@example.com');
  await page.getByLabel('Password', { exact: true }).fill('sample-passphrase');
  await page.getByLabel('Confirm password', { exact: true }).fill('mismatch-value');
  await page.getByRole('button', { name: 'Preview account creation' }).click();
  await expect(page.getByText('Passwords must match.')).toBeVisible();
  await page.getByLabel('Confirm password', { exact: true }).fill('sample-passphrase');
  await page.getByRole('button', { name: 'Preview account creation' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'preview complete' })).toContainText(
    'No account',
  );
  await page.getByRole('tab', { name: 'Recovery', exact: true }).click();
  const recovery = page.getByRole('tabpanel', { name: 'Recovery', exact: true });
  await recovery.getByRole('textbox', { name: 'Email address' }).fill('sage@example.com');
  await recovery.getByRole('button', { name: 'Preview recovery' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Recovery preview' })).toContainText(
    'No email was sent',
  );
});
test('lobby adds members, requires ready state and cancels its queue preview', async ({ page }) => {
  await openPage(page, '/docs/blocks/lobby');
  const queue = page.getByRole('button', { name: 'Preview matchmaking' });
  await expect(queue).toBeDisabled();
  await page.getByRole('textbox', { name: 'Invite display name' }).fill('Sage');
  await page.getByRole('button', { name: 'Add demo member' }).click();
  await expect(page.getByRole('button', { name: 'Remove Sage from party' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark ready' }).click();
  await queue.click();
  await expect(page.getByRole('progressbar', { name: 'Simulated matchmaking' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel queue preview' }).click();
  await expect(page.getByRole('progressbar', { name: 'Simulated matchmaking' })).toHaveCount(0);
});
test('draft filters original characters, locks selection and ends its countdown', async ({
  page,
}) => {
  await page.clock.install();
  await openPage(page, '/docs/blocks/draft');
  await page.getByRole('button', { name: 'Guide', exact: true }).click();
  await expect(page.getByRole('button', { name: /Bulwark Guard/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Beacon Guide/ }).click();
  await page.getByRole('button', { name: 'Lock selection' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Beacon locked' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset draft' }).click();
  await page.getByRole('button', { name: 'Start 30s draft' }).click();
  await page.clock.fastForward(31000);
  await expect(page.getByRole('status').filter({ hasText: 'Draft time complete' })).toBeVisible();
});
test('HUD consumes energy, restores resources and sends local pings', async ({ page }) => {
  await openPage(page, '/docs/blocks/hud');
  await page.getByRole('button', { name: 'Anchor', exact: true }).click();
  await expect(page.getByRole('progressbar', { name: 'Energy' })).toHaveAttribute(
    'aria-valuenow',
    '88',
  );
  await expect(page.getByRole('button', { name: /Anchor cooling down/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Send demo ping' }).click();
  await page.getByRole('menuitem', { name: /Gather here/ }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo ping' })).toContainText(
    'Nothing was sent',
  );
  await page.getByRole('button', { name: 'Restore resources' }).click();
  await expect(page.getByRole('progressbar', { name: 'Energy' })).toHaveAttribute(
    'aria-valuenow',
    '100',
  );
});
test('scoped preview theme follows a body portal', async ({ page }) => {
  await openPage(page, '/docs/components/dialog');
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--hextech-ui-background').trim(),
    ),
  ).toBe(
    await page
      .locator('.preview-stage')
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--hextech-ui-background').trim(),
      ),
  );
});

test('profile preferences edit and activity notices dismiss locally', async ({ page }) => {
  await openPage(page, '/docs/blocks/account');
  await page.getByRole('textbox', { name: 'Profile name' }).fill('Sage');
  const updates = page.getByRole('switch', { name: 'Build update notifications' });
  await updates.click();
  await expect(updates).not.toBeChecked();
  await page.getByRole('button', { name: 'Save preview preferences' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toContainText('Sage');
  const dismiss = page.getByRole('button', { name: /^Dismiss / });
  while (await dismiss.count()) await dismiss.first().click();
  await expect(page.getByRole('status').filter({ hasText: 'all caught up' })).toBeVisible();
});
