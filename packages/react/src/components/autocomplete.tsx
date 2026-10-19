'use client';
import { Autocomplete as Primitive } from '@base-ui/react/autocomplete';
import { useId, useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { usePortalTheme } from '@/lib/theme-scope';
import { createOptionModel } from '@/lib/selection-options';
import type { ControlSize } from '@/lib/button-variants';
import { inputVariants } from './input';
import { Label } from './typography';
export interface AutocompleteProps<T = string> extends Omit<
  Primitive.Root.Props<T>,
  'children' | 'items' | 'inline'
> {
  label: string;
  options: readonly T[];
  getOptionKey?: (option: T) => string | number;
  renderOption?: (option: T) => ReactNode;
  isOptionDisabled?: (option: T) => boolean;
  emptyState?: ReactNode;
  placeholder?: string;
  size?: ControlSize;
  clearOnEscape?: boolean;
  className?: string;
}
/** Free text with optional suggestions; unlike Combobox, selection is not required. */
export function Autocomplete<T = string>({
  label,
  options,
  getOptionKey,
  itemToStringValue,
  renderOption,
  isOptionDisabled,
  emptyState = 'No suggestions found.',
  placeholder = 'Type a value…',
  size = 'medium',
  clearOnEscape = false,
  onValueChange,
  className,
  ...props
}: AutocompleteProps<T>) {
  const inputId = useId();
  const portalTheme = usePortalTheme();
  const model = useMemo(
    () => createOptionModel(options, { getOptionKey, getOptionLabel: itemToStringValue }),
    [options, getOptionKey, itemToStringValue],
  );
  return (
    <Primitive.Root<T>
      items={options}
      itemToStringValue={model.label}
      {...props}
      onValueChange={(text, details) => {
        if (!clearOnEscape && details.reason === 'escape-key') {
          details.allowPropagation();
          details.cancel();
          return;
        }
        onValueChange?.(text, details);
      }}
    >
      <div className={cn('grid w-full gap-2', className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <Primitive.InputGroup className="hx-group flex min-w-0 items-stretch border border-transparent">
          <Primitive.Input
            id={inputId}
            placeholder={placeholder}
            className={cn(inputVariants(size), 'border-0 focus-visible:outline-none')}
          />
          <Primitive.Clear
            aria-label={`Clear ${label}`}
            className={cn(
              'min-w-8 text-muted-foreground',
              size === 'small' ? 'min-h-8' : size === 'large' ? 'min-h-10' : 'min-h-9',
            )}
          >
            ×
          </Primitive.Clear>
          <Primitive.Trigger
            aria-label={`Show ${label} suggestions`}
            className={cn(
              'min-w-9 text-primary',
              size === 'small' ? 'min-h-8' : size === 'large' ? 'min-h-10' : 'min-h-9',
            )}
          >
            ⌄
          </Primitive.Trigger>
        </Primitive.InputGroup>
      </div>
      <Primitive.Portal>
        <Primitive.Positioner {...portalTheme} sideOffset={6} className="z-50">
          <Primitive.Popup className="hx-popup hx-select-popup min-w-[var(--anchor-width)] border p-0 font-sans text-sm">
            <Primitive.Empty className="p-3 text-muted-foreground">{emptyState}</Primitive.Empty>
            <Primitive.List className="max-h-64 overflow-y-auto">
              {(option: T) => (
                <Primitive.Item
                  key={model.key(option)}
                  value={option}
                  aria-label={model.label(option)}
                  disabled={isOptionDisabled?.(option)}
                  className="hx-option flex cursor-pointer items-center gap-3 px-2 py-1.5 outline-none"
                >
                  {renderOption ? renderOption(option) : model.label(option)}
                </Primitive.Item>
              )}
            </Primitive.List>
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
/** Unstyled Base UI parts, including inline lists and grouped/custom layouts. */
export const AutocompletePrimitive = Primitive;
