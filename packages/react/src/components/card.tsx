import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export function Card({
  className,
  animated = false,
  ...props
}: ComponentPropsWithoutRef<'section'> & { animated?: boolean }) {
  return (
    <section
      {...props}
      data-animated={animated || undefined}
      className={cn(
        'hx-frame rounded-none border-2 border-transparent font-hx-sans text-hx-foreground',
        className,
      )}
    />
  );
}
export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('grid gap-2 p-6', className)} />;
}
export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      {...props}
      className={cn(
        'm-0 font-hx-display text-[length:calc(var(--hextech-ui-rem)*1.1667)] font-hx-bold uppercase leading-7 tracking-[0.075em] text-hx-foreground',
        className,
      )}
    />
  );
}
export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...props}
      className={cn('m-0 text-hx-sm leading-relaxed text-hx-muted-foreground', className)}
    />
  );
}
export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('px-6 pb-6', className)} />;
}
export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-wrap items-center gap-3 border-t border-[var(--hextech-ui-gold-600)] px-6 py-4',
        className,
      )}
    />
  );
}
