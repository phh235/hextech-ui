'use client';
import { Dialog as Primitive } from '@base-ui/react/dialog';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
import { buttonVariants } from '@/lib/button-variants';
export const Dialog = Primitive.Root;
export const DialogPortal = Primitive.Portal;
export interface DialogContentProps extends Omit<Primitive.Popup.Props, 'className'> {
  className?: string;
  container?: Primitive.Portal.Props['container'];
}
export function DialogTrigger({
  className,
  ...props
}: Omit<Primitive.Trigger.Props, 'className'> & { className?: string }) {
  return <Primitive.Trigger {...props} className={buttonVariants({ className })} />;
}
export function DialogContent({ className, container, ...props }: DialogContentProps) {
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal container={container}>
      <Primitive.Backdrop className="hx-backdrop fixed inset-0 z-50" />
      <Primitive.Viewport
        {...portalTheme}
        className="hx-modal-viewport fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      >
        <Primitive.Popup
          {...props}
          className={cn(
            'hx-popup hx-modal relative grid w-full max-w-md gap-4 border-2 border-transparent p-6 font-hx-sans leading-[normal] text-[var(--hextech-ui-content-foreground)] outline-none',
            className,
          )}
        />
      </Primitive.Viewport>
    </Primitive.Portal>
  );
}
export function DialogTitle({
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
export function DialogDescription({
  className,
  ...props
}: Omit<Primitive.Description.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Description
      {...props}
      className={cn(
        'm-0 font-hx-sans text-hx-sm leading-[1.24] text-hx-muted-foreground',
        className,
      )}
    />
  );
}
export function DialogClose({
  className,
  ...props
}: Omit<Primitive.Close.Props, 'className'> & { className?: string }) {
  return <Primitive.Close {...props} className={buttonVariants({ className })} />;
}
export { DialogContent as Modal, DialogTitle as DialogHeading };
