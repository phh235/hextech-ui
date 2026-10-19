'use client';
import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Input, inputVariants, type InputProps } from './input';
import { Label } from './typography';
export interface DateFieldProps extends Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max' | 'ref'
> {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  description?: string;
  validationMessage?: string;
  inputClassName?: string;
  endAdornment?: ReactNode;
  hideLabel?: boolean;
}
function TemporalField({
  kind,
  label,
  description,
  validationMessage,
  inputClassName,
  endAdornment,
  hideLabel = false,
  className,
  size,
  onValueChange,
  ...props
}: DateFieldProps & { kind: 'date' | 'time' }) {
  const generated = useId();
  const id = props.id || generated;
  const input = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    input.current?.setCustomValidity(validationMessage || '');
  }, [validationMessage]);
  const descriptions =
    [
      props['aria-describedby'],
      description ? `${id}-description` : '',
      validationMessage ? `${id}-error` : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Label htmlFor={id} className={cn(hideLabel && 'sr-only')}>
        {label}
      </Label>
      <div
        className={cn(
          'hx-temporal-control relative flex min-w-0',
          endAdornment && 'hx-date-group min-h-9 gap-px p-px',
        )}
      >
        <Input
          {...props}
          ref={input}
          id={id}
          type={kind}
          onValueChange={onValueChange}
          aria-invalid={validationMessage ? true : props['aria-invalid']}
          aria-describedby={descriptions}
          aria-errormessage={validationMessage ? `${id}-error` : props['aria-errormessage']}
          className={inputVariants(
            size,
            cn(endAdornment && 'min-h-0 flex-1 border-0', inputClassName),
          )}
        />
        {endAdornment}
      </div>
      {description && (
        <p id={`${id}-description`} className="text-hx-xs text-hx-muted-foreground">
          {description}
        </p>
      )}
      {validationMessage && (
        <p id={`${id}-error`} className="text-hx-xs text-hx-destructive" aria-live="polite">
          {validationMessage}
        </p>
      )}
    </div>
  );
}
/** Browser-native segmented editing; values are Gregorian ISO dates, not React Aria DateValue. */
export function DateField(props: DateFieldProps) {
  return <TemporalField {...props} kind="date" />;
}
export function TimeField(props: DateFieldProps) {
  return <TemporalField {...props} kind="time" />;
}
