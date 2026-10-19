'use client';
import { NumberField as Primitive } from '@base-ui/react/number-field';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { inputVariants } from './input';
import { Label } from './typography';
export interface NumberFieldProps extends Omit<Primitive.Root.Props, 'className'> {
  className?: string;
  label: string;
}
export function NumberField({ className, label, ...props }: NumberFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return (
    <Primitive.Root {...props} id={id} className={cn('grid w-40 max-w-full gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Primitive.Group className="hx-number-group grid min-h-9 grid-cols-[auto_1fr_auto] gap-px p-px">
        <Primitive.Decrement
          aria-label={`Decrease ${label}`}
          className="hx-number-button flex w-8 items-center justify-center"
        >
          <ControlIcon name="minus" />
        </Primitive.Decrement>
        <Primitive.Input
          id={id}
          className={cn(
            inputVariants(),
            'min-h-0 border-0 text-start tracking-normal outline-none',
          )}
        />
        <Primitive.Increment
          aria-label={`Increase ${label}`}
          className="hx-number-button flex w-8 items-center justify-center"
        >
          <ControlIcon name="plus" />
        </Primitive.Increment>
      </Primitive.Group>
    </Primitive.Root>
  );
}
