import { selectExample } from './select-example';
import { test, expect } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';

test('calendar hover, held press and keyboard focus remain distinct in both modes', async ({
  page,
}) => {
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/docs/components/calendar');
    await setMode(page, mode);
    const calendar = page.getByRole('group', { name: 'Session date', exact: true });
    const day = calendar.getByRole('button', { name: 'Tuesday, October 20, 2026', exact: true });
    const initial = await day.evaluate((e) => getComputedStyle(e).backgroundColor);
    await day.hover();
    const hovered = await day.evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(hovered).not.toBe(initial);
    await page.mouse.down();
    expect(await day.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(hovered);
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await day.focus();
    await expect(day).toHaveCSS('outline-width', '2px');
    await expect(day).toHaveCSS('outline-style', 'solid');
    await expect(
      calendar.getByRole('heading', { name: 'October 2026', exact: true }),
    ).toBeVisible();
  }
});

test('range selection is one continuous band with rounded outer caps', async ({ page }) => {
  await openPage(page, '/docs/components/calendar');
  const range = page.getByRole('group', { name: 'Training window', exact: true });
  const cells = range.locator('.hx-calendar-day[data-in-range]');
  await expect(cells).toHaveCount(4);
  const geometry = await cells.evaluateAll((elements) =>
    elements.map((e) => {
      const r = e.getBoundingClientRect(),
        s = getComputedStyle(e);
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        start: s.borderTopLeftRadius,
        end: s.borderTopRightRadius,
      };
    }),
  );
  expect(geometry[0]!.start).not.toBe('0px');
  expect(geometry.at(-1)!.end).not.toBe('0px');
  for (let i = 1; i < geometry.length; i++) {
    expect(geometry[i]!.top).toBe(geometry[i - 1]!.top);
    expect(Math.abs(geometry[i]!.left - geometry[i - 1]!.right)).toBeLessThan(0.1);
  }
  expect(geometry[1]!.start).toBe('0px');
  expect(geometry[1]!.end).toBe('0px');
});

test('autocomplete options use the shared selection row and keyboard navigation', async ({
  page,
  browserName,
}) => {
  await openPage(page, '/docs/components/autocomplete');
  await page.getByRole('button', { name: 'Show Build query suggestions', exact: true }).click();
  const option = page.locator('.hx-select-popup').getByRole('option').nth(1);
  await expect(option).toHaveCSS('font-size', '14px');
  await expect(option).toHaveCSS('padding', '6px 8px');
  const initial = await option.evaluate((e) => getComputedStyle(e).backgroundColor);
  await option.hover();
  // Playwright WebKit reports zero movement deltas; Base UI intentionally ignores
  // those events to keep a stationary pointer from overriding keyboard navigation.
  if (browserName === 'webkit')
    await option.dispatchEvent('mousemove', { movementX: 5, movementY: 0 });
  await expect
    .poll(() => option.evaluate((e) => getComputedStyle(e).backgroundColor))
    .not.toBe(initial);
  await page.getByRole('combobox', { name: 'Build query', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('combobox', { name: 'Build query', exact: true })).toHaveAttribute(
    'aria-activedescendant',
    /.+/,
  );
});

test('disabled inline editor retains its disabled frame and cannot be edited', async ({ page }) => {
  await openPage(page, '/docs/components/token-field');
  await selectExample(page, { label: 'Disabled' });
  const editor = page.getByRole('textbox', { name: 'Message', exact: true });
  await expect(editor).toHaveAttribute('aria-disabled', 'true');
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  await expect(editor).toHaveCSS('color', 'rgb(91, 90, 86)');
  const before = await editor.evaluate((e) => getComputedStyle(e).backgroundImage);
  await editor.hover();
  await expect(editor).toHaveCSS('background-image', before);
});

test('toast status icons share Sonner colors and keep keyboard dismissal in both modes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/docs/components/toast');
  for (const mode of ['dark', 'light'] as const) {
    await setMode(page, mode);
    for (const [label, type] of [
      ['Success', 'success'],
      ['Info', 'info'],
      ['Warning', 'warning'],
      ['Error', 'error'],
      ['Default', undefined],
    ] as const) {
      await page.getByRole('button', { name: label, exact: true }).click();
      const toast = page.locator('.hx-toast');
      await expect(toast).toBeVisible();
      await expect(toast.locator('.hx-toast-title')).toHaveCSS('text-transform', 'uppercase');
      if (type) {
        await expect(toast).toHaveAttribute('data-type', type);
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
        await expect(toast.locator('.hx-notification-icon')).toHaveCSS('color', expected);
      } else await expect(toast.locator('.hx-notification-icon')).toHaveCount(0);
      await page.keyboard.press('F6');
      const close = toast.getByRole('button', { name: 'Dismiss notification', exact: true });
      if (type === 'success') {
        const a = await toast.boundingBox(),
          b = await close.boundingBox();
        expect(b!.x).toBeLessThan(a!.x);
        expect(b!.y).toBeLessThan(a!.y);
      }
      await page.keyboard.press('Tab');
      await close.focus();
      await expect(close).toHaveCSS('outline-style', 'solid');
      await close.press('Enter');
      await expect(toast).toHaveCount(0);
    }
  }
  await page.locator('.component-preview').getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(
    page.locator('.component-preview').getByRole('tabpanel', { name: 'Code', exact: true }),
  ).toContainText("type: 'error'");
  await selectExample(page, { label: 'Disabled' });
  for (const label of ['Default', 'Success', 'Info', 'Warning', 'Error']) {
    await expect(page.getByRole('button', { name: label, exact: true })).toBeDisabled();
  }
});

