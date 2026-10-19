'use client';
import { AlertDialog as Primitive } from '@base-ui/react/alert-dialog';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
import { buttonVariants } from '@/lib/button-variants';
export const AlertDialog = Primitive.Root;
export const AlertDialogTrigger = Primitive.Trigger;
export function AlertDialogContent({
  className,
  ...props
}: Omit<Primitive.Popup.Props, 'className'> & { className?: string }) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="hx-backdrop fixed inset-0 z-50" />
      <Primitive.Viewport
        {...portalTheme}
        className="hx-modal-viewport fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      >
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-modal relative grid w-full max-w-md gap-4 border-2 border-transparent p-6 font-hx-sans text-hx-foreground outline-none',
            className,
          )}
        />
      </Primitive.Viewport>
    </Primitive.Portal>
  );
}
export function AlertDialogTitle({
  className,
  ...props
}: Omit<Primitive.Title.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Title
      {...props}
      className={cn(
        'm-0 font-hx-display text-[length:calc(var(--hextech-ui-rem)*1.1667)] font-hx-bold uppercase leading-6 tracking-[0.075em] text-hx-foreground',
        className,
      )}
    />
  );
}
export function AlertDialogDescription({
  className,
  ...props
}: Omit<Primitive.Description.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Description
      {...props}
      className={cn('m-0 font-hx-sans text-hx-sm text-hx-muted-foreground', className)}
    />
  );
}
export function AlertDialogClose({
  className,
  ...props
}: Omit<Primitive.Close.Props, 'className'> & { className?: string }) {
  return <Primitive.Close {...props} className={buttonVariants({ className })} />;
}
