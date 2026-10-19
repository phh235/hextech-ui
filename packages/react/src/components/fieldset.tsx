'use client';
import { Fieldset as Primitive } from '@base-ui/react/fieldset';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface FieldsetProps extends Omit<Primitive.Root.Props, 'className'> {
  className?: string;
}
export function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <Primitive.Root
      {...props}
      className={cn('m-0 grid min-w-0 gap-4 border-0 p-0 font-hx-sans text-hx-sm', className)}
    />
  );
}
export function FieldsetLegend({
  className,
  ...props
}: Omit<Primitive.Legend.Props, 'className'> & { className?: string }) {
  return (
    <Primitive.Legend
      {...props}
      className={cn('font-hx-display text-hx-base font-hx-bold text-hx-primary', className)}
    />
  );
}
export function FieldsetDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p
      {...props}
      className={cn('text-hx-sm leading-relaxed text-hx-muted-foreground', className)}
    />
  );
}
