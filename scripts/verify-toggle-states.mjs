import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
const reference = JSON.parse(
  await fs.readFile('tests/fixtures/references/storybook-toggle-reference.json', 'utf8'),
);
const properties = Object.keys(reference.results[0].states.default.values);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const results = [];
const measure = (el) =>
  el.evaluate((el, ps) => {
    const s = getComputedStyle(el);
    return {
      disabled: el.matches(':disabled'),
      pressed: el.getAttribute('aria-pressed'),
      values: Object.fromEntries(ps.map((k) => [k, s[k]])),
    };
  }, properties);
try {
  await p.goto('http://127.0.0.1:3000/internal/components/toggle');
  await p.locator('[data-preview-ready=true]').waitFor();
  await p.evaluate(() => document.fonts.ready);
  for (const story of reference.results) {
    await p
      .getByRole('combobox', { name: 'Example', exact: true })
      .selectOption({ label: 'Storybook · ' + story.name });
    const el = p.locator(`[data-reference-story="${story.id}"]`);
    await el.waitFor();
    await el.scrollIntoViewIfNeeded();
    const states = {};
    for (const prefix of ['', 'alternate-']) {
      await p.mouse.move(1400, 880);
      await el.evaluate((el) => el.blur());
      await p.waitForTimeout(350);
      states[prefix + 'default'] = await measure(el);
      if (states[prefix + 'default'].disabled) break;
      await el.hover();
      await p.waitForTimeout(350);
      states[prefix + 'hover'] = await measure(el);
      await p.mouse.move(1400, 880);
      await p.keyboard.press('Tab');
      await el.focus();
      await p.waitForTimeout(350);
      states[prefix + 'focus'] = await measure(el);
      const r = await el.boundingBox();
      await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(350);
      states[prefix + 'active'] = await measure(el);
      await p.mouse.up();
    }
    const differences = [];
    for (const [key, actual] of Object.entries(states)) {
      const expected = story.states[key];
      if (actual.pressed !== expected.pressed)
        differences.push({
          state: key,
          property: 'aria-pressed',
          expected: expected.pressed,
          actual: actual.pressed,
        });
      for (const property of properties) {
        if (property === 'fontFamily') continue;
        if (
          property.startsWith('outline') &&
          property !== 'outlineStyle' &&
          actual.values.outlineStyle === 'none' &&
          expected.values.outlineStyle === 'none'
        )
          continue;
        if (actual.values[property] !== expected.values[property])
          differences.push({
            state: key,
            property,
            expected: expected.values[property],
            actual: actual.values[property],
          });
      }
    }
    results.push({ id: story.id, states, differences });
    console.log(story.id + ': ' + differences.length);
  }
} finally {
  await b.close();
  await fs.writeFile(
    '.artifacts/toggle-state-comparison.json',
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        exceptions:
          'Licensed Cinzel font substitution; original glyph; text width/font family excluded.',
        results,
      },
      null,
      2,
    ),
  );
}
if (results.length !== reference.results.length || results.some((r) => r.differences.length))
  throw new Error(
    'Toggle story state comparison failed; inspect .artifacts/toggle-state-comparison.json',
  );
