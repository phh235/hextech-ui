'use client';
import { Popover as Primitive } from '@base-ui/react/popover';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
import { buttonVariants } from '@/lib/button-variants';
export const Popover = Primitive.Root;
export const PopoverClose = Primitive.Close;
export const PopoverTitle = Primitive.Title;
export const PopoverDescription = Primitive.Description;
export function PopoverBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('grid gap-3 p-4', className)} />;
}
export function PopoverTrigger({
  className,
  ...props
}: Omit<Primitive.Trigger.Props, 'className'> & { className?: string }) {
  return <Primitive.Trigger {...props} className={buttonVariants({ className })} />;
}
export interface PopoverContentProps extends Omit<Primitive.Popup.Props, 'className'> {
  className?: string;
  side?: Primitive.Positioner.Props['side'];
  align?: Primitive.Positioner.Props['align'];
  sideOffset?: number;
  container?: Primitive.Portal.Props['container'];
}
export function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 10,
  container,
  ...props
}: PopoverContentProps) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal container={container}>
      <Primitive.Positioner
        {...portalTheme}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 max-w-[calc(100vw-2rem)]"
      >
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-popover grid max-w-sm border-2 border-transparent p-0.5 font-sans text-base leading-[normal] text-[var(--hextech-ui-content-foreground)] outline-none',
            className,
          )}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
