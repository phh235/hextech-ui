import { openPage } from './navigation';
import { test, expect } from '@playwright/test';
test('local list updates and filters without losing its canonical data', async ({ page }) => {
  await openPage(page, '/docs/components/use-list-data');
  const demo = page.getByRole('region', { name: 'Local list demo' });
  await demo.getByRole('button', { name: 'Add Sage' }).click();
  await demo.getByRole('searchbox').fill('Sage');
  await expect(demo.getByRole('listitem')).toHaveCount(1);
  await demo.getByRole('button', { name: 'Remove Sage' }).click();
  await expect(demo.getByRole('listitem')).toHaveCount(0);
  await demo.getByRole('searchbox').fill('');
  await expect(demo.getByRole('listitem')).toHaveCount(2);
});
test('async list appends pages, ignores stale completion and recovers after errors', async ({
  page,
}) => {
  await page.clock.install();
  await openPage(page, '/docs/components/use-async-list');
  const demo = page.getByRole('region', { name: 'Async list demo' });
  await expect(demo.getByRole('listitem')).toHaveCount(2);
  await demo.getByRole('button', { name: 'Load more names' }).click();
  await expect(demo.getByRole('listitem')).toHaveCount(4);
  const search = demo.getByRole('searchbox');
  await page.clock.pauseAt(new Date(Date.now() + 60_000));

  await search.fill('slow');
  await page.clock.runFor(300);
  await expect(demo.getByRole('status')).toContainText('Loading');
  // Clearing bypasses debounce, so the fast request finishes before the aborted slow one.
  await demo.getByRole('button', { name: 'Clear Filter async names', exact: true }).click();
  await page.clock.runFor(100);
  await expect(demo.getByRole('listitem')).toHaveText(['Avery', 'Rowan']);
  await page.clock.runFor(500);
  await expect(demo.getByRole('listitem')).toHaveText(['Avery', 'Rowan']);

  await search.fill('Avery');
  await page.clock.runFor(300);
  await expect(demo.getByRole('status')).toContainText('Loading');
  await page.clock.runFor(100);
  await expect(demo.getByRole('listitem')).toHaveText(['Avery']);
  await search.fill('error');
  await page.clock.runFor(300);
  await expect(demo.getByRole('status')).toContainText('Loading');
  await page.clock.runFor(100);
  await expect(demo.getByRole('alert')).toContainText('Demo load failed');
  await search.fill('Rowan');
  await page.clock.runFor(300);
  await expect(demo.getByRole('status')).toContainText('Loading');
  await page.clock.runFor(100);
  await expect(demo.getByRole('listitem')).toHaveText(['Rowan']);
  await expect(demo.getByRole('alert')).toHaveCount(0);
});
