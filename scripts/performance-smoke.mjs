import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { artifacts, startWeb, waitFor } from './process.mjs';
const origin = 'http://127.0.0.1:3301';
try {
  await fetch(origin);
  throw new Error('Port 3301 is occupied.');
} catch (error) {
  if (error.message.includes('occupied')) throw error;
}
const server = startWeb(3301);
const browser = await chromium.launch();
const results = [];
try {
  await waitFor(origin, server);
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__hextechPerformance = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__hextechPerformance.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__hextechPerformance.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert((await page.locator('h1').textContent()).includes('League-inspired components.'));
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const scripts = resources.filter((entry) => /\.js(?:\?|$)/.test(entry.name));
      return {
        firstContentfulPaintMs:
          performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
        largestContentfulPaintMs: window.__hextechPerformance.lcp || null,
        cumulativeLayoutShift: window.__hextechPerformance.cls,
        domContentLoadedMs: navigation.domContentLoadedEventEnd,
        javascriptEncodedBytes: scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        javascriptDecodedBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        javascriptRequests: scripts.length,
        fontRequests: resources.filter((entry) => /\.(?:woff2?|ttf|otf)(?:\?|$)/.test(entry.name))
          .length,
        externalOrigins: [
          ...new Set(
            resources
              .map((entry) => new URL(entry.name).origin)
              .filter((value) => value !== location.origin),
          ),
        ],
      };
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(
      metrics.externalOrigins,
      [],
      'Landing unexpectedly requested an external origin',
    );
    results.push({ viewport, metrics, runtimeErrors: 0 });
    await context.close();
  }
  await writeFile(
    path.join(artifacts, 'performance-smoke-result.json'),
    JSON.stringify(
      {
        passed: true,
        browser: browser.version(),
        platform: process.platform,
        node: process.version,
        conditions:
          'Local production Next server, cold browser context per viewport, no CPU/network throttling. Navigation/prefetch bytes are lab observations, not field performance or a Lighthouse score.',
        results,
        completedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  server.kill();
}
