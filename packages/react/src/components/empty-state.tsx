import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export function EmptyState({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-hextech-ui="empty-state"
      className={cn(
        'grid justify-items-center gap-4 border border-dashed border-border bg-card px-6 py-10 text-center font-sans text-card-foreground',
        className,
      )}
    />
  );
}

export function EmptyStateTitle({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p {...props} className={cn('font-serif text-lg font-semibold text-primary', className)} />
  );
}

export function EmptyStateDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p
      {...props}
      className={cn('max-w-sm text-sm leading-relaxed text-muted-foreground', className)}
    />
  );
}

export function EmptyStateActions({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('flex flex-wrap justify-center gap-3', className)} />;
}
