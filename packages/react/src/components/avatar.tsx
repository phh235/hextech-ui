'use client';

import { Avatar as Primitive } from '@base-ui/react/avatar';
import { cn } from '@/lib/cn';

export function Avatar({
  className,
  ...props
}: Omit<Primitive.Root.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Root
      role={props['aria-label'] || props['aria-labelledby'] ? 'img' : undefined}
      {...props}
      className={cn(
        'relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden border border-primary/60 bg-muted font-serif text-xl text-primary',
        className,
      )}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: Omit<Primitive.Image.Props, 'className'> & { className?: string }) {
  return <Primitive.Image {...props} className={cn('size-full object-cover', className)} />;
}

export function AvatarFallback({
  className,
  ...props
}: Omit<Primitive.Fallback.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Fallback
      {...props}
      className={cn('flex size-full items-center justify-center', className)}
    />
  );
}
