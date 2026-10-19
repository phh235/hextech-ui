'use client';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cn } from '@/lib/cn';
import { useKeyboardPress } from '@/lib/keyboard-press';
export interface RadioGroupProps extends Omit<RadioGroupPrimitive.Props, 'className'> {
  className?: string;
}
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadioGroupPrimitive {...props} className={cn('flex flex-col items-start', className)} />;
}
/** The indicator owns its children; place visible text in an external label. */
export interface RadioProps extends Omit<RadioPrimitive.Root.Props, 'className' | 'children'> {
  className?: string;
}
export function Radio({ className, ...props }: RadioProps) {
  const press = useKeyboardPress(props.disabled || props.readOnly);
  return (
    <RadioPrimitive.Root
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
        'hx-radio relative inline-flex size-[18px] shrink-0 cursor-pointer items-center justify-center',
        className,
      )}
    >
      <RadioPrimitive.Indicator className="hx-radio-dot relative size-[7px] rotate-45" />
    </RadioPrimitive.Root>
  );
}
