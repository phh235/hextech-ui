'use client';
import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import { cn } from '@/lib/cn';
import { useKeyboardPress } from '@/lib/keyboard-press';
export const Collapsible = Primitive.Root;
export function CollapsibleTrigger({
  className,
  ...props
}: Omit<Primitive.Trigger.Props, 'className'> & { className?: string }) {
  const press = useKeyboardPress(props.disabled);
  return (
    <Primitive.Trigger
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
        'hx-disclosure-trigger flex w-full items-center py-2 text-left font-hx-display text-hx-base font-hx-bold uppercase leading-[normal]',
        className,
      )}
    />
  );
}
export function CollapsiblePanel({
  className,
  ...props
}: Omit<Primitive.Panel.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Panel
      {...props}
      className={cn(
        'hx-disclosure overflow-hidden py-3 text-hx-sm text-hx-muted-foreground',
        className,
      )}
    />
  );
}
export {
  Collapsible as Disclosure,
  CollapsibleTrigger as DisclosureButton,
  CollapsiblePanel as DisclosurePanel,
};
