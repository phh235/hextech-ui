import { test, expect } from '@playwright/test';

test('analytics mounts once and queues pageviews across client navigation', async ({ page }) => {
  // Keep this local test independent of Vercel's collection service.
  await page.route(
    /(?:va\.vercel-scripts\.com\/.*script.*\.js|\/_vercel\/insights\/script\.js)/,
    (route) =>
      route.fulfill({ contentType: 'application/javascript', body: '/* local analytics stub */' }),
  );
  await page.goto('/');
  const script = page.locator(
    'head script[src*="script.debug.js"], head script[src="/_vercel/insights/script.js"]',
  );
  await expect(script).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() =>
        ((Reflect.get(window, 'vaq') as [string, { path?: string }][] | undefined) || [])
          .filter(([event]) => event === 'pageview')
          .map(([, data]) => (data as { path?: string }).path),
      ),
    )
    .toContain('/');
  await page.evaluate(() => Reflect.set(window, '__analyticsNavigationMarker', 'same-document'));
  await page
    .locator('a[href="/docs/installation"]')
    .filter({ hasText: /Get Started/i })
    .click();
  await expect(page).toHaveURL(/\/docs\/installation$/);
  expect(await page.evaluate(() => Reflect.get(window, '__analyticsNavigationMarker'))).toBe(
    'same-document',
  );
  await expect(script).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() =>
        ((Reflect.get(window, 'vaq') as [string, { path?: string }][] | undefined) || [])
          .filter(([event]) => event === 'pageview')
          .map(([, data]) => (data as { path?: string }).path),
      ),
    )
    .toContain('/docs/installation');
});
