import { test, expect, type Page } from '@playwright/test';
import { openPage } from './navigation';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const plays: string[] = [];
    Reflect.set(window, '__interactionSoundPlays', plays);
    HTMLMediaElement.prototype.play = function () {
      plays.push(this.getAttribute('src') || '');
      return Promise.resolve();
    };
  });
});
const plays = (page: Page) =>
  page.evaluate(() => Reflect.get(window, '__interactionSoundPlays') as string[]);
const clear = (page: Page) =>
  page.evaluate(() => {
    (Reflect.get(window, '__interactionSoundPlays') as string[]).length = 0;
  });

test('buttons sound on activation, skip disabled controls and persist mute', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/docs/components/button');
  const queue = page.getByRole('button', { name: 'Queue up', exact: true });
  await queue.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => plays(page)).toContain('/sounds/sfx-clash-button-circlegold-click.ogg');
  await clear(page);
  await page.getByRole('button', { name: 'Preparing', exact: true }).dispatchEvent('click');
  expect(await plays(page)).toEqual([]);
  // The sidebar toggle is reachable on mobile by opening its native menu.
  if (isMobile) await page.getByRole('button', { name: 'Open Sidebar', exact: true }).click();
  const toggle = page.getByRole('button', { name: 'Sound effects', exact: true }).first();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  if (isMobile)
    await page
      .locator('#nd-sidebar-mobile')
      .getByRole('button', { name: 'Close Sidebar', exact: true })
      .click();
  await queue.click();
  expect(await plays(page)).toEqual([]);
  await page.reload();
  if (isMobile) await page.getByRole('button', { name: 'Open Sidebar', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sound effects', exact: true }).first(),
  ).toHaveAttribute('aria-pressed', 'false');
  if (isMobile)
    await page
      .locator('#nd-sidebar-mobile')
      .getByRole('button', { name: 'Close Sidebar', exact: true })
      .click();
  await page.getByRole('button', { name: 'Queue up', exact: true }).click();
  expect(await plays(page)).toEqual([]);
});

test('dropdown triggers and portal options use one dropdown cue per click', async ({ page }) => {
  await openPage(page, '/docs/components/menu');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  expect((await plays(page)).filter((src) => src.endsWith('dropdown-click.ogg'))).toHaveLength(1);
  await expect(page.getByRole('menuitem', { name: 'Save build' })).toBeVisible();
  await clear(page);
  await page.getByRole('menuitem', { name: 'Save build' }).click();
  expect(await plays(page)).toEqual(['/sounds/sfx-clash-dropdown-click.ogg']);
});

test('tab and calendar selection use the grid cue', async ({ page }) => {
  await openPage(page, '/docs/components/tabs');
  await page.getByRole('tab', { name: 'Runes', exact: true }).click();
  expect(await plays(page)).toEqual(['/sounds/sfx-clash-grid-click.ogg']);
  await openPage(page, '/docs/components/calendar');
  await page
    .locator('.hx-calendar-day:not(:disabled):not([data-outside-visible-range])')
    .first()
    .click();
  expect(await plays(page)).toEqual(['/sounds/sfx-clash-grid-click.ogg']);
});

test('mouse hover sounds once on entry and touch does not synthesize hover audio', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/docs/components/button');
  const queue = page.getByRole('button', { name: 'Queue up', exact: true });
  if (isMobile) {
    await queue.tap();
    expect(await plays(page)).toEqual(['/sounds/sfx-clash-button-circlegold-click.ogg']);
  } else {
    await queue.hover();
    expect(await plays(page)).toEqual(['/sounds/sfx-clash-button-circlegold-hover.ogg']);
    await queue.dispatchEvent('pointerover', {
      pointerType: 'mouse',
      relatedTarget: await queue.elementHandle(),
    });
    expect(await plays(page)).toHaveLength(1);
  }
});

test('all four supplied OGG files decode in the browser', async ({ page }) => {
  await page.goto('/');
  const durations = await page.evaluate(async () => {
    const names = [
      'button-circlegold-click',
      'button-circlegold-hover',
      'dropdown-click',
      'grid-click',
    ];
    return Promise.all(
      names.map(
        (name) =>
          new Promise<number>((resolve, reject) => {
            const audio = new Audio(`/sounds/sfx-clash-${name}.ogg`);
            const timeout = setTimeout(
              () => reject(new Error(`Audio metadata timed out: ${name}`)),
              10000,
            );
            audio.onloadedmetadata = () => {
              clearTimeout(timeout);
              resolve(audio.duration);
            };
            audio.onerror = () => {
              clearTimeout(timeout);
              reject(new Error(`Audio decode failed: ${name}`));
            };
            audio.preload = 'metadata';
            audio.load();
          }),
      ),
    );
  });
  for (const duration of durations) {
    expect(duration).toBeGreaterThan(0);
    expect(duration).toBeLessThan(10);
  }
});

test('blocked audio leaves controls working and native docs controls stay silent', async ({
  page,
}) => {
  await openPage(page, '/docs/components/tabs');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  expect(await plays(page)).toEqual([]);
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await page.evaluate(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException('Blocked', 'NotAllowedError'));
  });
  await page.getByRole('tab', { name: 'Runes', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Runes', exact: true })).toContainText(
    'Rune choices',
  );
});
