import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
const reference = JSON.parse(
  await fs.readFile('tests/fixtures/references/storybook-input-reference.json', 'utf8'),
);
const properties = Object.keys(reference.results[0].states.default.values);
const browser = await chromium.launch();
const results = [];
const measure = (el) =>
  el.evaluate((el, ps) => {
    const s = getComputedStyle(el),
      p = getComputedStyle(el, '::placeholder');
    return {
      value: el.value,
      disabled: el.disabled,
      readOnly: el.readOnly,
      focused: el.matches(':focus'),
      values: Object.fromEntries(ps.map((k) => [k, s[k]])),
      placeholder: {
        color: p.color,
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        opacity: p.opacity,
      },
    };
  }, properties);
try {
  for (const story of reference.results) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:3000/internal/components/input');
    await page.locator('[data-preview-ready=true]').waitFor();
    const state = page.getByRole('combobox', { name: 'Example', exact: true });
    const size = ['Small', 'Large'].includes(story.label);
    if (story.label !== 'Default')
      await state.selectOption({ label: size ? 'Sizes' : story.label });
    await page.locator('.preview-viewport').evaluate((el) => {
      el.style.width = '384px';
      el.style.maxWidth = '384px';
    });
    await page.evaluate(() => document.fonts.ready);
    const input = size
      ? page.getByRole('textbox', { name: story.label + ' input', exact: true })
      : page.locator('.preview-viewport .hx-input').first();
    await input.scrollIntoViewIfNeeded();
    const label = story.labelInfo
      ? await page.locator('.preview-viewport label').evaluate((el) => {
          const s = getComputedStyle(el);
          return Object.fromEntries(
            ['color', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].map((key) => [
              key,
              s[key],
            ]),
          );
        })
      : null;
    const states = { default: await measure(input) };
    await input.screenshot({
      path: `.artifacts/screenshots/input-local-${story.label.toLowerCase().replaceAll(' ', '-')}.png`,
    });
    await input.hover();
    states.hover = await measure(input);
    if (!states.default.disabled) {
      await page.keyboard.press('Tab');
      await input.focus();
      await input.evaluate((el) => el.setSelectionRange(el.value.length, el.value.length));
      states.focus = await measure(input);
      await input.screenshot({
        path: `.artifacts/screenshots/input-local-${story.label.toLowerCase().replaceAll(' ', '-')}-focus.png`,
      });
      await input.fill('');
      states.emptyFocus = await measure(input);
      await input.evaluate((el) => el.blur());
      await page.waitForTimeout(30);
      states.empty = await measure(input);
      await input.fill('The quick brown fox');
      await input.evaluate((el) => el.blur());
      await page.waitForTimeout(30);
      states.edited = await measure(input);
      await input.evaluate((el) => (el.readOnly = true));
      await input.focus();
      states.readonlyFocus = await measure(input);
    }
    const differences = [];
    if (label)
      for (const [property, actual] of Object.entries(label))
        if (actual !== story.labelInfo[property])
          differences.push({
            state: 'label',
            property,
            expected: story.labelInfo[property],
            actual,
          });
    for (const [key, actual] of Object.entries(states)) {
      const expected = story.states[key];
      for (const k of ['value', 'disabled', 'readOnly', 'focused'])
        if (actual[k] !== expected[k])
          differences.push({ state: key, property: k, expected: expected[k], actual: actual[k] });
      for (const k of properties) {
        if (['fontFamily', 'fontWeight'].includes(k)) continue;
        if (
          k.startsWith('outline') &&
          k !== 'outlineStyle' &&
          expected.values.outlineStyle === 'none' &&
          actual.values.outlineStyle === 'none'
        )
          continue;
        if (actual.values[k] !== expected.values[k])
          differences.push({
            state: key,
            property: k,
            expected: expected.values[k],
            actual: actual.values[k],
          });
      }
    }
    results.push({ label: story.label, labelStyles: label, states, differences });
    console.log(story.label + ': ' + differences.length);
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/');
  await page.getByRole('textbox', { name: 'Profile name' }).fill('The quick brown fox');
  const home = page.getByRole('textbox', { name: 'Profile name' });
  const homeFocus = await measure(home);
  if (homeFocus.values.outlineStyle !== 'none' || homeFocus.values.borderRadius !== '0px')
    throw Error('Homepage field still paints an extra focus outline');
  await home.screenshot({ path: '.artifacts/screenshots/input-home-after-focus.png' });
  await page.close();
} finally {
  await browser.close();
  await fs.writeFile(
    '.artifacts/input-state-comparison.json',
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        reference: 'tests/fixtures/references/storybook-input-reference.json',
        containingBlockWidth: 384,
        exceptions: [
          'Licensed Barlow Regular 400 replaces Spiegel; the reference declares CSS 500 but loads the 400 font face. Font family/weight and resulting glyph pixels differ.',
          'Placeholder #7a7a7a is retained instead of reference #757575.',
        ],
        results,
      },
      null,
      2,
    ),
  );
}
if (results.length !== reference.results.length || results.some((r) => r.differences.length))
  throw Error('Input state comparison failed; inspect .artifacts/input-state-comparison.json');
