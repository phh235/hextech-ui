import { expectSiteTheme, setMode } from './set-mode';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: native Fumadocs shell, plain catalog, highlighted code and switch movement`, async ({
    page,
    context,
    browserName,
  }) => {
    if (browserName === 'chromium')
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openPage(page, '/');
    await expect(page.locator('#nd-home-layout')).toBeVisible();
    await setMode(page, mode);
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
    await expect(page.getByRole('link', { name: 'Browse Components', exact: true })).toHaveClass(
      /hx-button-primary/,
    );
    await openPage(page, '/docs/components');
    await expect(page.locator('h1')).toHaveText('Components');
    await expect(page.getByRole('heading', { name: /^All Components/ })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search components' })).toHaveCount(0);
    await expect(page.locator('.catalog-categories')).toHaveCount(0);
    await openPage(page, '/docs/components/input');
    await expectSiteTheme(page.locator('.preview-stage'), mode);
    await expect(page.getByRole('heading', { name: 'Migration and visual notes' })).toHaveCount(0);
    await page
      .locator('.component-preview')
      .getByRole('tab', { name: 'Code', exact: true })
      .click();
    const example = page.locator('.preview-code figure.shiki');
    await expect(example).toHaveClass(/catppuccin-latte/);
    await example.locator('code span[style]').first().waitFor();
    if (browserName === 'chromium') {
      await example.getByRole('button', { name: 'Copy Text', exact: true }).click();
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("from '@/components/ui/input'");
    }
    await openPage(page, '/docs/components/switch');
    const control = page.getByRole('switch').first();
    await control.setChecked(true);
    const offset = () =>
      control.evaluate((el) => {
        const r = el.getBoundingClientRect(),
          t = el.querySelector('.hx-switch-thumb')!.getBoundingClientRect();
        return t.x + t.width / 2 - r.x - r.width / 2;
      });
    await expect.poll(offset).toBeGreaterThan(0);
    await control.click();
    await expect(control).not.toBeChecked();
    await expect.poll(offset).toBeLessThan(0);
    await control.press('Space');
    await expect(control).toBeChecked();
    await expect.poll(offset).toBeGreaterThan(0);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
  });
}

test('Markdown routes expose useful source and Ask AI opens with a truthful configuration response', async ({
  page,
  request,
}) => {
  for (const path of [
    '/llms.txt',
    '/llms-full.txt',
    '/docs/components/input.md',
    '/docs/index.md',
  ]) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    if (path.includes('input.md')) expect(await response.text()).toContain('defaultValue');
  }
  await openPage(page, '/docs/components/input');
  await page.getByRole('button', { name: 'Ask AI', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  expect((await request.post('/api/chat', { data: { messages: [] } })).status()).toBe(400);
  expect(
    (
      await request.post('/api/chat', {
        headers: { origin: 'https://unrelated.example' },
        data: { messages: [] },
      })
    ).status(),
  ).toBe(403);
});
