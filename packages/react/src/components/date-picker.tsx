'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { parseDay } from '@/lib/calendar-utils';
import { Calendar, RangeCalendar, type CalendarSharedProps, type DateRange } from './calendar';
import { DateField, type DateFieldProps } from './date-field';
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from './popover';

function CalendarMark() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="14" height="13" rx="1" />
      <path d="M3 8h14M6 2v4M14 2v4M6 11h2M12 11h2M6 14h2M12 14h2" />
    </svg>
  );
}

export interface DatePickerProps
  extends
    DateFieldProps,
    Pick<
      CalendarSharedProps,
      'referenceDate' | 'defaultMonth' | 'locale' | 'weekStartsOn' | 'isDateUnavailable'
    > {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
function dateError(
  value: string,
  min?: string,
  max?: string,
  unavailable?: (date: string) => boolean,
): string {
  if (!value) return '';
  if (!parseDay(value)) return 'Enter a valid date.';
  if (min && value < min) return `Choose ${min} or later.`;
  if (max && value > max) return `Choose ${max} or earlier.`;
  return unavailable?.(value) ? 'This date is unavailable.' : '';
}
export function DatePicker({
  value,
  defaultValue = '',
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  referenceDate,
  defaultMonth,
  locale,
  weekStartsOn,
  isDateUnavailable,
  className,
  validationMessage,
  ...props
}: DatePickerProps) {
  const [local, setLocal] = useState(defaultValue);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const current = value ?? local;
  const error = validationMessage || dateError(current, props.min, props.max, isDateUnavailable);
  function update(next: string) {
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  }
  function updateOpen(next: boolean) {
    if (open === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }
  return (
    <Popover open={open ?? localOpen} onOpenChange={updateOpen}>
      <div className={cn('relative w-full', className)}>
        <DateField
          {...props}
          value={current}
          onValueChange={update}
          validationMessage={error}
          endAdornment={
            <PopoverTrigger
              aria-label={`Open ${props.label} calendar`}
              disabled={props.disabled || props.readOnly}
              className="hx-date-trigger min-h-0 shrink-0 border-0 px-2.5 py-0"
            >
              <CalendarMark />
            </PopoverTrigger>
          }
        />
      </div>
      <PopoverContent initialFocus={false} className="hx-date-popup p-3">
        <PopoverTitle className="sr-only">Choose {props.label}</PopoverTitle>
        <Calendar
          autoFocus
          disabled={Boolean(props.disabled)}
          readOnly={Boolean(props.readOnly)}
          label={`${props.label} calendar`}
          value={parseDay(current) && !error ? current : ''}
          onValueChange={(next) => {
            update(next);
            updateOpen(false);
          }}
          {...(props.min && { min: props.min })}
          {...(props.max && { max: props.max })}
          {...(referenceDate && { referenceDate })}
          {...(defaultMonth && { defaultMonth })}
          {...(locale && { locale })}
          {...(weekStartsOn !== undefined && { weekStartsOn })}
          {...(isDateUnavailable && { isDateUnavailable })}
          className="border-0"
        />
      </PopoverContent>
    </Popover>
  );
}
export interface DateRangePickerProps extends Omit<
  DatePickerProps,
  'value' | 'defaultValue' | 'onValueChange' | 'name'
> {
  value?: DateRange | null;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | null) => void;
  name?: string;
}
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  label,
  name,
  open,
  defaultOpen = false,
  onOpenChange,
  referenceDate,
  defaultMonth,
  locale,
  weekStartsOn,
  isDateUnavailable,
  className,
  ...props
}: DateRangePickerProps) {
  const [local, setLocal] = useState<DateRange | null>(defaultValue || null);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const current = value !== undefined ? value : local;
  const currentKey = `${current?.start || ''}|${current?.end || ''}`;
  const [draft, setDraft] = useState({
    baseKey: currentKey,
    start: current?.start || '',
    end: current?.end || '',
  });
  const start = draft.baseKey === currentKey ? draft.start : current?.start || '';
  const end = draft.baseKey === currentKey ? draft.end : current?.end || '';
  const startError = dateError(start, props.min, props.max, isDateUnavailable);
  const endError =
    dateError(end, props.min, props.max, isDateUnavailable) ||
    (start && end && end < start ? 'End date must not be before the start date.' : '');
  function update(next: DateRange | null) {
    if (value === undefined) setLocal(next);
    setDraft({
      baseKey: `${next?.start || ''}|${next?.end || ''}`,
      start: next?.start || '',
      end: next?.end || '',
    });
    onValueChange?.(next);
  }
  function edit(part: 'start' | 'end', text: string) {
    const next = { start, end, [part]: text };
    setDraft({ baseKey: currentKey, ...next });
    if (!next.start && !next.end) update(null);
    else if (
      parseDay(next.start) &&
      parseDay(next.end) &&
      next.start <= next.end &&
      !dateError(next.start, props.min, props.max, isDateUnavailable) &&
      !dateError(next.end, props.min, props.max, isDateUnavailable)
    )
      update(next);
  }
  function updateOpen(next: boolean) {
    if (open === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }
  return (
    <Popover open={open ?? localOpen} onOpenChange={updateOpen}>
      <div className={cn('grid w-full gap-2', className)}>
        <span className="font-sans text-sm font-normal leading-[1.1025rem] tracking-[0.02em] text-muted-foreground">
          {label}
        </span>
        <div
          role="group"
          aria-label={label}
          className="hx-date-group flex min-h-9 min-w-0 gap-px p-px"
        >
          <DateField
            {...props}
            {...(name && { name: `${name}.start` })}
            label={`${label} start`}
            value={start}
            onValueChange={(text) => edit('start', text)}
            validationMessage={startError}
            hideLabel
            className="hx-embedded-date"
            inputClassName="min-h-0 border-0"
          />
          <span aria-hidden="true" className="hx-date-separator">
            –
          </span>
          <DateField
            {...props}
            {...(name && { name: `${name}.end` })}
            label={`${label} end`}
            value={end}
            onValueChange={(text) => edit('end', text)}
            validationMessage={endError}
            hideLabel
            className="hx-embedded-date"
            inputClassName="min-h-0 border-0"
          />
          <PopoverTrigger
            disabled={props.disabled || props.readOnly}
            aria-label={`Choose ${label} range`}
            className="hx-date-trigger min-h-0 shrink-0 border-0 px-2.5 py-0"
          >
            <CalendarMark />
          </PopoverTrigger>
        </div>
        {(startError || endError) && (
          <p className="text-xs text-destructive" aria-live="polite">
            {startError || endError}
          </p>
        )}
      </div>
      <PopoverContent initialFocus={false} className="hx-date-popup p-3">
        <PopoverTitle className="sr-only">Choose {label} range</PopoverTitle>
        <RangeCalendar
          autoFocus
          label={`${label} range calendar`}
          value={startError || endError ? null : current}
          onValueChange={update}
          {...(props.min && { min: props.min })}
          {...(props.max && { max: props.max })}
          {...(referenceDate && { referenceDate })}
          {...(defaultMonth && { defaultMonth })}
          {...(locale && { locale })}
          {...(weekStartsOn !== undefined && { weekStartsOn })}
          {...(isDateUnavailable && { isDateUnavailable })}
          className="border-0"
        />
      </PopoverContent>
    </Popover>
  );
}
