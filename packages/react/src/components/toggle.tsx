'use client';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cn } from '@/lib/cn';
import { buttonVariants, type ButtonStyleOptions } from '@/lib/button-variants';
export interface ToggleProps extends Omit<TogglePrimitive.Props, 'className'>, ButtonStyleOptions {}
export function Toggle({ className, variant, size, shape, thin, ...props }: ToggleProps) {
  return (
    <TogglePrimitive
      {...props}
      className={cn(
        buttonVariants({
          ...(variant && { variant }),
          ...(size && { size }),
          ...(shape && { shape }),
          ...(thin !== undefined && { thin }),
        }),
        className,
      )}
    />
  );
}
export function ToggleGroup({
  className,
  ...props
}: Omit<ToggleGroupPrimitive.Props, 'className'> & { className?: string }) {
  return (
    <ToggleGroupPrimitive
      {...props}
      className={cn('hx-toggle-group inline-flex data-[orientation=vertical]:flex-col', className)}
    />
  );
}
export { Toggle as ToggleButton, ToggleGroup as ToggleButtonGroup };
