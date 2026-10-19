'use client';

import { forwardRef } from 'react';
import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends Omit<ButtonProps, 'shape' | 'aria-label'> {
  'aria-label': string;
  shape?: 'square' | 'round';
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { shape = 'square', ...props },
  ref,
) {
  return <Button ref={ref} shape={shape} {...props} />;
});
