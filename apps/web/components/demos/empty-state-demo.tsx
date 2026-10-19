'use client';

import { EmptyState, EmptyStateTitle, EmptyStateDescription } from '@hextech-ui/react/empty-state';

export function EmptyStateDemo() {
  return (
    <>
      <EmptyState className="w-full max-w-sm">
        <EmptyStateTitle>No saved builds</EmptyStateTitle>
        <EmptyStateDescription>Your saved builds will appear here.</EmptyStateDescription>
      </EmptyState>
    </>
  );
}
