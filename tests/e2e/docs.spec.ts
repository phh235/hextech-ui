import manifest from '../../packages/react/component-manifest.json' with { type: 'json' };
import { selectExample } from './select-example';
import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import ts from 'typescript';
import { expectSiteTheme, setMode } from './set-mode';

test('Fumadocs shell exposes the catalog, ordered navigation and live preview', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/docs/components/dialog');
  await expect(page.locator('#nd-docs-layout')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Dialog');
  await expect(page.getByRole('button', { name: 'Edit profile', exact: true })).toBeVisible();
  if (!isMobile) {
    const sidebar = page.locator('#nd-sidebar');
    await expect(sidebar.getByRole('link', { name: 'Dialog', exact: true })).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(await sidebar.locator('a[href^="/docs/components/"]').count()).toBe(manifest.length);
    const names = await sidebar.locator('a[href^="/docs/components/"]').allTextContents();
    expect(names.map((name) => name.trim())).toEqual(
      names.map((name) => name.trim()).sort((a, b) => a.localeCompare(b, 'en')),
    );
    await expect(sidebar.locator('a[href^="/docs/blocks"]')).toHaveCount(0);
    await expect(sidebar.getByRole('link', { name: 'Themes', exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole('link', { name: 'Docs', exact: true })).toHaveCount(0);
    await expect(sidebar.locator('a[href="/docs/theming"]')).toHaveCount(1);
    await expect(sidebar.getByRole('link', { name: 'All Components', exact: true })).toHaveCount(1);
    const sidebarText = (await sidebar.locator('p').allTextContents()).join('\n');
    expect(sidebarText.indexOf('Get Started')).toBeLessThan(sidebarText.indexOf('Foundation'));
    expect(sidebarText.indexOf('Foundation')).toBeLessThan(sidebarText.indexOf('Components'));
    await expect(page.locator('#nd-toc')).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Migration and visual notes', exact: true }),
    ).toHaveCount(0);
  }
  await page.screenshot({
    path: `.artifacts/screenshots/fumadocs-dialog-dark-${test.info().project.name}.png`,
  });
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Edit profile' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Edit profile', exact: true })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Preview', exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Code', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark');
  await expect(page.getByRole('button', { name: /Switch to .* mode/ })).toHaveCount(0);
});

