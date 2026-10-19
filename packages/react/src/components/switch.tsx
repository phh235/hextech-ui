'use client';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useKeyboardPress } from '@/lib/keyboard-press';
/** The track owns its children; place visible text in an external label. */
export interface SwitchProps extends Omit<SwitchPrimitive.Root.Props, 'className' | 'children'> {
  className?: string;
}
export const Switch = forwardRef<HTMLSpanElement, SwitchProps>(function Switch(
  { className, ...props },
  ref,
) {
  const press = useKeyboardPress(props.disabled || props.readOnly);
  return (
    <span className="inline-flex px-1.5 py-1">
      <SwitchPrimitive.Root
        ref={ref}
        {...props}
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
        className={cn(
          'hx-switch relative inline-flex h-6 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          className,
        )}
      >
        <SwitchPrimitive.Thumb className="hx-switch-thumb absolute -top-1.5 size-8 rounded-full border-2 border-transparent" />
      </SwitchPrimitive.Root>
    </span>
  );
});
