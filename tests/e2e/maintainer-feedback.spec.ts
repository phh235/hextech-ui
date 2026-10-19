import { test, expect } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: Select popup stays below the trigger with a visible frame`, async ({ page }) => {
    await openPage(page, '/docs/components/select');
    await setMode(page, mode);
    const trigger = page.getByRole('combobox', { name: 'Preferred role' });
    const initial = await trigger.boundingBox();
    await trigger.click();
    const list = page.getByRole('listbox');
    await expect(list).toBeVisible();
    const popup = page.locator('.hx-select-popup');
    const box = await popup.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(initial!.y + initial!.height);
    expect(Math.abs(box!.width - initial!.width)).toBeLessThanOrEqual(2);
    await expect(popup).toHaveCSS('border-top-width', '1px');
    await expect(popup).not.toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await page.getByRole('option', { name: 'Jungle', exact: true }).click();
    await expect(trigger).toContainText('Jungle');
    await expect(trigger).toBeFocused();
  });

  test(`${mode}: compact numbers and consistent action indicators`, async ({ page }) => {
    await openPage(page, '/docs/components/number-field');
    await setMode(page, mode);
    const group = page.locator('.hx-number-group');
    expect((await group.boundingBox())!.width).toBeLessThanOrEqual(176);
    const plus = page.getByRole('button', { name: 'Increase Party size' });
    await expect(plus.locator('svg')).toHaveCSS('width', '16px');
    await plus.click();
    await expect(page.getByRole('textbox', { name: 'Party size' })).toHaveValue('4');
    await openPage(page, '/docs/components/multiple-select');
    await setMode(page, mode);
    await expect(
      page.getByRole('button', { name: 'Show Preferred roles options' }).locator('svg'),
    ).toHaveCSS('width', '16px');
    await openPage(page, '/docs/components/menu');
    await setMode(page, mode);
    const trigger = page.getByRole('button', { name: 'Build actions', exact: true });
    await expect(trigger.locator('svg')).toHaveCount(1);
    await trigger.click();
    const sub = page.getByRole('menuitem', { name: 'Export', exact: true });
    await expect(sub.locator('svg')).toHaveCount(1);
    expect(await sub.evaluate((e) => getComputedStyle(e, '::after').content)).toBe('none');
    await sub.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('menuitem', { name: 'Text format' })).toBeVisible();
  });
}

test('search echoes typing immediately, debounces the result and cancels pending work on clear', async ({
  page,
}) => {
  await openPage(page, '/docs/components/search-field');
  const field = page.getByRole('searchbox', { name: 'Search builds' });
  const status = page.getByRole('status').filter({ hasText: 'Showing all local builds' });
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 60_000));
  await field.fill('Da');
  await field.fill('Draft');
  await expect(field).toHaveValue('Draft');
  await expect(status).toBeVisible();
  await page.clock.runFor(299);
  await expect(status).toBeVisible();
  await page.clock.runFor(2);
  await expect(page.getByRole('status').filter({ hasText: 'Filtering by Draft' })).toBeVisible();
  await field.fill('Pending');
  await page.getByRole('button', { name: 'Clear Search builds' }).click();
  await expect(field).toHaveValue('');
  await expect(status).toBeVisible();
  await page.clock.runFor(500);
  await expect(status).toBeVisible();
});

test('docs separate installation from named demo source and GitHub links have only the icon', async ({
  page,
  isMobile,
}) => {
  for (const name of ['button', 'input', 'sonner']) {
    await openPage(page, `/docs/components/${name}`);
    await page
      .locator('.component-preview')
      .getByRole('tab', { name: 'Code', exact: true })
      .click();
    const code = page
      .locator('.component-preview')
      .getByRole('tabpanel', { name: 'Code', exact: true });
    await expect(code).toContainText(`${name}-demo.tsx`);
    await expect(code.locator('.install-command')).toHaveCount(0);
    await expect(code).not.toContainText('npx shadcn');
    await expect(page.getByRole('heading', { name: /^Installation/, level: 2 })).toBeVisible();
    await expect(page.locator('.install-command')).toHaveCount(1);
  }
  await openPage(page, '/docs/installation');
  await page.locator('.component-preview').getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.locator('.install-command')).toHaveCount(1);
  await expect(
    page.locator('.component-preview').getByRole('tabpanel', { name: 'Code', exact: true }),
  ).not.toContainText('Terminal');
  if (isMobile) await page.getByRole('button', { name: 'Open Sidebar', exact: true }).click();
  const controls = page
    .locator(isMobile ? '#nd-sidebar-mobile' : '#nd-sidebar')
    .locator('[data-docs-controls]');
  const sidebar = controls.getByRole('link', { name: 'GitHub', exact: true });
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toHaveText('');
  await expect(sidebar.locator('[data-github-icon]')).toHaveCount(1);
  await expect(
    controls.getByRole('link', { name: 'Support on Ko-fi', exact: true }),
  ).toHaveAttribute('href', 'https://ko-fi.com/phh235');
  await openPage(page, '/');
  if (isMobile) await page.getByRole('button', { name: 'Toggle Menu', exact: true }).click();
  const github = page.locator('#nd-nav').getByRole('link', { name: 'GitHub', exact: true });
  await expect(github).toBeVisible();
  await expect(github).toHaveText('');
  await expect(github.locator('[data-github-icon]')).toHaveCount(1);
  await openPage(page, '/docs/components/preview-card');
  await expect(
    page.getByRole('link', { name: 'Explore the Hextech theme', exact: true }),
  ).toBeVisible();
});

test('removed Drag and Drop is absent from routes, navigation, registry and machine docs', async ({
  request,
  page,
}) => {
  expect((await request.get('/docs/components/use-drag-and-drop')).status()).toBe(404);
  expect((await request.get('/r/use-drag-and-drop.json')).status()).toBe(404);
  const registry = await (await request.get('/r/registry.json')).json();
  expect(
    registry.items.some((item: { name: string }) =>
      ['use-drag-and-drop', 'drop-data'].includes(item.name),
    ),
  ).toBe(false);
  const llms = await (await request.get('/llms-full.txt')).text();
  expect(llms).not.toContain('/docs/components/use-drag-and-drop');
  await openPage(page, '/docs/components');
  await expect(page.getByRole('link', { name: 'Drag and Drop', exact: true })).toHaveCount(0);
});
