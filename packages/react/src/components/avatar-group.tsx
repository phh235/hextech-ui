import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface AvatarGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'aria-label'> {
  label: string;
}
export function AvatarGroup({ label, className, ...props }: AvatarGroupProps) {
  return (
    <div
      role="group"
      {...props}
      aria-label={label}
      className={cn('hx-avatar-group flex items-center', className)}
    />
  );
}
export function AvatarGroupCount({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      role={props['aria-label'] ? 'img' : undefined}
      {...props}
      className={cn(
        'relative inline-flex size-12 shrink-0 items-center justify-center border border-hx-primary/60 bg-hx-surface font-hx-sans text-hx-sm text-hx-primary',
        className,
      )}
    />
  );
}
