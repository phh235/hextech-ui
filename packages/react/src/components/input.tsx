'use client';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import type { ControlSize } from '@/lib/button-variants';
export interface InputProps extends Omit<InputPrimitive.Props, 'size' | 'className'> {
  size?: ControlSize;
  className?: string;
}
export function inputVariants(size: ControlSize = 'medium', className?: string): string {
  return cn(
    'hx-input flex w-full min-w-0 rounded-none border border-transparent px-3 py-0 font-hx-sans text-hx-xs font-hx-normal leading-4 tracking-[0.025em] placeholder:text-[var(--hextech-ui-input-placeholder)] disabled:cursor-not-allowed',
    {
      'min-h-8': size === 'small',
      'min-h-9': size === 'medium',
      'min-h-10': size === 'large',
    },
    className,
  );
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, ...props },
  ref,
) {
  return <InputPrimitive ref={ref} {...props} className={inputVariants(size, className)} />;
});
