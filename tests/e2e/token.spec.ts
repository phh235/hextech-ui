import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('inline tokens share editing flow and delete atomically', async ({ page }) => {
  await openPage(page, '/docs/components/token-field');
  const editor = page.getByRole('textbox', { name: 'Message', exact: true });
  await expect(editor).toHaveAttribute('aria-busy', 'false');
  await expect(editor.locator('.hx-inline-token')).toHaveText('@Avery');
  await page.getByRole('button', { name: 'Clear message', exact: true }).click();
  await editor.focus();
  await page.keyboard.type('Start ');
  await page.getByRole('button', { name: 'Insert Rowan', exact: true }).click();
  await expect(editor.locator('.hx-inline-token')).toHaveText('@Rowan');
  await editor.press('ControlOrMeta+End');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await expect(editor.locator('.hx-inline-token')).toHaveCount(0);
  await expect(editor).toHaveText('Start ');
});
test('required validation targets the editor and form data stays local', async ({ page }) => {
  await openPage(page, '/docs/components/token-field');
  const editor = page.getByRole('textbox', { name: 'Message', exact: true });
  await expect(editor).toHaveAttribute('aria-busy', 'false');
  await page.getByRole('button', { name: 'Clear message', exact: true }).click();
  await page.getByRole('button', { name: 'Save message', exact: true }).click();
  await expect(editor).toHaveAttribute('aria-invalid', 'true');
  await expect(editor).toBeFocused();
  await expect(page.getByText('Enter a value.', { exact: true })).toBeVisible();
  await page.keyboard.type('Ready for the next chapter.');
  await page.getByRole('button', { name: 'Save message', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally:' })).toContainText(
    'Ready for the next chapter.',
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
test('undo and plain-text clipboard preserve safe editor behavior', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openPage(page, '/docs/components/token-field');
  const editor = page.getByRole('textbox', { name: 'Message', exact: true });
  await expect(editor).toHaveAttribute('aria-busy', 'false');
  await editor.focus();
  await editor.press('ControlOrMeta+End');
  await page.keyboard.type(' Undo marker');
  await expect(editor).toContainText('Undo marker');
  await editor.press('ControlOrMeta+z');
  await expect(editor).not.toContainText('Undo marker');
  await editor.focus();
  await editor.press('ControlOrMeta+End');
  if (browserName === 'chromium') {
    await page.evaluate(() => navigator.clipboard.writeText('<img src=x onerror=alert(1)>'));
    await editor.press('ControlOrMeta+v');
  } else if (browserName === 'firefox') {
    await page.bringToFront();
    await page.evaluate(() => {
      const source = document.createElement('textarea');
      source.id = 'clipboard-test-source';
      source.setAttribute('aria-label', 'Clipboard test source');
      source.value = '<img src=x onerror=alert(1)>';
      document.body.append(source);
    });
    const source = page.locator('#clipboard-test-source');
    await source.selectText();
    await source.press('ControlOrMeta+c');
    await source.evaluate((node) => node.remove());
    await editor.focus();
    await editor.press('ControlOrMeta+End');
    await editor.press('ControlOrMeta+v');
  } else {
    await editor.evaluate((element) => {
      const data = new DataTransfer();
      data.setData('text/plain', '<img src=x onerror=alert(1)>');
      element.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }),
      );
    });
  }
  await expect(editor).toContainText('<img src=x onerror=alert(1)>');
  await expect(editor.locator('img,script')).toHaveCount(0);
});
