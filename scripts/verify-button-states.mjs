import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
await fs.mkdir('.artifacts/screenshots', { recursive: true });
const reference = JSON.parse(
  await fs.readFile('tests/fixtures/references/storybook-button-reference.json', 'utf8'),
);
const properties = Object.keys(reference.results[0].states.default.values);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const results = [];
const measure = (locator) =>
  locator.evaluate((el, ps) => {
    const s = getComputedStyle(el);
    return Object.fromEntries(ps.map((p) => [p, s[p]]));
  }, properties);
const ignored = ['fontFamily'];
try {
  await page.goto('http://127.0.0.1:3000/internal/components/button');
  await page.locator('[data-preview-ready="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  for (const story of reference.results) {
    await page
      .getByRole('combobox', { name: 'Example', exact: true })
      .selectOption({ label: 'Storybook · ' + story.name });
    const b = page.locator(`[data-reference-story="${story.id}"]`);
    await b.waitFor();
    await b.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.activeElement?.blur());
    await page.mouse.move(1400, 880);
    await page.waitForTimeout(350);
    const states = { default: await measure(b) };
    if (!story.states.default.disabled) {
      await b.hover();
      await page.waitForTimeout(350);
      states.hover = await measure(b);
      await page.mouse.move(1400, 880);
      await page.keyboard.press('Tab');
      await b.focus();
      await page.waitForTimeout(350);
      states.focus = await measure(b);
      const r = await b.boundingBox();
      await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(350);
      states.active = await measure(b);
      await page.mouse.up();
    }
    const diffs = [];
    for (const [state, actual] of Object.entries(states))
      for (const p of properties) {
        if (ignored.includes(p)) continue;
        if (
          p.startsWith('outline') &&
          p !== 'outlineStyle' &&
          actual.outlineStyle === 'none' &&
          story.states[state].values.outlineStyle === 'none'
        )
          continue;
        if (actual[p] !== story.states[state].values[p])
          diffs.push({
            state,
            property: p,
            expected: story.states[state].values[p],
            actual: actual[p],
          });
      }
    results.push({ id: story.id, states, differences: diffs });
    console.log(story.id + ': ' + diffs.length);
  }
  await page.getByRole('combobox', { name: 'Example', exact: true }).selectOption('0');
  await page.mouse.move(1400, 880);
  await page.screenshot({
    path: '.artifacts/screenshots/fidelity-button-docs.png',
    fullPage: true,
  });
} finally {
  await browser.close();
  await fs.writeFile(
    '.artifacts/button-state-comparison.json',
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        fontException: 'Cinzel replaces unlicensed Beaufort; font family and text width excluded.',
        results,
      },
      null,
      2,
    ),
  );
}
const differences = results.reduce((count, result) => count + result.differences.length, 0);
if (results.length !== reference.results.length || differences)
  throw new Error(
    `Storybook comparison failed: ${results.length}/${reference.results.length} cases, ${differences} style differences`,
  );
