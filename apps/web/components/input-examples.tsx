'use client';

import { useId } from 'react';
import { Input } from '@hextech-ui/react/input';
import { Label } from '@hextech-ui/react/typography';

export const inputReferenceText = 'The quick brown fox jumps over the lazy dog.';

/** Same public story content; each example renders the canonical Input. */
export function InputExample({
  disabled = false,
  variant = 'primary',
}: {
  disabled?: boolean;
  variant?: 'primary' | 'with-label' | 'sizes';
}) {
  const id = useId();
  if (variant === 'sizes')
    return (
      <div className="grid w-full gap-3">
        <Input
          aria-label="Small input"
          size="small"
          defaultValue={inputReferenceText}
          placeholder={inputReferenceText}
          disabled={disabled}
        />
        <Input
          aria-label="Medium input"
          defaultValue={inputReferenceText}
          placeholder={inputReferenceText}
          disabled={disabled}
        />
        <Input
          aria-label="Large input"
          size="large"
          defaultValue={inputReferenceText}
          placeholder={inputReferenceText}
          disabled={disabled}
        />
      </div>
    );
  const input = (
    <Input
      id={id}
      aria-label={variant === 'with-label' ? undefined : 'Text input'}
      defaultValue={inputReferenceText}
      placeholder={inputReferenceText}
      disabled={disabled}
      data-reference-input={variant}
    />
  );
  if (variant === 'with-label')
    return (
      <div className="grid w-full gap-2">
        <Label htmlFor={id}>Some label</Label>
        {input}
      </div>
    );
  return input;
}
