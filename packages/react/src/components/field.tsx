'use client';
import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Form as FormPrimitive } from '@base-ui/react/form';
import { cn } from '@/lib/cn';
import { Input, type InputProps } from './input';
import type { ComponentPropsWithRef } from 'react';

export const Form = FormPrimitive;
export interface FieldProps extends Omit<FieldPrimitive.Root.Props, 'className'> {
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}
export function Field({ className, orientation = 'vertical', ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      {...props}
      data-orientation={orientation}
      className={cn(
        'hx-field gap-2 font-hx-sans text-hx-sm',
        orientation === 'horizontal' ? 'flex items-start' : 'grid',
        orientation === 'responsive' && 'sm:flex sm:items-start',
        className,
      )}
    />
  );
}
export function FieldLabel({
  className,
  ...props
}: Omit<FieldPrimitive.Label.Props, 'className'> & { className?: string }) {
  return (
    <FieldPrimitive.Label
      {...props}
      className={cn(
        'text-hx-sm font-hx-normal leading-[calc(var(--hextech-ui-rem)*1.1025)] tracking-[0.02em] text-hx-muted-foreground',
        className,
      )}
    />
  );
}
export function FieldDescription({
  className,
  ...props
}: Omit<FieldPrimitive.Description.Props, 'className'> & { className?: string }) {
  return (
    <FieldPrimitive.Description
      {...props}
      className={cn('text-hx-xs leading-relaxed text-hx-muted-foreground', className)}
    />
  );
}
export function FieldError({
  className,
  ...props
}: Omit<FieldPrimitive.Error.Props, 'className'> & { className?: string }) {
  return (
    <FieldPrimitive.Error {...props} className={cn('text-hx-xs text-hx-destructive', className)} />
  );
}
export const FieldControl = FieldPrimitive.Control;
export const FieldItem = FieldPrimitive.Item;

export function FieldGroup({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('grid min-w-0 gap-6', className)} />;
}

export function FieldContent({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('grid min-w-0 flex-1 gap-2', className)} />;
}
export interface TextFieldProps extends InputProps {
  label: string;
  description?: string;
  error?: string;
}
export function TextField({ label, description, error, className, ...props }: TextFieldProps) {
  return (
    <Field {...(error ? { invalid: true } : {})} className={cn(className)}>
      <FieldLabel>{label}</FieldLabel>
      <Input {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError match>{error}</FieldError>}
    </Field>
  );
}
