import { selectExample } from './select-example';
import { test, expect } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';

test('GitHub icon and label share the native sidebar controls with the theme switch', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/');
  if (isMobile) await page.getByRole('button', { name: 'Toggle Menu', exact: true }).click();
  const repository = page.locator('#nd-nav').getByRole('link', { name: 'GitHub', exact: true });
  await expect(repository.locator('svg[data-github-icon]')).toBeVisible();
  await expect(
    page.locator('.site-footer').getByRole('link', { name: 'GitHub', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.site-footer nav, .site-footer svg')).toHaveCount(0);
  await openPage(page, '/docs/components/input');
  if (isMobile) await page.getByRole('button', { name: 'Open Sidebar', exact: true }).click();
  const sidebar = page.locator(isMobile ? '#nd-sidebar-mobile' : '#nd-sidebar');
  const controls = sidebar.locator('[data-docs-controls]');
  const github = controls.getByRole('link', { name: 'GitHub', exact: true });
  await expect(github).toHaveAttribute('href', 'https://github.com/phh235/hextech-ui');
  await expect(github.locator('svg[data-github-icon]')).toBeVisible();
  const theme = controls.getByRole('button', { name: 'Toggle Theme', exact: true });
  await expect(theme).toBeVisible();
  const linkBox = await github.boundingBox(),
    themeBox = await theme.boundingBox();
  expect(linkBox!.x + linkBox!.width).toBeLessThanOrEqual(themeBox!.x);
  expect(
    Math.abs(linkBox!.y + linkBox!.height / 2 - themeBox!.y - themeBox!.height / 2),
  ).toBeLessThan(2);
  await expect(sidebar.getByRole('link', { name: 'GitHub', exact: true })).toHaveCount(1);
});

test('Hextech hero actions and preview cards share the component styling', async ({ page }) => {
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/');
    await setMode(page, mode);
    await expect(page.getByRole('link', { name: 'Browse Components', exact: true })).toHaveClass(
      /hx-button-primary/,
    );
    await expect(page.getByRole('link', { name: 'Get Started', exact: true })).toHaveClass(
      /hx-button-hextech/,
    );
    const card = page.getByRole('region', { name: 'Make your move', exact: true });
    await expect(card).toHaveClass(/hx-frame/);
    await expect(card).toHaveCSS('border-top-width', '2px');
    await expect(card).toHaveCSS('padding-left', '20px');
    await expect(card.locator('.featured-demo, .preview-stage')).toHaveCount(0);
    await expect(page.locator('[data-hextech-chart-ready], .hx-table')).toHaveCount(0);
    await expect(page.getByRole('slider', { name: 'Music', exact: true })).toBeVisible();
    const frames = await page.locator('.showcase-card').evaluateAll((cards) =>
      cards.map((element) => {
        const style = getComputedStyle(element);
        return {
          borderWidth: style.borderTopWidth,
          background: style.backgroundImage,
          padding: style.padding,
        };
      }),
    );
    expect(frames).toHaveLength(12);
    expect(frames.every((frame) => JSON.stringify(frame) === JSON.stringify(frames[0]))).toBe(true);
    const heading = await page.locator('h1').boundingBox();
    expect(Math.abs(heading!.x + heading!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(
      2,
    );
  }
});

test('terminal lines retain native padding and simple previews omit the extra toolbar', async ({
  page,
}) => {
  await openPage(page, '/docs/components/spinner');
  await expect(page.locator('.preview-toolbar')).toHaveCount(0);
  await page.locator('.component-preview').getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.locator('.install-command .line')).toHaveCSS('padding-left', '16px');
  await openPage(page, '/docs/components/input');
  await expect(page.getByRole('combobox', { name: 'Width', exact: true })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Example', exact: true })).toHaveCount(0);
});

test('keyboard focus is painted on tab, slider and calendar controls', async ({ page }) => {
  await openPage(page, '/docs/components/tabs');
  const tab = page.locator('.hx-tab').first();
  await page.keyboard.press('Tab');
  await tab.focus();
  await expect(tab).toHaveCSS('outline-style', 'solid');
  await expect(tab).toHaveCSS('outline-width', '1px');
  await page.keyboard.down('Space');
  await expect(tab).toHaveCSS('color', 'rgb(120, 90, 40)');
  await page.keyboard.up('Space');
  await openPage(page, '/docs/components/slider');
  await page.keyboard.press('Tab');
  await page.getByRole('slider').first().focus();
  await expect(page.locator('.hx-slider-thumb').first()).toHaveCSS('outline-style', 'solid');
  await openPage(page, '/docs/components/calendar');
  await page.keyboard.press('Tab');
  await page
    .locator('.hx-calendar-day:not(:disabled, [data-outside-visible-range])')
    .first()
    .focus();
  await expect(page.locator('.hx-calendar-day:focus')).toHaveCSS('outline-width', '2px');
});

test('disabled labels ignore hover, and Switch paints held Space without repeated activation', async ({
  page,
}) => {
  await openPage(page, '/docs/components/checkbox');
  await selectExample(page, '1');
  const checkboxLabel = page.locator('.hx-checkbox-label').first();
  await checkboxLabel.hover();
  await expect(checkboxLabel).toHaveCSS('color', 'rgb(160, 155, 140)');
  await expect(checkboxLabel).toHaveCSS('filter', 'brightness(0.5)');
  await openPage(page, '/docs/components/radio');
  await selectExample(page, '1');
  const radioLabel = page.locator('.hx-radio-label').first();
  await radioLabel.hover();
  await expect(radioLabel).toHaveCSS('color', 'rgb(91, 90, 86)');
  await openPage(page, '/internal/components/switch');
  const control = page.getByRole('switch');
  await control.focus();
  await page.keyboard.down('Space');
  await expect(control).toHaveAttribute('data-keyboard-pressed', 'true');
  await expect(control).toHaveCSS('background-image', /rgb\(70, 55, 20\)/);
  await page.keyboard.up('Space');
  await expect(control).not.toHaveAttribute('data-keyboard-pressed', 'true');
  await expect(control).toBeChecked();
});

test('textarea padding and progress fill use the measured content-box geometry', async ({
  page,
}) => {
  await openPage(page, '/internal/components/textarea');
  await expect(page.locator('textarea')).toHaveCSS('height', '50px');
  await expect(page.locator('textarea')).toHaveCSS('padding-top', '8px');
  await openPage(page, '/docs/components/progress');
  await expect(page.locator('.hx-progress-fill').first()).toHaveCSS('height', '8px');
});

test('documentation centers a bounded reading column inside the full-width shell', async ({
  page,
  isMobile,
}) => {
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/docs/components/input');
    await setMode(page, mode);
    const geometry = await page.locator('[data-layout-content]').evaluate((article) => {
      const main = article.parentElement!,
        body = article.querySelector('.prose')!;
      const a = article.getBoundingClientRect(),
        m = main.getBoundingClientRect(),
        b = body.getBoundingClientRect();
      const s = getComputedStyle(article);
      return {
        article: a.width,
        centered: Math.abs(a.left - m.left - (m.right - a.right)),
        main: m.width,
        body: b.width,
        inset: parseFloat(s.paddingLeft) + parseFloat(s.paddingRight),
        right: m.right,
        viewport: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(Math.abs(geometry.article - Math.min(geometry.main, 900))).toBeLessThan(1);
    expect(geometry.centered).toBeLessThan(1);
    expect(Math.abs(geometry.body - geometry.article + geometry.inset)).toBeLessThan(1);
    expect(Math.abs(geometry.right - geometry.viewport)).toBeLessThanOrEqual(1);
    expect(geometry.inset).toBeGreaterThan(0);
    expect(geometry.overflow).toBe(false);
  }
});
