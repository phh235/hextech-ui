import type { Page } from '@playwright/test';
import { openPage } from './navigation';

/** Variant controls belong to the internal harness, outside public documentation. */
export async function selectExample(page: Page, choice: string | { label: string }) {
  const component = new URL(page.url()).pathname.match(/^\/docs\/components\/([^/]+)$/)?.[1];
  if (component) await openPage(page, '/internal/components/' + component);
  await page.getByRole('combobox', { name: 'Example', exact: true }).selectOption(choice);
}
