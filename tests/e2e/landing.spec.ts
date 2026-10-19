import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './navigation';
import { setMode } from './set-mode';

for (const [name, destination, heading] of [
  ['Browse Components', '/docs/components', 'Components'],
  ['Get Started', '/docs/installation', 'Installation'],
] as const) {
  test(`${name} uses client navigation without reloading the document`, async ({ page }) => {
    await openPage(page, '/');
    const ready = page.getByRole('checkbox', { name: 'Ready to play', exact: true });
    await ready.click();
    await expect(ready).not.toBeChecked();
    await page.evaluate(() => {
      document.documentElement.dataset.navigationProbe = 'same-document';
    });
    const documents: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'document' && request.frame() === page.mainFrame())
        documents.push(request.url());
    });
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(destination);
    await expect(page.getByRole('heading', { name: heading, exact: true, level: 1 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-navigation-probe', 'same-document');
    expect(documents).toEqual([]);
  });
}

for (const mode of ['dark', 'light'] as const) {
  test('Fumadocs home with the Hextech hero stays interactive in ' + mode, async ({ page }) => {
    await openPage(page, '/');
    await setMode(page, mode);
    await expect(page.locator('#nd-home-layout')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/League-inspired components.\s*Open by design./);
    const browse = page.getByRole('link', { name: 'Browse Components', exact: true });
    const started = page.getByRole('link', { name: 'Get Started', exact: true });
    await expect(browse).toHaveClass(/hx-button-primary/);
    await expect(started).toHaveClass(/hx-button-hextech/);
    await expect(browse).toHaveAttribute('href', '/docs/components');
    await expect(started).toHaveAttribute('href', '/docs/installation');
    await page.keyboard.press('Tab');
    await browse.focus();
    await expect(browse).toHaveCSS('outline-style', 'solid');
    await page.mouse.move(0, 0);
    await expect(page.locator('.showcase-card')).toHaveCount(12);
    await expect(page.locator('.showcase-grid > .showcase-card')).toHaveCount(12);
    const cards = await page.locator('.showcase-card').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width };
      }),
    );
    for (const card of cards) {
      expect(Math.abs(card.width - cards[0]!.width)).toBeLessThanOrEqual(1);
      const next = cards
        .filter((peer) => Math.abs(peer.left - card.left) <= 1 && peer.top > card.top)
        .sort((a, b) => a.top - b.top)[0];
      if (next) expect(Math.abs(next.top - card.bottom - 20)).toBeLessThanOrEqual(1);
    }
    await expect
      .poll(() =>
        page.locator('.showcase-card').evaluateAll((elements) => {
          const bottoms = new Map<number, number>();
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const column = Math.round(rect.left);
            bottoms.set(column, Math.max(bottoms.get(column) ?? 0, rect.bottom));
          }
          return Math.max(...bottoms.values()) - Math.min(...bottoms.values());
        }),
      )
      .toBeLessThanOrEqual(1);
    await expect(
      page.getByRole('region', { name: 'Player profile', exact: true }).locator('img'),
    ).toHaveAttribute('src', '/icon.svg');
    await expect(page.locator('[data-hextech-chart-ready], .hx-table')).toHaveCount(0);
    await expect(page.getByRole('slider', { name: 'Music', exact: true })).toBeVisible();
    await expect(page.locator('.landing-open,.dx-grid,.hero-install,.canvas-bar')).toHaveCount(0);
    const buttonCard = page.getByRole('region', { name: 'Make your move', exact: true });
    const queue = buttonCard.getByRole('button', { name: 'Queue up', exact: true });
    await queue.click();
    await expect(queue).toHaveText('Queue up');
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: '.artifacts/screenshots/native-home-' + mode + '-' + test.info().project.name + '.png',
      fullPage: true,
    });
    await started.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/docs/installation');
    await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
  });
}

for (const mode of ['dark', 'light'] as const) {
  test('showcase forms, overlays, settings and notifications work in ' + mode, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openPage(page, '/');
    await setMode(page, mode);
    await expect(page.locator('[data-hextech-chart-ready], .hx-table')).toHaveCount(0);
    const music = page.getByRole('slider', { name: 'Music', exact: true });
    await expect(music).toHaveAttribute('aria-valuenow', '35');
    await music.focus();
    await page.keyboard.press('ArrowRight');
    await expect(music).toHaveAttribute('aria-valuenow', '40');
    const playstyles = page.getByRole('radiogroup', { name: 'Playstyle', exact: true });
    await expect(playstyles.getByRole('radio', { name: /^Balanced/ })).toBeChecked();
    const aggressive = playstyles.getByRole('radio', { name: /^Aggressive/ });
    await aggressive.check();
    await expect(aggressive).toBeChecked();
    await aggressive.focus();
    await page.keyboard.press('ArrowDown');
    await expect(playstyles.getByRole('radio', { name: /^Defensive/ })).toBeChecked();

    await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Make it yours' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: 'Display name', exact: true }).fill('A');
    await expect(dialog.getByRole('button', { name: 'Save profile', exact: true })).toBeDisabled();
    await dialog.getByRole('textbox', { name: 'Display name', exact: true }).fill('Nova');
    await dialog.getByRole('button', { name: 'Save profile', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Player profile', exact: true })).toContainText(
      'Nova',
    );

    await page.getByRole('combobox', { name: 'Game mode', exact: true }).click();
    await expect(page.getByRole('listbox')).toBeVisible();
    expect(
      await page
        .getByRole('listbox')
        .evaluate((element) =>
          element.closest('[data-color-mode]')?.getAttribute('data-color-mode'),
        ),
    ).toBe(mode);
    await page.getByRole('option', { name: 'Ranked flex', exact: true }).click();
    await page.getByRole('button', { name: 'Save settings', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Settings updated.' })).toBeVisible();

    const champion = page.getByRole('combobox', { name: 'Champion', exact: true });
    await champion.fill('Ah');
    await page.getByRole('option', { name: 'Ahri', exact: true }).click();
    await expect(champion).toHaveValue('Ahri');

    await page.getByRole('button', { name: 'Build actions', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Show runes', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Runes', exact: true })).toContainText(
      'Sorcery',
    );

    const invites = page.getByRole('switch', { name: /^Party invites/ });
    await invites.click();
    await expect(invites).not.toBeChecked();

    await page.getByRole('button', { name: 'Success', exact: true }).click();
    await expect(page.getByText('Build saved', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss notification', exact: true }).click();
    await expect(page.getByText('Build saved', { exact: true })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
