import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends ComponentPropsWithRef<'div'> {
  animated?: boolean;
}

/** Decorative placeholder; announce loading on the surrounding content region. */
export function Skeleton({ animated = true, className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        'min-h-4 border border-hx-border bg-hx-muted',
        animated && 'motion-safe:animate-pulse',
        className,
      )}
    />
  );
}
