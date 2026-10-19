import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface AlertProps extends ComponentPropsWithRef<'div'> {
  tone?: 'default' | 'info' | 'success' | 'warning' | 'destructive';
}

/** Static notices stay silent. Set role="alert" explicitly for urgent dynamic errors. */
export function Alert({ tone = 'default', className, ...props }: AlertProps) {
  return (
    <div
      {...props}
      data-hextech-ui="alert"
      data-tone={tone}
      className={cn(
        'grid gap-2 border border-hx-border bg-hx-card p-4 font-hx-sans text-hx-sm text-hx-card-foreground',
        {
          'border-hx-primary/60': tone === 'default' || tone === 'warning',
          'border-hx-accent/60': tone === 'info' || tone === 'success',
          'border-hx-destructive/60': tone === 'destructive',
        },
        className,
      )}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return <p {...props} className={cn('font-hx-semibold leading-hx-normal', className)} />;
}

export function AlertDescription({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('text-hx-sm leading-relaxed text-hx-muted-foreground', className)}
    />
  );
}
