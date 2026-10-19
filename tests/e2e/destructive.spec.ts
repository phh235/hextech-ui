import { test, expect, type Locator } from '@playwright/test';
import { openPage } from './navigation';
import { setMode } from './set-mode';
import { selectExample } from './select-example';

async function geometry(button: Locator) {
  return button.evaluate((element) => {
    const box = element.getBoundingClientRect(),
      parent = element.closest('.preview-viewport')!.getBoundingClientRect();
    return { x: box.x - parent.x, y: box.y - parent.y, width: box.width, height: box.height };
  });
}

async function paint(button: Locator) {
  return button.evaluate((element) => {
    const css = getComputedStyle(element);
    return {
      color: css.color,
      background: css.backgroundImage,
      outline: css.outlineStyle,
      outlineColor: css.outlineColor,
      outlineWidth: css.outlineWidth,
      outlineOffset: css.outlineOffset,
      transform: css.transform,
      shadow: css.boxShadow,
    };
  });
}

function contrast(a: string, b: string) {
  const luminance = (value: string) => {
    const rgb = value
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number);
    return rgb.reduce((sum, channel, index) => {
      const s = channel / 255;
      return (
        sum +
        (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index]!
      );
    }, 0);
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function readable(state: Awaited<ReturnType<typeof paint>>) {
  // The first background layer paints the fill; later layers paint the border.
  let depth = 0,
    end = state.background.length;
  for (let i = 0; i < state.background.length; i++) {
    if (state.background[i] === '(') depth++;
    if (state.background[i] === ')') depth--;
    if (state.background[i] === ',' && depth === 0) {
      end = i;
      break;
    }
  }
  const stops = state.background.slice(0, end).match(/rgba?\([^)]+\)/g)!;
  expect(stops.length).toBeGreaterThan(0);
  for (const stop of stops) expect(contrast(state.color, stop)).toBeGreaterThanOrEqual(4.5);
}

for (const mode of ['dark', 'light'] as const) {
  test(`${mode}: destructive has distinct hover, focus and held mouse/Space feedback`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, '/docs/components/button');
    await setMode(page, mode);
    const button = page.getByRole('button', { name: 'Delete', exact: true });
    const primary = page.getByRole('button', { name: 'Queue up', exact: true });
    await page.mouse.move(0, 0);
    const idle = await paint(button),
      box = await geometry(button);
    readable(idle);
    await button.hover();
    await expect(button).not.toHaveCSS('background-image', idle.background);
    await expect(button).not.toHaveCSS('color', idle.color);
    const hover = await paint(button);
    readable(hover);
    await page.mouse.down();
    let active;
    try {
      await expect(button).not.toHaveCSS('background-image', hover.background);
      active = await paint(button);
      expect(active.background).not.toBe(idle.background);
      readable(active);
      expect(await geometry(button)).toEqual(box);
    } finally {
      await page.mouse.up();
    }
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await primary.focus();
    const primaryFocus = await paint(primary);
    await button.focus();
    const focus = await paint(button);
    expect(focus.outline).toBe('solid');
    expect(focus.outlineWidth).toBe(primaryFocus.outlineWidth);
    expect(focus.outlineOffset).toBe(primaryFocus.outlineOffset);
    expect(focus.outlineColor).not.toBe(primaryFocus.outlineColor);
    const canvas = await page
      .locator('.preview-stage')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(contrast(focus.outlineColor, canvas)).toBeGreaterThanOrEqual(3);
    await page.keyboard.down('Space');
    try {
      await expect(button).toHaveCSS('background-image', active.background);
      await expect(button).toHaveCSS('color', active.color);
      await expect(button).toHaveCSS('transform', 'none');
      await expect(button).toHaveCSS('box-shadow', 'none');
    } finally {
      await page.keyboard.up('Space');
    }
    await expect(button).toHaveCSS('background-image', idle.background);
    expect(await geometry(button)).toEqual(box);
  });

  test(`${mode}: destructive disabled and loading ignore hover and activation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, '/docs/components/button');
    await setMode(page, mode);
    for (const [variant, name] of [
      ['Disabled', 'Delete'],
      ['Destructive loading', 'Deleting'],
    ] as const) {
      await selectExample(page, { label: variant });
      const button = page.getByRole('button', { name, exact: true });
      await expect(button).toBeDisabled();
      if (variant === 'Destructive loading')
        await expect(button).toHaveAttribute('aria-busy', 'true');
      await page.mouse.move(0, 0);
      const idle = await paint(button);
      await button.hover({ force: true });
      expect(await paint(button)).toEqual(idle);
      const clicks = await button.evaluate((element: HTMLButtonElement) => {
        let count = 0;
        element.addEventListener('click', () => count++);
        element.click();
        return count;
      });
      expect(clicks).toBe(0);
      await button.focus();
      await expect(button).not.toBeFocused();
    }
  });
}
