'use client';
import { Select as Primitive } from '@base-ui/react/select';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { usePortalTheme } from '@/lib/theme-scope';
import { inputVariants } from './input';
import { useKeyboardPress } from '@/lib/keyboard-press';
export const Select = Primitive.Root;
export const SelectValue = Primitive.Value;
export const SelectGroup = Primitive.Group;
export const SelectGroupLabel = Primitive.GroupLabel;
export function SelectTrigger({
  className,
  children,
  ...props
}: Omit<Primitive.Trigger.Props, 'className' | 'children'> & {
  className?: string;
  children?: React.ReactNode;
}) {
  const press = useKeyboardPress(props.disabled);
  return (
    <Primitive.Trigger
      {...props}
      data-pointer-pressed={press.pointerPressed || undefined}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        if (!event.defaultPrevented && event.button === 0) press.pointerDown();
      }}
      className={cn(
        inputVariants(),
        'hx-select-trigger inline-flex min-w-[200px] items-center justify-between gap-4 pl-2 pr-2 text-left',
        className,
      )}
    >
      {children || <Primitive.Value />}
      <Primitive.Icon aria-hidden className="text-primary">
        <ControlIcon name="chevron-down" />
      </Primitive.Icon>
    </Primitive.Trigger>
  );
}
export function SelectContent({
  className,
  children,
  ...props
}: Omit<Primitive.Popup.Props, 'className' | 'children'> & {
  className?: string;
  children?: React.ReactNode;
}) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        {...portalTheme}
        alignItemWithTrigger={false}
        sideOffset={6}
        className="z-50"
      >
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-select-popup max-h-72 min-w-[var(--anchor-width)] overflow-y-auto border p-0 font-sans text-sm outline-none',
            className,
          )}
        >
          <Primitive.List>{children}</Primitive.List>
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
export function SelectItem({
  className,
  children,
  ...props
}: Omit<Primitive.Item.Props, 'className' | 'children'> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Primitive.Item
      {...props}
      className={cn(
        'hx-option relative flex cursor-pointer items-center gap-3 px-2 py-1.5 outline-none',
        className,
      )}
    >
      <Primitive.ItemText className="flex-1">{children}</Primitive.ItemText>
      <Primitive.ItemIndicator aria-hidden className="text-primary">
        <ControlIcon name="check" />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  );
}
