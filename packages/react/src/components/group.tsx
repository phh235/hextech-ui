'use client';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Input, type InputProps } from './input';
export function Group({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      role="group"
      {...props}
      className={cn(
        'hx-group flex min-h-9 min-w-0 items-stretch border border-transparent',
        className,
      )}
    />
  );
}
export function GroupInput({ className, ...props }: InputProps) {
  return (
    <Input
      {...props}
      className={cn('min-h-0 flex-1 border-0 focus-visible:outline-none', className)}
    />
  );
}
export function GroupSeparator({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn(
        'flex shrink-0 items-center px-2 font-sans text-xs font-bold text-primary',
        className,
      )}
    />
  );
}
