'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { Input, type InputProps } from './input';
import { Label } from './typography';

export interface SearchFieldProps extends Omit<
  InputProps,
  'value' | 'defaultValue' | 'onValueChange' | 'type'
> {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  /** Search side effects are delayed; input value changes remain immediate. */
  onSearch?: (value: string) => void;
  debounceMs?: number;
}
export function SearchField({
  label,
  value,
  defaultValue = '',
  onValueChange,
  onClear,
  onSearch,
  debounceMs = 300,
  className,
  ...props
}: SearchFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState(defaultValue);
  const current = value ?? local;
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = useRef(onSearch);
  useLayoutEffect(() => {
    search.current = onSearch;
  }, [onSearch]);
  useEffect(
    () => () => {
      if (pending.current) clearTimeout(pending.current);
    },
    [],
  );
  useEffect(() => {
    if ((props.disabled || props.readOnly) && pending.current) {
      clearTimeout(pending.current);
      pending.current = null;
    }
  }, [props.disabled, props.readOnly]);
  function change(next: string) {
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
    if (pending.current) clearTimeout(pending.current);
    pending.current = null;
    if (!search.current) return;
    if (!next || debounceMs <= 0) search.current(next);
    else
      pending.current = setTimeout(() => {
        pending.current = null;
        search.current?.(next);
      }, debounceMs);
  }
  function clear() {
    change('');
    onClear?.();
    input.current?.focus();
  }
  return (
    <div role="search" aria-label={label} className={cn('grid w-full gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute top-1/2 left-[5px] z-1 size-4 -translate-y-1/2 text-hx-primary"
        >
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m12 12 5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <Input
          {...props}
          ref={input}
          id={id}
          type="search"
          value={current}
          onValueChange={change}
          onKeyDown={(event) => {
            props.onKeyDown?.(event);
            if (
              !event.defaultPrevented &&
              event.key === 'Escape' &&
              current &&
              !props.readOnly &&
              !props.disabled
            ) {
              event.preventDefault();
              clear();
            }
          }}
          className="pr-10 pl-6 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {current && !props.readOnly && !props.disabled && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            disabled={props.disabled}
            onClick={clear}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-hx-xs font-hx-black text-[var(--hextech-ui-gold-300)] hover:text-hx-foreground active:text-[var(--hextech-ui-gold-600)] focus-visible:outline-1 focus-visible:outline-hx-focus"
          >
            <ControlIcon name="close" />
          </button>
        )}
      </div>
    </div>
  );
}
