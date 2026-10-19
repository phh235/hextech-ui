import { expect, type Page } from '@playwright/test';
/** Programmatic focus/fill can run before hydration; wait for the real preview handlers. */
export async function openPage(page: Page, href: string) {
  const response = await page.goto(href);
  if (
    /^\/docs\/(?:components|blocks)\//.test(href) ||
    href === '/internal/verification' ||
    href.startsWith('/internal/components/')
  ) {
    await expect(page.locator('.component-preview')).toHaveAttribute('data-preview-ready', 'true', {
      timeout: 15000,
    });
    await expect(page.locator('.preview-viewport [data-hextech-ready="false"]')).toHaveCount(0);
  }
  const header = page.locator('#nd-nav');
  if (await header.count()) {
    // Measure the settled sticky header, rather than a transient crossfade frame.
    await header.evaluate(async (element) => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await Promise.all(
        element
          .getAnimations({ subtree: true })
          .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      );
    });
  }
  return response;
}
