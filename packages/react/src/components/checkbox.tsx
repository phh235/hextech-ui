'use client';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
export interface CheckboxProps extends Omit<CheckboxPrimitive.Root.Props, 'className'> {
  className?: string;
}
export const Checkbox = forwardRef<HTMLSpanElement, CheckboxProps>(function Checkbox(
  { className, children, ...props },
  ref,
) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      {...props}
      className={cn(
        'hx-checkbox relative inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center border border-transparent',
        className,
      )}
    >
      <CheckboxPrimitive.Indicator className="flex size-full items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {props.indeterminate ? <path d="M4 10h12" /> : <path d="m4 10 4 4 8-9" />}
        </svg>
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  );
});
