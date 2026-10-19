'use client';
import { Accordion as Primitive } from '@base-ui/react/accordion';
import { cn } from '@/lib/cn';
import { useKeyboardPress } from '@/lib/keyboard-press';
export const Accordion = Primitive.Root;
export function AccordionItem({
  className,
  ...props
}: Omit<Primitive.Item.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Item
      {...props}
      className={cn('border-b border-[var(--hextech-ui-gold-600)] last:border-0', className)}
    />
  );
}
export function AccordionTrigger({
  className,
  children,
  ...props
}: Omit<Primitive.Trigger.Props, 'className' | 'children'> & {
  className?: string;
  children?: React.ReactNode;
}) {
  const press = useKeyboardPress(props.disabled);
  return (
    <Primitive.Header>
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
          'hx-disclosure-trigger group flex w-full items-center gap-2 py-2 text-left font-display text-base font-bold uppercase leading-[normal]',
          className,
        )}
      >
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 8 12"
          className="order-first h-3 w-2 shrink-0 group-data-panel-open:rotate-90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m1 2 5 4-5 4" />
        </svg>
      </Primitive.Trigger>
    </Primitive.Header>
  );
}
export function AccordionPanel({
  className,
  ...props
}: Omit<Primitive.Panel.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Panel
      {...props}
      className={cn(
        'hx-disclosure overflow-hidden pb-4 font-sans text-sm leading-[1.24] text-muted-foreground',
        className,
      )}
    />
  );
}
