'use client';
import { createContext, useContext, type ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';
import { Separator, type SeparatorProps } from './separator';

const Orientation = createContext<'horizontal' | 'vertical'>('horizontal');
export interface ButtonGroupProps extends ComponentPropsWithRef<'div'> {
  orientation?: 'horizontal' | 'vertical';
}
/** A visual action group; use Toolbar when arrow-key navigation is required. */
export function ButtonGroup({ orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return (
    <Orientation.Provider value={orientation}>
      <div
        role="group"
        {...props}
        data-orientation={orientation}
        className={cn(
          'inline-flex items-stretch gap-1',
          orientation === 'vertical' && 'flex-col',
          className,
        )}
      />
    </Orientation.Provider>
  );
}
export function ButtonGroupSeparator({ orientation, className, ...props }: SeparatorProps) {
  const groupOrientation = useContext(Orientation);
  return (
    <Separator
      {...props}
      orientation={orientation ?? (groupOrientation === 'horizontal' ? 'vertical' : 'horizontal')}
      className={cn('m-0 self-stretch', className)}
    />
  );
}
