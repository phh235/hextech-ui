import { test, expect } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';

test('installation leads from setup to a working preview with framework-specific CSS', async ({
  page,
}) => {
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/docs/installation');
    await setMode(page, mode);
    await expect(page.locator('.fd-step')).toHaveCount(4);
    await expect(
      page.getByRole('heading', { name: 'Start the local registry', exact: true }),
    ).toHaveCount(0);
    await expect(page.locator('article')).not.toContainText('pnpm package:smoke');
    await expect(page.getByRole('tab', { name: 'Next.js', exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Vite', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Vite', exact: true })).toContainText(
      "@import './styles/hextech-tokens.css';",
    );
    await page.getByRole('tab', { name: 'Next.js', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Next.js', exact: true })).toContainText(
      "@import '../styles/hextech-tokens.css';",
    );
    await expect(page.getByRole('button', { name: 'Queue up', exact: true })).toBeEnabled();
    await page.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
      "from '@/components/ui/button'",
    );
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).not.toContainText(
      '/r/button.json',
    );
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
      'button-demo.tsx',
    );
    await expect(page.locator('.install-command')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('guide Markdown includes resolved install commands and complete examples', async ({
  request,
}) => {
  for (const guide of [
    'installation',
    'getting-started',
    'theming',
    'registry',
    'accessibility',
    'contributing',
    'changelog',
    'legal',
  ]) {
    const response = await request.get(`/docs/${guide}.md`);
    expect(response.ok(), guide).toBe(true);
    const markdown = await response.text();
    expect(markdown).not.toContain('<RegistryInstallCommand');
    expect(markdown).not.toContain('<CatalogPreview');
    if (guide === 'installation') {
      expect(markdown).toContain('npx shadcn@latest add http://127.0.0.1:3000/r/button.json');
      expect(markdown).toContain("from '@/components/ui/button'");
      expect(markdown).not.toContain('pnpm package:smoke');
    }
  }
  const response = await request.get('/llms-full.txt');
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  expect(markdown).not.toContain('<RegistryInstallCommand');
  expect(markdown).not.toContain('<CatalogPreview');
});

test('public previews omit state selectors, show Destructive and link repository notices', async ({
  page,
}) => {
  for (const mode of ['dark', 'light'] as const) {
    await openPage(page, '/docs/components/button');
    await setMode(page, mode);
    await expect(page.locator('.preview-toolbar')).toHaveCount(0);
    await expect(page.getByRole('combobox', { name: 'Example', exact: true })).toHaveCount(0);
    await expect(page.locator('.brand-content').first()).toHaveText('Hextech UI');
    await expect(page.locator('.brand-content img').first()).toHaveAttribute('src', '/icon.svg');
    const destructive = page.getByRole('button', { name: 'Delete', exact: true });
    await expect(destructive).toBeVisible();
    await expect(destructive).toHaveClass(/hx-button-destructive/);
    const color = await destructive.evaluate((e) => getComputedStyle(e).color);
    const background = await destructive.evaluate((e) => getComputedStyle(e).backgroundImage);
    await destructive.hover();
    await expect(destructive).not.toHaveCSS('color', color);
    await expect(destructive).not.toHaveCSS('background-image', background);
    await page.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Code', exact: true })).toContainText(
      'variant="destructive"',
    );
    await openPage(page, '/docs/legal');
    const notices = page
      .locator('article')
      .getByRole('link', { name: 'THIRD_PARTY_NOTICES.md', exact: true });
    await expect(notices.first()).toBeVisible();
    for (const notice of await notices.all())
      await expect(notice).toHaveAttribute(
        'href',
        'https://github.com/phh235/hextech-ui/blob/HEAD/THIRD_PARTY_NOTICES.md',
      );
  }
});
