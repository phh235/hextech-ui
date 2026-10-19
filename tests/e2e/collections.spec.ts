// Rich behavioral states use internal fixtures; catalog/composition suites verify public demos and copied source.
import { selectExample } from './select-example';
import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('tree supports roving focus, expansion, selection, typeahead and disabled rows', async ({
  page,
}) => {
  await openPage(page, '/internal/components/tree');
  const tree = page.getByRole('tree', { name: 'Build library' });
  const builds = tree.getByRole('treeitem', { name: 'Builds', exact: true });
  const frontline = tree.getByRole('treeitem', { name: 'Frontline', exact: true });
  await builds.focus();
  await page.keyboard.press('ArrowDown');
  await expect(frontline).toBeFocused();
  await expect(frontline).toHaveAttribute('tabindex', '0');
  await page.keyboard.press('Space');
  await expect(frontline).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(builds).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(frontline).toBeHidden();
  await page.keyboard.press('p');
  await expect(tree.getByRole('treeitem', { name: 'Practice', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(tree.getByRole('treeitem', { name: 'Timing drills', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  const archive = tree.getByRole('treeitem', { name: 'Archive', exact: true });
  await expect(archive).toBeFocused();
  await page.keyboard.press('Space');
  await expect(archive).toHaveAttribute('aria-selected', 'false');
  await expect(archive).toHaveAttribute('aria-disabled', 'true');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});

test('tree reorders by keyboard and preserves moved-node focus', async ({ page }) => {
  await openPage(page, '/internal/components/tree');
  const tree = page.getByRole('tree', { name: 'Build library' });
  const frontline = tree.getByRole('treeitem', { name: 'Frontline', exact: true });
  await frontline.focus();
  await page.keyboard.press('Alt+ArrowDown');
  await expect(frontline).toBeFocused();
  const children = tree
    .getByRole('treeitem', { name: 'Builds', exact: true })
    .getByRole('group')
    .getByRole('treeitem');
  await expect(children).toHaveText([/Support/, /Frontline/]);
  await page.keyboard.press('Alt+ArrowUp');
  await expect(children).toHaveText([/Frontline/, /Support/]);
  await tree.getByRole('button', { name: 'Move Frontline down', exact: true }).click();
  await expect(children).toHaveText([/Support/, /Frontline/]);
  await expect(frontline).toBeFocused();
});

test('tag collection removes selected tags and restores focus to a surviving control', async ({
  page,
}) => {
  await openPage(page, '/internal/components/tag-group');
  const tags = page.getByRole('toolbar', { name: 'Build tags' });
  const ranked = tags.getByRole('button', { name: 'Ranked', exact: true });
  await ranked.focus();
  await page.keyboard.press('Space');
  await expect(ranked).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(tags.getByRole('button', { name: 'Remove Ranked', exact: true })).toBeFocused();
  await page.keyboard.press('Delete');
  await expect(ranked).toHaveCount(0);
  const support = tags.getByRole('button', { name: 'Support', exact: true });
  await expect(support).toBeFocused();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await expect(tags.getByRole('button')).toHaveCount(0);
  await expect(tags).toBeFocused();
  await page.getByRole('button', { name: 'Restore tags' }).click();
  await expect(tags.getByRole('button')).toHaveCount(6);
  await expect(tags.getByRole('button', { pressed: true })).toHaveCount(0);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});

test('external tree moves retain focus on a visible ancestor and respect outside controls', async ({
  page,
}) => {
  await openPage(page, '/internal/components/tree');
  const tree = page.getByRole('tree', { name: 'Build library' });
  await tree.getByRole('treeitem', { name: 'Frontline', exact: true }).focus();
  // A native click dispatches the owner's data update without moving focus first.
  await page
    .getByRole('button', { name: 'Move Frontline into Practice', exact: true })
    .evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tree.getByRole('treeitem', { name: 'Practice', exact: true })).toBeFocused();
  const reset = page.getByRole('button', { name: 'Reset library', exact: true });
  await page.keyboard.press('ArrowRight');
  await tree.getByRole('treeitem', { name: 'Frontline', exact: true }).focus();
  await reset.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tree.getByRole('treeitem', { name: 'Frontline', exact: true })).toBeFocused();
  await reset.click();
  await expect(reset).toBeFocused();
});

test('tree refreshes reconcile removed selection, hidden focus and an empty collection', async ({
  page,
}) => {
  await openPage(page, '/internal/components/tree');
  await selectExample(page, { label: 'Dynamic data' });
  const tree = page.getByRole('tree', { name: 'Dynamic build library' });
  const draft = tree.getByRole('treeitem', { name: 'Draft plan', exact: true });
  await draft.focus();
  await page
    .getByRole('button', { name: 'Remove draft', exact: true })
    .evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tree.getByRole('treeitem', { name: 'Review plan', exact: true })).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Selected IDs:' })).toHaveText(
    'Selected IDs: none',
  );
  const restore = page.getByRole('button', { name: 'Restore tree', exact: true });
  await restore.click();
  await expect(restore).toBeFocused();
  await expect(draft).toHaveAttribute('aria-selected', 'false');
  await draft.focus();
  await page.keyboard.press('Space');
  await page
    .getByRole('button', { name: 'Hide branch', exact: true })
    .evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tree.getByRole('treeitem', { name: 'Workspace', exact: true })).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Selected IDs:' })).toHaveText(
    'Selected IDs: draft',
  );
  await page
    .getByRole('button', { name: 'Clear tree', exact: true })
    .evaluate((button) => (button as HTMLButtonElement).click());
  const empty = page.getByRole('group', { name: 'Dynamic build library', exact: true });
  await expect(empty).toBeFocused();
  await expect(empty).toHaveCSS('outline-width', '2px');
  await expect(empty).toHaveCSS('outline-style', 'solid');
  await expect(empty).toHaveAttribute('data-hextech-collection-focus', '');
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/tree-empty-focus-${test.info().project.name}.png`,
  });
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await restore.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tree.getByRole('treeitem', { name: 'Workspace', exact: true })).toBeFocused();
  await restore.click();
  await expect(restore).toBeFocused();
  await expect(tree.getByRole('treeitem', { name: 'Workspace', exact: true })).not.toHaveAttribute(
    'data-hextech-collection-focus',
    '',
  );
});

test('controlled tag selection changes only after the owner removes records', async ({ page }) => {
  await openPage(page, '/internal/components/tag-group');
  await selectExample(page, { label: 'Dynamic data' });
  const tags = page.getByRole('toolbar', { name: 'Controlled build tags' });
  const ranked = tags.getByRole('button', { name: 'Ranked', exact: true });
  const keep = page.getByRole('checkbox', { name: 'Preserve tags on removal' });
  await keep.check();
  await tags.getByRole('button', { name: 'Remove Ranked', exact: true }).click();
  await expect(ranked).toHaveAttribute('aria-pressed', 'true');
  await keep.uncheck();
  await tags.getByRole('button', { name: 'Remove Ranked', exact: true }).click();
  await expect(ranked).toHaveCount(0);
  await expect(tags.getByRole('button', { name: 'Support', exact: true })).toBeFocused();
  await expect(tags.getByRole('button', { name: 'Support', exact: true })).toHaveCSS(
    'outline-style',
    'solid',
  );
  await expect(page.getByRole('status').filter({ hasText: 'Selected IDs:' })).toHaveText(
    'Selected IDs: support',
  );
  await page.getByRole('button', { name: 'Restore tags', exact: true }).click();
  await expect(tags.getByRole('button', { name: 'Support', exact: true })).not.toHaveAttribute(
    'data-hextech-collection-focus',
    '',
  );
  await expect(ranked).toHaveAttribute('aria-pressed', 'false');
  await expect(tags.getByRole('button', { name: 'Support', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.locator('.preview-viewport').screenshot({
    path: `.artifacts/screenshots/tags-controlled-restored-${test.info().project.name}.png`,
  });
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});

test('deferred tag removal preserves focus after the user leaves the collection', async ({
  page,
}) => {
  await openPage(page, '/internal/components/tag-group');
  await selectExample(page, { label: 'Dynamic data' });
  const tags = page.getByRole('toolbar', { name: 'Controlled build tags' });
  await page.getByRole('checkbox', { name: 'Queue removal' }).check();
  await tags.getByRole('button', { name: 'Remove Ranked', exact: true }).click();
  await expect(tags.getByRole('button', { name: 'Ranked', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const outside = page.getByRole('checkbox', { name: 'Preserve tags on removal' });
  await outside.focus();
  await page
    .getByRole('button', { name: 'Complete removal', exact: true })
    .evaluate((button) => (button as HTMLButtonElement).click());
  await expect(tags.getByRole('button', { name: 'Ranked', exact: true })).toHaveCount(0);
  await expect(outside).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Selected IDs:' })).toHaveText(
    'Selected IDs: support',
  );
});
