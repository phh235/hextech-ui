'use client';

import { Breadcrumbs, Breadcrumb } from '@hextech-ui/react/breadcrumbs';

export function BreadcrumbsDemo() {
  return (
    <>
      <Breadcrumbs>
        <Breadcrumb href="/docs">Docs</Breadcrumb>
        <Breadcrumb current>Current page</Breadcrumb>
      </Breadcrumbs>
    </>
  );
}
