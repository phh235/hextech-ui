import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface ItemProps extends ComponentPropsWithRef<'div'> {
  variant?: 'default' | 'outline' | 'muted';
}
/** Semantic content row. Put actual links or buttons in its content/actions. */
export function Item({ variant = 'default', className, ...props }: ItemProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-4 p-4 font-hx-sans text-hx-foreground',
        { 'border border-hx-border': variant === 'outline', 'bg-hx-muted': variant === 'muted' },
        className,
      )}
    />
  );
}
export function ItemMedia({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('flex shrink-0 items-center justify-center', className)} />;
}
export function ItemContent({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-slot="item-content"
      className={cn(
        'grid min-w-[min(100%,calc(var(--hextech-ui-rem)*10))] flex-1 gap-1',
        className,
      )}
    />
  );
}
export function ItemTitle({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p
      {...props}
      className={cn('font-hx-display text-hx-sm font-hx-bold text-hx-primary', className)}
    />
  );
}
export function ItemDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p
      {...props}
      className={cn('text-hx-sm leading-relaxed text-hx-muted-foreground', className)}
    />
  );
}
export function ItemActions({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-slot="item-actions"
      className={cn('flex shrink-0 flex-wrap items-center gap-2', className)}
    />
  );
}
