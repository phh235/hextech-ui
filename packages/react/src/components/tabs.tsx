'use client';
import { Tabs as Primitive } from '@base-ui/react/tabs';
import { cn } from '@/lib/cn';
import { useKeyboardPress } from '@/lib/keyboard-press';
export const Tabs = Primitive.Root;
export function TabList({
  className,
  ...props
}: Omit<Primitive.List.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.List {...props} className={cn('hx-tabs-list -ml-4 flex flex-wrap', className)} />
  );
}
export function Tab({
  className,
  ...props
}: Omit<Primitive.Tab.Props, 'className'> & { className?: string }) {
  const press = useKeyboardPress(props.disabled);
  return (
    <Primitive.Tab
      {...props}
      data-keyboard-pressed={press.pressed || undefined}
      data-pointer-pressed={press.pointerPressed || undefined}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        if (!event.defaultPrevented && event.button === 0) press.pointerDown();
      }}
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
        'hx-tab relative cursor-pointer px-4 py-1 font-hx-display text-hx-xs font-hx-medium uppercase leading-4 tracking-[0.1em]',
        className,
      )}
    />
  );
}
export function TabPanel({
  className,
  ...props
}: Omit<Primitive.Panel.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Panel
      {...props}
      className={cn(
        'hx-tab-panel py-4 font-hx-sans text-hx-sm text-hx-foreground focus-visible:outline-1 focus-visible:outline-hx-focus',
        className,
      )}
    />
  );
}
