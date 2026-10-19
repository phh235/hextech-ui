// Rich behavioral states use internal fixtures; catalog/composition suites verify public demos and copied source.
import { selectExample } from './select-example';
import { test, expect } from '@playwright/test';
import { openPage } from './navigation';

test('switch thumb follows pointer and keyboard checked state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/internal/components/switch');
  const control = page.getByRole('switch').first();
  await control.setChecked(true);
  const offset = () =>
    control.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const t = el.querySelector('.hx-switch-thumb')!.getBoundingClientRect();
      return t.x + t.width / 2 - (r.x + r.width / 2);
    });
  await expect(control).toBeChecked();
  await expect.poll(offset).toBeGreaterThan(0);
  await control.click();
  await expect(control).not.toBeChecked();
  await expect.poll(offset).toBeLessThan(0);
  await control.press('Space');
  await expect(control).toBeChecked();
  await expect.poll(offset).toBeGreaterThan(0);
});

test('selected dimmed toggle keeps its measured blue text when hovered and held', async ({
  page,
}) => {
  await openPage(page, '/internal/components/toggle');
  await selectExample(page, { label: 'Storybook · Dimmed Selected' });
  const toggle = page.locator('[data-reference-story="buttons-togglebutton--dimmed-selected"]');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.hover();
  await expect(toggle).toHaveCSS('color', 'rgb(205, 250, 250)');
  const rect = await toggle.boundingBox();
  if (!rect) throw new Error('Selected toggle is missing');
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  try {
    await expect(toggle).toHaveCSS('color', 'rgb(205, 250, 250)');
    await expect(toggle).toHaveCSS('transform', 'none');
  } finally {
    await page.mouse.up();
  }
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('spinner uses the reference size, teal fade and one-second rotation', async ({ page }) => {
  await openPage(page, '/internal/components/spinner');
  const spinner = page.getByRole('status', { name: '' }).filter({ hasText: 'Loading' });
  await expect(spinner).toHaveCSS('width', '48px');
  await expect(spinner).toHaveCSS('height', '48px');
  await expect(spinner).toHaveCSS('animation-duration', '1s');
  await expect(spinner).toHaveCSS('animation-timing-function', 'linear');
  const graphic = await spinner.evaluate((node) => {
    const style = getComputedStyle(node, '::before');
    return { background: style.backgroundImage, mask: style.maskImage };
  });
  expect(graphic.background).toContain('conic-gradient');
  expect(graphic.background).toContain('rgb(0, 191, 195)');
  expect(graphic.mask).toContain('radial-gradient');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(spinner).toHaveCSS('animation-name', 'none');
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/fidelity-spinner-${test.info().project.name}.png`,
  });
});

test('input uses the measured Storybook geometry and gradient focus states', async ({ page }) => {
  await openPage(page, '/internal/components/input');
  const input = page.getByRole('textbox', { name: 'Text input', exact: true });
  await expect(input).toHaveCSS('min-height', '36px');
  await expect(input).toHaveCSS('font-size', '12px');
  await expect(input).toHaveCSS('line-height', '16px');
  await expect(input).toHaveCSS('font-weight', '400');
  await expect(input).toHaveCSS('padding', '0px 12px');
  await expect(input).toHaveCSS('border-radius', '0px');
  await expect(input).toHaveCSS('border-top-width', '1px');
  await expect(input).toHaveCSS('box-shadow', 'none');
  await expect(input).toHaveCSS('outline-style', 'none');
  await expect(input).toHaveCSS('color', 'rgb(240, 230, 210)');
  await expect(input).toHaveCSS('background-image', /rgb\(1, 10, 19\).*rgb\(120, 90, 40\)/);
  await input.fill('The quick brown fox jumps over the lazy dog.');
  await expect(input).toHaveCSS('background-image', /rgb\(60, 60, 65\).*rgb\(240, 230, 210\)/);
  await expect(input).toHaveCSS('outline-style', 'none');
  await expect(input).toHaveCSS('box-shadow', 'none');
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/input-reference-focus-${test.info().project.name}.png`,
  });
  await selectExample(page, '1');
  await expect(input).toBeDisabled();
  await expect(input).toHaveCSS('color', 'rgb(91, 90, 86)');
  await selectExample(page, { label: 'Sizes' });
  await expect(page.getByRole('textbox', { name: 'Small input', exact: true })).toHaveCSS(
    'min-height',
    '32px',
  );
  await expect(page.getByRole('textbox', { name: 'Medium input', exact: true })).toHaveCSS(
    'min-height',
    '36px',
  );
  await expect(page.getByRole('textbox', { name: 'Large input', exact: true })).toHaveCSS(
    'min-height',
    '40px',
  );
});

test('pressing a button does not translate its position', async ({ page, isMobile }) => {
  await openPage(page, '/internal/components/button');
  const button = page.getByRole('button', { name: /^Queue up/ });
  if (!isMobile) {
    const resting = await button.boundingBox();
    if (!resting) throw new Error('Visible button has no geometry');
    await page.mouse.move(resting.x + resting.width / 2, resting.y + resting.height / 2);
    await page.mouse.down();
    try {
      expect(await button.evaluate((element) => element.matches(':active'))).toBe(true);
      await expect(button).toHaveCSS('transform', 'none');
      const pressed = await button.boundingBox();
      expect(pressed?.x).toBe(resting.x);
      expect(pressed?.y).toBe(resting.y);
    } finally {
      await page.mouse.up();
    }
  }
  await button.focus();
  const before = await button.boundingBox();
  await page.keyboard.down('Space');
  try {
    await expect(button).toHaveCSS('transform', 'none');
    const pressed = await button.boundingBox();
    expect(pressed?.x).toBe(before?.x);
    expect(pressed?.y).toBe(before?.y);
  } finally {
    await page.keyboard.up('Space');
  }
});
test('documentation tables and lists do not restyle live calendar and tree geometry', async ({
  page,
}) => {
  await openPage(page, '/internal/components/calendar');
  const calendar = page.getByRole('group', { name: 'Session date', exact: true });
  const day = calendar.getByRole('gridcell').first();
  await expect(day).toHaveCSS('border-bottom-width', '0px');
  await expect(day).toHaveCSS('text-align', 'center');
  await openPage(page, '/internal/components/tree');
  await expect(page.getByRole('treeitem', { name: 'Frontline', exact: true })).toHaveCSS(
    'margin-top',
    '0px',
  );
});
test('focus, hover, disabled and reduced-motion effects have visible distinct states', async ({
  page,
}) => {
  await openPage(page, '/internal/components/button');
  const button = page.getByRole('button', { name: 'Queue up', exact: true });
  await button.hover();
  await expect(button).toHaveCSS('box-shadow', 'none');
  await page.keyboard.press('Tab');
  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-width', '1px');
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/button-focus-${test.info().project.name}.png`,
    animations: 'disabled',
  });
  await selectExample(page, '1');
  await expect(button).toBeDisabled();
  await expect(button).toHaveCSS('opacity', '1');
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/button-disabled-${test.info().project.name}.png`,
    animations: 'disabled',
  });
  await openPage(page, '/internal/components/card');
  const frame = page.locator('.preview-viewport .hx-frame');
  await frame.evaluate((node) => node.setAttribute('data-animated', 'true'));
  expect(await frame.evaluate((node) => getComputedStyle(node, '::before').animationName)).toBe(
    'hx-frame-glint',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await frame.evaluate((node) => getComputedStyle(node, '::before').animationName)).toBe(
    'none',
  );
});
