'use client';
import { PreviewCard as Primitive } from '@base-ui/react/preview-card';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
export const PreviewCard = Primitive.Root;
export function PreviewCardTrigger({
  className,
  ...props
}: Omit<Primitive.Trigger.Props, 'className'> & { className?: string }) {
  return <Primitive.Trigger {...props} className={cn('hx-preview-trigger font-sans', className)} />;
}
export function PreviewCardContent({
  className,
  ...props
}: Omit<Primitive.Popup.Props, 'className'> & { className?: string }) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Positioner {...portalTheme} sideOffset={10} className="z-50">
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-popover max-w-xs border-2 border-transparent p-4 font-sans text-sm text-foreground',
            className,
          )}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
