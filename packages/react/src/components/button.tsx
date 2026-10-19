'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { forwardRef } from 'react';
import { useKeyboardPress } from '@/lib/keyboard-press';
import { buttonVariants, type ButtonStyleOptions } from '@/lib/button-variants';

export interface ButtonProps extends Omit<ButtonPrimitive.Props, 'className'>, ButtonStyleOptions {
  /** Disables repeated activation and announces pending work. */
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, shape, thin, className, loading = false, disabled, children, ...props },
  ref,
) {
  const press = useKeyboardPress(disabled || loading);
  return (
    <ButtonPrimitive
      ref={ref}
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-hextech-ui="button"
      data-keyboard-pressed={press.pressed || undefined}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        press.keyDown(event);
      }}
      onKeyUp={(event) => {
        press.release();
        props.onKeyUp?.(event);
      }}
      onBlur={(event) => {
        press.release();
        props.onBlur?.(event);
      }}
      className={buttonVariants({
        ...(variant && { variant }),
        ...(size && { size }),
        ...(shape && { shape }),
        ...(thin !== undefined && { thin }),
        ...(className && { className }),
      })}
    >
      {loading && <span aria-hidden="true" className="hx-spinner size-4" />}
      {children}
    </ButtonPrimitive>
  );
});
export { buttonVariants } from '@/lib/button-variants';
export type { ButtonVariant, ButtonStyleOptions, ControlSize } from '@/lib/button-variants';