test('popover body spacing and date-popup surface compose independently', async ({ page }) => {
  await openPage(page, '/docs/components/popover');
  await page.getByRole('button', { name: 'Party details', exact: true }).click();
  await expect(page.locator('.hx-popover')).toHaveCSS('padding', '2px');
  await expect(page.locator('.hx-popover > div')).toHaveCSS('padding', '16px');
  await page.keyboard.press('Escape');
  await openPage(page, '/docs/components/date-picker');
  await page.getByRole('button', { name: 'Open Session date calendar', exact: true }).click();
  await expect(page.locator('.hx-date-popup')).toHaveCSS('padding', '12px');
  await expect(
    page.getByRole('button', { name: 'Saturday, October 17, 2026', exact: true }),
  ).toBeFocused();
});

test('disabled ButtonLink keeps the reference appearance and cannot activate', async ({ page }) => {
  await openPage(page, '/docs/components/link');
  await selectExample(page, { label: 'Storybook · Disabled' });
  const location = page.url();
  const link = page.getByRole('link', { name: 'League of Legends', exact: true });
  await expect(link).toHaveAttribute('aria-disabled', 'true');
  await expect(link).not.toHaveAttribute('href');
  await expect(link).toHaveAttribute('tabindex', '-1');
  await expect(link).toHaveCSS('color', 'rgb(205, 190, 145)');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(240, 230, 210)');
  expect(
    await link.evaluate((e) =>
      e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
    ),
  ).toBe(false);
  await expect(page).toHaveURL(location);
});

test('table rows select on mouse press once and leave embedded controls independent', async ({
  page,
}) => {
  await openPage(page, '/docs/components/data-table');
  const row = page.locator('tbody .hx-table-row').first();
  const name = row.getByRole('gridcell').nth(1);
  await name.hover();
  await page.mouse.down();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await page.mouse.up();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await row.getByRole('textbox').click();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await name.click();
  await expect(row).toHaveAttribute('aria-selected', 'false');
  await row.getByRole('checkbox').click();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await selectExample(page, { label: 'Disabled' });
  const blocked = page.locator('tbody .hx-table-row').first();
  await expect(blocked).toHaveAttribute('aria-disabled', 'true');
  const selection = await blocked.getAttribute('aria-selected');
  await blocked.getByRole('gridcell').nth(1).dispatchEvent('mousedown', { button: 0 });
  await blocked.getByRole('gridcell').nth(1).dispatchEvent('click', { detail: 1 });
  await expect(blocked).toHaveAttribute('aria-selected', selection!);
});

test('disabled virtual options retain their idle background on hover', async ({ page }) => {
  await openPage(page, '/docs/components/virtual-listbox');
  await selectExample(page, { label: 'Disabled' });
  const option = page
    .getByRole('listbox', { name: 'Practice builds', exact: true })
    .getByRole('option')
    .nth(1);
  await expect(option).toHaveAttribute('aria-disabled', 'true');
  const before = await option.evaluate((e) => getComputedStyle(e).backgroundColor);
  await option.hover();
  await expect(option).toHaveCSS('background-color', before);
  await expect(option).toHaveCSS('color', 'rgb(91, 90, 86)');
});
