import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  tone?: 'gold' | 'teal' | 'success' | 'warning' | 'destructive' | 'neutral';
}
export function Badge({ tone = 'gold', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1 border px-2 py-0.5 font-hx-mono text-hx-xs font-hx-medium',
        {
          'border-hx-primary/40 bg-hx-primary/10 text-hx-primary': tone === 'gold',
          'border-hx-accent/40 bg-hx-accent/10 text-hx-accent': tone === 'teal',
          'border-hx-success/40 text-hx-success': tone === 'success',
          'border-hx-warning/40 text-hx-warning': tone === 'warning',
          'border-hx-destructive/40 text-hx-destructive': tone === 'destructive',
          'border-hx-border bg-hx-muted text-hx-muted-foreground': tone === 'neutral',
        },
        className,
      )}
    />
  );
}