test('home and documentation have no serious accessibility violations or overflow', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const url of [
    '/',
    '/docs',
    '/docs/installation',
    '/docs/components',
    '/docs/blocks',
    '/docs/theming',
    '/docs/registry',
    '/docs/changelog',
    '/docs/getting-started',
  ]) {
    await openPage(page, url);
    await expect(page.locator('h1')).toBeVisible();
    const violations = (
      await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    ).violations;
    expect(violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('theme preference, search, keyboard dismissal, and copy command work', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openPage(page, '/');
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark');
  await page.evaluate(() => localStorage.setItem('hextech-ui-color-mode', 'light'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light');
  await setMode(page, 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark');
  await page.getByRole('button', { name: /^(Search documentation|Open Search)$/ }).click();
  const search = page.getByRole('combobox', { name: 'Search', exact: true });
  await search.fill('installation');
  await expect(search).toHaveCSS('outline-style', 'none');
  await page
    .getByRole('dialog')
    .screenshot({ path: `.artifacts/screenshots/fidelity-search-${test.info().project.name}.png` });
  await expect(page.getByRole('dialog').getByRole('option').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await openPage(page, '/docs/components/button');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await page
    .locator('.install-command')
    .getByRole('button', { name: 'Copy Text', exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('npx shadcn@latest add http://127.0.0.1:3000/r/button.json');
  await openPage(page, '/docs/installation');
  await page
    .locator('figure.shiki')
    .filter({ hasText: "@import 'tailwindcss';" })
    .getByRole('button', { name: 'Copy Text', exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("@import 'tailwindcss';");
  await openPage(page, '/docs/components/button');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  const command = page.locator('.install-command code');
  await expect(command).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(command).toHaveCSS('border-top-width', '0px');
  await expect(command).toHaveCSS('font-family', /JetBrains Mono/);
  await expect(page.locator('.install-command button svg')).toHaveCount(1);
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await page
    .locator('.preview-code')
    .getByRole('button', { name: 'Copy Text', exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("from '@/components/ui/button'");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^'use client';/);
  const parsed = ts.transpileModule(copied, {
    fileName: 'copied-example.tsx',
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
  });
  expect(
    parsed.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error),
  ).toEqual([]);
  const code = page.getByRole('region', { name: 'Button example code', exact: true });
  await page.keyboard.press('Tab');
  await expect(code).toBeFocused();
  await expect(code).not.toHaveCSS('box-shadow', 'none');
});

test('Base UI fixture supports keyboard state, disabled variant, code, and scoped theme', async ({
  page,
}) => {
  await openPage(page, '/internal/verification');
  const toggle = page.getByRole('button', { name: 'Internal verification toggle' });
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await selectExample(page, '1');
  await expect(toggle).toBeDisabled();
  await expect(page.getByRole('combobox', { name: 'Width', exact: true })).toHaveCount(0);
  await expectSiteTheme(page.locator('.preview-stage'), 'dark');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
    '<InternalSmoke',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.evaluate(() =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--hextech-ui-duration-normal'),
      ),
    ),
  ).toBe(0);
});

test('mobile navigation follows routes and its native toggle closes by keyboard', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await openPage(page, '/docs');
  const trigger = page
    .locator('#nd-subnav')
    .getByRole('button', { name: /^(Open|Close) Sidebar$/ });
  await trigger.click();
  const drawer = page.locator('#nd-sidebar-mobile');
  await expect(drawer.getByRole('link', { name: 'Themes', exact: true })).toHaveCount(0);
  await expect(drawer.getByRole('link', { name: 'Docs', exact: true })).toHaveCount(0);
  await expect(drawer.locator('a[href="/docs/theming"]')).toHaveCount(1);
  await expect(drawer.getByRole('link', { name: 'All Components', exact: true })).toHaveCount(1);
  await expect(drawer.getByRole('link', { name: 'GitHub', exact: true })).toHaveCount(1);
  await expect(drawer.locator('svg[data-github-icon="true"]')).toHaveCount(1);
  await drawer.getByRole('link', { name: 'Theming', exact: true }).click();
  await expect(page).toHaveURL('/docs/theming');
  await expect(drawer).toBeHidden();
  await trigger.click();
  await expect(drawer).toBeVisible();
  await trigger.focus();
  await trigger.press('Enter');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('all documentation links resolve, metadata uses the new brand, and internal fixtures stay marked', async ({
  page,
  request,
}) => {
  const routes = [
    '/',
    '/docs',
    '/docs/installation',
    '/docs/getting-started',
    '/docs/components',
    '/docs/blocks',
    '/docs/theming',
    '/docs/registry',
    '/docs/changelog',
  ];
  const links = new Set<string>();
  for (const route of routes) {
    await openPage(page, route);
    await expect(page).toHaveTitle(/Hextech UI/);
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('href') || ''));
    for (const href of hrefs) {
      if (href.startsWith('#'))
        await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
      else if (href.startsWith('/')) links.add(href);
    }
  }
  for (const href of links) expect((await request.get(href)).ok(), href).toBe(true);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.name).toBe('Hextech UI');
  const catalog = await (await request.get('/r/registry.json')).json();
  expect(catalog.name).toBe('hextech-ui');
  expect(catalog.items.some((item: { name: string }) => item.name.startsWith('internal-'))).toBe(
    false,
  );
  const internal = await (await request.get('/r/internal-smoke.json')).json();
  expect(internal.meta.internal).toBe(true);
  expect((await request.get('/r/button.json')).status()).toBe(200);
  expect((await request.get('/opengraph-image.png')).headers()['content-type']).toContain(
    'image/png',
  );
});
