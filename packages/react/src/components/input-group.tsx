'use client';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';
import { Group, GroupInput } from './group';
import { Button, type ButtonProps } from './button';
import { Textarea, type TextareaProps } from './textarea';

export function InputGroup({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <Group {...props} className={cn('hx-input-group flex-wrap', className)} />;
}
export const InputGroupInput = GroupInput;
export interface InputGroupAddonProps extends ComponentPropsWithRef<'div'> {
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
}
export function InputGroupAddon({
  align = 'inline-start',
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      {...props}
      data-align={align}
      className={cn(
        'hx-input-group-addon flex shrink-0 items-center gap-2 px-2 font-hx-sans text-hx-sm text-hx-muted-foreground',
        className,
      )}
    />
  );
}
export function InputGroupText({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      {...props}
      className={cn('font-hx-sans text-hx-xs text-hx-muted-foreground', className)}
    />
  );
}
export function InputGroupButton({
  className,
  size = 'small',
  variant = 'text',
  ...props
}: ButtonProps) {
  return (
    <Button {...props} size={size} variant={variant} className={cn('min-h-7 px-2', className)} />
  );
}
export function InputGroupTextarea({ className, ...props }: TextareaProps) {
  return (
    <Textarea {...props} className={cn('w-full border-0 focus-visible:outline-none', className)} />
  );
}
