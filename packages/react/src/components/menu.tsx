'use client';
import { Menu as Primitive } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { usePortalTheme } from '@/lib/theme-scope';
import { buttonVariants } from '@/lib/button-variants';
export const Menu = Primitive.Root;
export const MenuSub = Primitive.SubmenuRoot;
export const MenuGroup = Primitive.Group;
export function MenuTrigger({
  className,
  children,
  ...props
}: Omit<Primitive.Trigger.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Trigger {...props} className={buttonVariants({ className })}>
      {children}
      <ControlIcon name="chevron-down" />
    </Primitive.Trigger>
  );
}
export function MenuContent({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  ...props
}: Omit<Primitive.Popup.Props, 'className'> & {
  className?: string;
  side?: Primitive.Positioner.Props['side'];
  align?: Primitive.Positioner.Props['align'];
  sideOffset?: number;
}) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        {...portalTheme}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-menu min-w-[150px] border-2 border-transparent p-0 font-hx-sans text-hx-sm outline-none',
            className,
          )}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
export function MenuItem({
  className,
  ...props
}: Omit<Primitive.Item.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Item
      {...props}
      className={cn(
        'hx-menu-item flex cursor-default items-center gap-2 px-2 py-1.5 outline-none',
        className,
      )}
    />
  );
}
export function MenuSubTrigger({
  className,
  children,
  ...props
}: Omit<Primitive.SubmenuTrigger.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.SubmenuTrigger
      {...props}
      className={cn(
        'hx-menu-item flex items-center justify-between gap-4 px-2 py-1.5 outline-none',
        className,
      )}
    >
      {children}
      <ControlIcon name="chevron-right" />
    </Primitive.SubmenuTrigger>
  );
}
export function MenuLabel({
  className,
  ...props
}: Omit<Primitive.GroupLabel.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.GroupLabel
      {...props}
      className={cn('px-2 pt-2 pb-[3.2px] font-hx-sans text-hx-sm text-hx-foreground', className)}
    />
  );
}
export function MenuSeparator({
  className,
  ...props
}: Omit<Primitive.Separator.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Separator
      {...props}
      className={cn('mx-2 my-[6.4px] h-px bg-hx-foreground/25', className)}
    />
  );
}
export function MenuCheckboxItem({
  className,
  children,
  ...props
}: Omit<Primitive.CheckboxItem.Props, 'className' | 'children'> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Primitive.CheckboxItem
      {...props}
      className={cn('hx-menu-item flex items-center gap-3 px-2 py-1.5 outline-none', className)}
    >
      {children}
      <span className="ml-auto w-4">
        <Primitive.CheckboxItemIndicator aria-hidden>
          <ControlIcon name="check" />
        </Primitive.CheckboxItemIndicator>
      </span>
    </Primitive.CheckboxItem>
  );
}
