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
        'inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-xs font-medium',
        {
          'border-primary/40 bg-primary/10 text-primary': tone === 'gold',
          'border-accent/40 bg-accent/10 text-accent': tone === 'teal',
          'border-success/40 text-success': tone === 'success',
          'border-warning/40 text-warning': tone === 'warning',
          'border-destructive/40 text-destructive': tone === 'destructive',
          'border-border bg-muted text-muted-foreground': tone === 'neutral',
        },
        className,
      )}
    />
  );
}
