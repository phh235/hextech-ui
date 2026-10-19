'use client';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
export interface SeparatorProps extends Omit<SeparatorPrimitive.Props, 'className'> {
  className?: string;
}
export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive
      {...props}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'min-h-6 w-px self-stretch',
        className,
      )}
    />
  );
}
export function Divider({
  children,
  className,
  preset = 'center',
}: {
  children?: ReactNode;
  className?: string;
  preset?: 'left' | 'center' | 'right';
}) {
  if (children)
    return (
      <div className={cn('flex grow items-center gap-8 text-primary', className)}>
        {preset !== 'right' && <Divider preset="left" />}
        {children}
        {preset !== 'left' && <Divider preset="right" />}
      </div>
    );
  return (
    <div className={cn('flex grow items-center', className)}>
      {preset === 'right' && <span aria-hidden="true" className="hx-divider-diamond" />}
      <hr className={`hx-divider hx-divider-${preset} m-0 h-px grow border-0`} />
      {preset === 'left' && <span aria-hidden="true" className="hx-divider-diamond" />}
    </div>
  );
}
