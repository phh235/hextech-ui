'use client';
import { CheckboxGroup as Primitive } from '@base-ui/react/checkbox-group';
import { cn } from '@/lib/cn';

export interface CheckboxGroupProps extends Omit<Primitive.Props, 'className'> {
  className?: string;
}
export function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return <Primitive {...props} className={cn('grid gap-3 font-hx-sans text-hx-sm', className)} />;
}
