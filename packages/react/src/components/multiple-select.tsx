'use client';
import { Combobox as Primitive } from '@base-ui/react/combobox';
import { useId, useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ControlIcon } from '@/lib/control-icon';
import { usePortalTheme } from '@/lib/theme-scope';
import { createOptionModel } from '@/lib/selection-options';
import type { ControlSize } from '@/lib/button-variants';
import { Label } from './typography';
export interface MultipleSelectProps<T = string> extends Omit<
  Primitive.Root.Props<T, true>,
  'children' | 'items' | 'multiple'
> {
  label: string;
  options: readonly T[];
  getOptionKey?: (option: T) => string | number;
  renderOption?: (option: T) => ReactNode;
  renderValue?: (option: T) => ReactNode;
  isOptionDisabled?: (option: T) => boolean;
  emptyState?: ReactNode;
  emptySelection?: ReactNode;
  tagGroupLabel?: string;
  size?: ControlSize;
  clearOnEscape?: boolean;
  placeholder?: string;
  className?: string;
}
export function MultipleSelect<T = string>({
  label,
  options,
  placeholder = 'Add a selection…',
  className,
  getOptionKey,
  itemToStringLabel,
  renderOption,
  renderValue,
  isOptionDisabled,
  emptyState = 'No results found.',
  emptySelection,
  tagGroupLabel,
  size = 'medium',
  clearOnEscape = false,
  onValueChange,
  onInputValueChange,
  ...props
}: MultipleSelectProps<T>) {
  const inputId = useId();
  const portalTheme = usePortalTheme();
  const model = useMemo(
    () => createOptionModel(options, { getOptionKey, getOptionLabel: itemToStringLabel }),
    [options, getOptionKey, itemToStringLabel],
  );
  return (
    <Primitive.Root<T, true>
      items={options}
      multiple
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
        <Primitive.Chips
          role="group"
          aria-label={tagGroupLabel || `${label} selections`}
          className={cn(
            'hx-group flex min-h-9 flex-wrap items-center gap-1 border border-transparent p-1 font-sans text-xs',
            size === 'small' && 'min-h-8',
            size === 'large' && 'min-h-10',
          )}
        >
          <Primitive.Value>
            {(values: readonly T[]) =>
              values.length
                ? values.map((value) => (
                    <Primitive.Chip
                      key={model.key(value)}
                      className={cn(
                        'hx-tag hx-tag-teal inline-flex min-h-[22px] items-center rounded-full border border-transparent pl-2 pr-[0.3rem] text-xs leading-none tracking-[0.02em]',
                        size === 'small' && 'pl-1',
                      )}
                    >
                      {renderValue ? renderValue(model.resolve(value)) : model.label(value)}
                      <Primitive.ChipRemove
                        aria-label={`Remove ${model.label(value)}`}
                        className={cn(
                          'hx-tag-remove inline-flex size-4 items-center justify-center outline-offset-2 focus-visible:outline-1 focus-visible:outline-focus',
                          size === 'small' && 'size-4',
                        )}
                      >
                        <ControlIcon name="close" className="mx-auto size-3" />
                      </Primitive.ChipRemove>
                    </Primitive.Chip>
                  ))
                : emptySelection
            }
          </Primitive.Value>
          <Primitive.Input
            id={inputId}
            placeholder={placeholder}
            className={cn(
              'min-h-6 min-w-24 flex-1 bg-transparent px-1 text-xs font-medium text-foreground outline-none',
              size === 'small' && 'min-h-5',
            )}
          />
          <Primitive.Trigger
            aria-label={`Show ${label} options`}
            className="inline-flex size-6 shrink-0 items-center justify-center text-primary focus-visible:outline-1 focus-visible:outline-focus"
          >
            <ControlIcon name="plus" />
          </Primitive.Trigger>
        </Primitive.Chips>
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
                  className="hx-option flex items-center justify-between gap-4 px-2 py-1.5 outline-none"
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
