'use client';
import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Form as FormPrimitive } from '@base-ui/react/form';
import { cn } from '@/lib/cn';
import { Input, type InputProps } from './input';

export const Form = FormPrimitive;
export interface FieldProps extends Omit<FieldPrimitive.Root.Props, 'className'> {
  className?: string;
}
export function Field({ className, ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root {...props} className={cn('grid gap-2 font-sans text-sm', className)} />
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
        'text-sm font-normal leading-[1.1025rem] tracking-[0.02em] text-muted-foreground',
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
      className={cn('text-xs leading-relaxed text-muted-foreground', className)}
    />
  );
}
export function FieldError({
  className,
  ...props
}: Omit<FieldPrimitive.Error.Props, 'className'> & { className?: string }) {
  return <FieldPrimitive.Error {...props} className={cn('text-xs text-destructive', className)} />;
}
export const FieldControl = FieldPrimitive.Control;
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
