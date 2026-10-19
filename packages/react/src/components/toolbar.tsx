'use client';
import { Toolbar as Primitive } from '@base-ui/react/toolbar';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/lib/button-variants';
export function Toolbar({
  className,
  ...props
}: Omit<Primitive.Root.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Root
      {...props}
      className={cn(
        'hx-toolbar inline-flex flex-wrap items-center gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start',
        className,
      )}
    />
  );
}
export function ToolbarButton({
  className,
  ...props
}: Omit<Primitive.Button.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Button
      {...props}
      className={buttonVariants({ size: 'medium', variant: 'secondary', className })}
    />
  );
}
export function ToolbarSeparator({
  className,
  ...props
}: Omit<Primitive.Separator.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Separator
      {...props}
      className={cn('hx-toolbar-separator m-0 w-px self-stretch', className)}
    />
  );
}
