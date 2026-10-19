'use client';

import { Skeleton } from '@hextech-ui/react/skeleton';

export function SkeletonDemo() {
  return (
    <>
      <div role="status" aria-label="Loading profile" className="grid w-full max-w-sm gap-3">
        <Skeleton className="size-12" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </>
  );
}
