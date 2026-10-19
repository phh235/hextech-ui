import { expect, type Locator, type Page } from '@playwright/test';
export async function expectSiteTheme(target: Locator, mode: 'light' | 'dark') {
  await expect
    .poll(() =>
      target.evaluate((element) => ({
        mode: element.closest('[data-color-mode]')?.getAttribute('data-color-mode'),
        background: getComputedStyle(element).getPropertyValue('--hextech-ui-background').trim(),
      })),
    )
    .toEqual({ mode, background: mode === 'light' ? '#f7f5ee' : '#010a13' });
}
export async function setMode(page: Page, mode: 'light' | 'dark') {
  if ((await page.locator('html').getAttribute('data-color-mode')) === mode) return;
  let toggle = page.getByRole('button', { name: 'Toggle Theme', exact: true }).first();
  let drawerOpened = false;
  if (!(await toggle.isVisible())) {
    const homeMenu = page.getByRole('button', { name: 'Toggle Menu', exact: true });
    const menu = (await homeMenu.count())
      ? homeMenu
      : page.locator('#nd-subnav').getByRole('button', { name: 'Open Sidebar', exact: true });
    await menu.focus();
    await menu.press('Enter');
    drawerOpened = !(await homeMenu.count());
    toggle = page.getByRole('button', { name: 'Toggle Theme', exact: true }).first();
  }
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', mode);
  await page.keyboard.press('Escape');
  const menu = page.getByRole('button', { name: 'Toggle Menu', exact: true });
  if ((await menu.count()) && (await menu.getAttribute('aria-expanded')) === 'true')
    await menu.press('Enter');
  if (drawerOpened)
    await page
      .locator('#nd-subnav')
      .getByRole('button', { name: 'Close Sidebar', exact: true })
      .press('Enter');
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}
