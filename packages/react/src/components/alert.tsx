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
        'grid gap-2 border border-border bg-card p-4 font-sans text-sm text-card-foreground',
        {
          'border-primary/60': tone === 'default' || tone === 'warning',
          'border-accent/60': tone === 'info' || tone === 'success',
          'border-destructive/60': tone === 'destructive',
        },
        className,
      )}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return <p {...props} className={cn('font-semibold leading-normal', className)} />;
}

export function AlertDescription({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} className={cn('text-sm leading-relaxed text-muted-foreground', className)} />
  );
}
