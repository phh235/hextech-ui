'use client';
import { Tooltip as Primitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
export const TooltipProvider = Primitive.Provider;
export const Tooltip = Primitive.Root;
export const TooltipTrigger = Primitive.Trigger;
export interface TooltipContentProps extends Omit<Primitive.Popup.Props, 'className'> {
  className?: string;
  side?: Primitive.Positioner.Props['side'];
}
export function TooltipContent({ className, side = 'top', ...props }: TooltipContentProps) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Positioner {...portalTheme} side={side} sideOffset={8} className="z-50">
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-popover max-w-xs border-2 border-transparent px-3 py-2 font-sans text-xs text-foreground',
            className,
          )}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
