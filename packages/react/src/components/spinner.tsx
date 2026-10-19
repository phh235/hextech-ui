import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  label?: string;
  size?: 'small' | 'medium' | 'large';
}
export function Spinner({ label = 'Loading', size = 'medium', className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      {...props}
      className={cn(
        'hx-spinner block aspect-square max-w-full shrink-0',
        {
          'size-6': size === 'small',
          'size-12': size === 'medium',
          'size-16': size === 'large',
        },
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
