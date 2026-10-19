import { test, expect } from '@playwright/test';

const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hextech-ui.vercel.app').replace(
  /\/$/,
  '',
);
const publicPages = ['/', '/docs/installation', '/docs/components/button'];
const bots = ['Googlebot', 'Twitterbot/1.0', 'facebookexternalhit/1.1'];

for (const userAgent of bots) {
  test(`${userAgent}: metadata and content are present without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required');
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, userAgent });
    const page = await context.newPage();
    try {
      for (const path of publicPages) {
        const response = await page.goto(path);
        const canonical = path === '/' ? origin : origin + path;
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
        await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', canonical);
        await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
          'content',
          /.+/,
        );
        await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
          'content',
          canonical,
        );
        await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
          'content',
          /Hextech UI/,
        );
        await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute(
          'content',
          /.+/,
        );
        await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
          'content',
          new RegExp('^' + origin.replaceAll('.', '\\.') + '/opengraph-image\\.png'),
        );
        await expect(page.locator('head meta[property="og:image:width"]')).toHaveAttribute(
          'content',
          '1200',
        );
        await expect(page.locator('head meta[property="og:image:height"]')).toHaveAttribute(
          'content',
          '630',
        );
        await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
          'content',
          'summary_large_image',
        );
        await expect(page.locator('head meta[name="twitter:image"]')).toHaveAttribute(
          'content',
          origin + '/opengraph-image.png',
        );
        await expect(page.locator('head meta[name="twitter:title"]')).toHaveAttribute(
          'content',
          /Hextech UI/,
        );
        await expect(page.locator('head meta[name="robots"]')).not.toHaveAttribute(
          'content',
          /noindex/,
        );
        const data = await page.locator('script[type="application/ld+json"]').allTextContents();
        expect(data.length).toBeGreaterThan(0);
        const parsed = data.map((text) => JSON.parse(text));
        if (path === '/') {
          expect(parsed.map((item) => item['@type'])).toEqual(['WebSite', 'SoftwareSourceCode']);
        } else {
          expect(parsed[0]['@type']).toBe('BreadcrumbList');
          const items = parsed[0].itemListElement;
          expect(items.at(-1).item).toBe(origin + path);
          expect(items.map((item: { position: number }) => item.position)).toEqual(
            items.map((_: unknown, index: number) => index + 1),
          );
        }
      }
    } finally {
      await context.close();
    }
  });
}

test('sitemap, crawler headers and social image agree with canonical pages', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: ' + origin + '/sitemap.xml');
  expect(await robots.text()).not.toContain('Disallow: /internal');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  );
  expect(locations.length).toBeGreaterThan(50);
  expect(new Set(locations).size).toBe(locations.length);
  expect(locations.every((url) => url === origin || url.startsWith(origin + '/'))).toBe(true);
  expect(locations.some((url) => /\/(internal|r|api)\/|\/docs\/blocks/.test(url))).toBe(false);
  for (const url of locations) {
    const response = await request.get(new URL(url).pathname);
    expect(response.status(), url).toBe(200);
    const html = await response.text();
    expect(html, url).toContain(`rel="canonical" href="${url}"`);
    expect(html, url).not.toContain('name="robots" content="noindex');
    expect(html, url).toContain('property="og:image"');
    expect(html, url).toContain('name="twitter:image"');
  }
  const image = await request.get('/opengraph-image.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
  const bytes = await image.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  for (const path of [
    '/internal/components/button',
    '/r/button.json',
    '/docs/components/button.md',
    '/llms.txt',
    '/llms-full.txt',
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['x-robots-tag'], path).toContain('noindex');
  }
});

test('internal fixtures and removed pages stay out of search results', async ({
  browser,
  baseURL,
  request,
}) => {
  if (!baseURL) throw new Error('Playwright baseURL is required');
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/internal/components/button');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await page.goto('/docs/blocks');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const missing = await request.get('/docs/components/use-drag-and-drop');
    expect(missing.status()).toBe(404);
    expect(await missing.text()).toContain('noindex');
  } finally {
    await context.close();
  }
});
