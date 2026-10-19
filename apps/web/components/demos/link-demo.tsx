'use client';

import { Link, ButtonLink } from '@hextech-ui/react/link';

export function LinkDemo() {
  return (
    <>
      <Link href="/docs">Documentation</Link>
      <ButtonLink href="/docs/theming">Explore tokens</ButtonLink>
    </>
  );
}
