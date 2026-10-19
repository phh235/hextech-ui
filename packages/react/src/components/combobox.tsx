'use client';
import { Combobox as Primitive } from '@base-ui/react/combobox';
import { useId, useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { usePortalTheme } from '@/lib/theme-scope';
import { inputVariants } from './input';
import type { ControlSize } from '@/lib/button-variants';
import { createOptionModel } from '@/lib/selection-options';
import { Label } from './typography';

export interface ComboboxProps<T = string> extends Omit<
  Primitive.Root.Props<T>,
  'children' | 'items'
> {
  label: string;
  options: readonly T[];
  getOptionKey?: (option: T) => string | number;
  renderOption?: (option: T) => ReactNode;
  isOptionDisabled?: (option: T) => boolean;
  emptyState?: ReactNode;
  size?: ControlSize;
  clearOnEscape?: boolean;
  placeholder?: string;
  className?: string;
}
export function Combobox<T = string>({
  label,
  options,
  placeholder = 'Search…',
  className,
  getOptionKey,
  itemToStringLabel,
  renderOption,
  isOptionDisabled,
  emptyState = 'No results found.',
  size = 'medium',
  clearOnEscape = false,
  onValueChange,
  onInputValueChange,
  ...props
}: ComboboxProps<T>) {
  const inputId = useId();
  const portalTheme = usePortalTheme();
  const model = useMemo(
    () => createOptionModel(options, { getOptionKey, getOptionLabel: itemToStringLabel }),
    [options, getOptionKey, itemToStringLabel],
  );
  return (
    <Primitive.Root<T>
      items={options}
      itemToStringLabel={model.label}
      itemToStringValue={model.key}
      isItemEqualToValue={model.equal}
      {...props}
      onInputValueChange={(value, details) => {
        if (!clearOnEscape && details.reason === 'escape-key') {
          details.allowPropagation();
          details.cancel();
          return;
        }
        onInputValueChange?.(value, details);
      }}
      onValueChange={(value, details) => {
        if (!clearOnEscape && details.reason === 'escape-key') {
          details.allowPropagation();
          details.cancel();
          return;
        }
        onValueChange?.(value, details);
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
            <ControlIcon name="close" className="mx-auto size-3" />
          </Primitive.Clear>
          <Primitive.Trigger
            aria-label={`Show ${label} options`}
            className={cn(
              'min-w-9 text-primary',
              size === 'small' ? 'min-h-8' : size === 'large' ? 'min-h-10' : 'min-h-9',
            )}
          >
            <ControlIcon name="chevron-down" className="mx-auto" />
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
                  className="hx-option flex cursor-pointer items-center justify-between gap-3 px-2 py-1.5 outline-none"
                >
                  {renderOption ? renderOption(option) : model.label(option)}
                  <Primitive.ItemIndicator aria-hidden>
                    <ControlIcon name="check" />
                  </Primitive.ItemIndicator>
                </Primitive.Item>
              )}
            </Primitive.List>
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
export { Autocomplete } from './autocomplete';
export type { AutocompleteProps } from './autocomplete';
export const useFilter = Primitive.useFilter;
/** Unstyled Base UI parts for grouped, virtualized and other custom compositions. */
export const ComboboxPrimitive = Primitive;
