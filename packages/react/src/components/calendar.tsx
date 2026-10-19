'use client';
import { useId, useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import {
  addDays,
  addMonths,
  calendarDays,
  calendarKey,
  clampDay,
  firstOfMonth,
  normalizeRange,
  parseDay,
} from '@/lib/calendar-utils';
import { IconButton } from './icon-button';

export interface DateRange {
  start: string;
  end: string;
}
export interface CalendarSharedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  label?: string;
  defaultMonth?: string;
  /** Pass an ISO day in SSR applications for a stable timezone-aware initial view. */
  referenceDate?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  locale?: string;
  weekStartsOn?: 0 | 1;
  header?: 'heading' | 'picker';
  isDateUnavailable?: (date: string) => boolean;
}
interface SurfaceProps extends CalendarSharedProps {
  selected: readonly string[];
  range?: DateRange | null;
  onPick: (date: string) => void;
  onPreview?: (date: string) => void;
}
function CalendarSurface({
  label = 'Calendar',
  selected,
  range,
  onPick,
  onPreview,
  defaultMonth,
  referenceDate,
  min = '0001-01-01',
  max = '9999-12-31',
  disabled = false,
  readOnly = false,
  locale = 'en-US',
  weekStartsOn = 1,
  header = 'heading',
  isDateUnavailable,
  autoFocus = false,
  className,
  ...props
}: SurfaceProps) {
  if (!parseDay(min) || !parseDay(max) || min > max)
    throw new Error('Calendar bounds must be valid ordered ISO dates.');
  const initial =
    selected[0] || defaultMonth || referenceDate || new Date().toISOString().slice(0, 10);
  if (!parseDay(initial))
    throw new Error('Calendar values and initial month must be valid ISO dates.');
  const [month, setMonth] = useState(() => firstOfMonth(clampDay(initial, min, max)));
  const [focused, setFocused] = useState(() => clampDay(initial, min, max));
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const requestedFocus = useRef(false);
  const mounted = useRef(false);
  const id = useId();
  const days = calendarDays(month, weekStartsOn);
  const monthDate = parseDay(month)!;
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(monthDate);
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
  const unavailable = (day: string) =>
    disabled || day < min || day > max || Boolean(isDateUnavailable?.(day));
  const tabDay =
    days.includes(focused) && !unavailable(focused)
      ? focused
      : days.find((day) => day && day.startsWith(month.slice(0, 7)) && !unavailable(day));
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (autoFocus && tabDay) buttons.current.get(tabDay)?.focus();
    }
    if (requestedFocus.current && tabDay) {
      requestedFocus.current = false;
      buttons.current.get(tabDay)?.focus();
    }
  }, [tabDay, month, autoFocus]);
  function navigateMonth(next: string) {
    const target = clampDay(next, min, max);
    setMonth(firstOfMonth(target));
    setFocused(target);
  }
  function keydown(event: React.KeyboardEvent<HTMLButtonElement>, day: string) {
    const destination = calendarKey(day, event.key, event.shiftKey, weekStartsOn);
    if (!destination) return;
    event.preventDefault();
    let candidate = clampDay(destination, min, max);
    const direction = ['ArrowLeft', 'ArrowUp', 'PageUp', 'End'].includes(event.key) ? -1 : 1;
    for (let attempts = 0; attempts < 366 && unavailable(candidate); attempts++) {
      const next = clampDay(addDays(candidate, direction), min, max);
      if (next === candidate) return;
      candidate = next;
    }
    if (unavailable(candidate)) return;
    requestedFocus.current = true;
    setFocused(candidate);
    setMonth(firstOfMonth(candidate));
    onPreview?.(candidate);
  }
  const year = monthDate.getUTCFullYear();
  const years = Array.from(
    { length: Math.min(9999, year + 100) - Math.max(1, year - 100) + 1 },
    (_, index) => Math.max(1, year - 100) + index,
  );
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    parseDay(addDays('2026-10-04', index + weekStartsOn))!,
  );
  return (
    <div
      role="group"
      aria-label={label}
      {...props}
      aria-disabled={disabled || undefined}
      className={cn(
        'hx-calendar w-fit max-w-full font-sans text-foreground outline-none aria-disabled:opacity-60',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <IconButton
          aria-label="Previous month"
          size="small"
          variant="text"
          disabled={disabled || month <= firstOfMonth(min)}
          onClick={() => navigateMonth(addMonths(month, -1))}
        >
          ‹
        </IconButton>
        {header === 'picker' ? (
          <div className="flex min-w-0 gap-2">
            <select
              aria-label="Month"
              value={monthDate.getUTCMonth()}
              disabled={disabled}
              onChange={(event) =>
                navigateMonth(
                  `${String(year).padStart(4, '0')}-${String(Number(event.target.value) + 1).padStart(2, '0')}-01`,
                )
              }
              className="min-w-0 bg-transparent px-1 py-1 font-display text-sm font-bold uppercase text-foreground"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(
                    parseDay(`2026-${String(index + 1).padStart(2, '0')}-01`)!,
                  )}
                </option>
              ))}
            </select>
            <select
              aria-label="Year"
              value={year}
              disabled={disabled}
              onChange={(event) =>
                navigateMonth(`${event.target.value.padStart(4, '0')}-${month.slice(5, 7)}-01`)
              }
              className="bg-surface px-1 py-2 text-sm text-primary"
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <h3 className="m-0 flex-1 text-center font-display text-sm font-bold uppercase tracking-[0.075em] text-foreground">
            {monthLabel}
          </h3>
        )}
        <IconButton
          aria-label="Next month"
          size="small"
          variant="text"
          disabled={disabled || month >= firstOfMonth(max)}
          onClick={() => navigateMonth(addMonths(month, 1))}
        >
          ›
        </IconButton>
      </div>
      <p id={id} aria-live="polite" className="sr-only">
        {monthLabel}
      </p>
      <table
        role="grid"
        aria-labelledby={id}
        aria-readonly={readOnly || undefined}
        className="hx-calendar-grid w-[280px] table-fixed border-separate border-spacing-x-0 border-spacing-y-[3px] text-center text-sm"
      >
        <thead>
          <tr>
            {weekdays.map((date) => (
              <th
                scope="col"
                key={date.getUTCDay()}
                className="pb-2 font-sans text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground"
              >
                <abbr
                  className="no-underline"
                  title={new Intl.DateTimeFormat(locale, {
                    weekday: 'long',
                    timeZone: 'UTC',
                  }).format(date)}
                >
                  {new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(
                    date,
                  )}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              {days.slice(row * 7, row * 7 + 7).map((day, index) => {
                if (!day) return <td key={`empty-${index}`} />;
                const inRange = Boolean(range && day >= range.start && day <= range.end);
                const isSelected = selected.includes(day) || inRange;
                const blocked = unavailable(day);
                return (
                  <td key={day} role="gridcell" aria-selected={isSelected} className="p-0">
                    <button
                      type="button"
                      ref={(node) => {
                        if (node) buttons.current.set(day, node);
                        else buttons.current.delete(day);
                      }}
                      disabled={blocked}
                      tabIndex={day === tabDay ? 0 : -1}
                      aria-label={formatter.format(parseDay(day)!)}
                      aria-current={day === referenceDate ? 'date' : undefined}
                      data-selected={isSelected || undefined}
                      data-in-range={inRange || undefined}
                      data-range-start={
                        (inRange && (index === 0 || day === range?.start)) || undefined
                      }
                      data-range-end={(inRange && (index === 6 || day === range?.end)) || undefined}
                      data-outside-month={!day.startsWith(month.slice(0, 7)) || undefined}
                      data-outside-visible-range={!day.startsWith(month.slice(0, 7)) || undefined}
                      data-unavailable={isDateUnavailable?.(day) || undefined}
                      onKeyDown={(event) => keydown(event, day)}
                      onFocus={() => {
                        setFocused(day);
                        onPreview?.(day);
                      }}
                      onPointerEnter={() => onPreview?.(day)}
                      onClick={() => {
                        if (!readOnly) {
                          onPick(day);
                          setFocused(day);
                          setMonth(firstOfMonth(day));
                        }
                      }}
                      className="hx-calendar-day relative z-0 flex items-center justify-center font-sans text-sm font-medium leading-[normal]"
                    >
                      {parseDay(day)!.getUTCDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export interface CalendarProps extends CalendarSharedProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (date: string) => void;
}
export function Calendar({ value, defaultValue, onValueChange, ...props }: CalendarProps) {
  const [local, setLocal] = useState(defaultValue || '');
  const current = value ?? local;
  return (
    <CalendarSurface
      {...props}
      selected={current ? [current] : []}
      onPick={(day) => {
        if (value === undefined) setLocal(day);
        onValueChange?.(day);
      }}
    />
  );
}
export interface RangeCalendarProps extends CalendarSharedProps {
  value?: DateRange | null;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
}
export function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  ...props
}: RangeCalendarProps) {
  const [local, setLocal] = useState<DateRange | null>(defaultValue || null);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [error, setError] = useState('');
  const current = value !== undefined ? value : local;
  const range = anchor && hover ? normalizeRange(anchor, hover) : current;
  function pick(day: string) {
    if (!anchor) {
      setAnchor(day);
      setHover(day);
      setError('');
      return;
    }
    const next = normalizeRange(anchor, day);
    if (props.isDateUnavailable) {
      for (let cursor = next.start; cursor <= next.end; cursor = addDays(cursor, 1)) {
        if (props.isDateUnavailable(cursor)) {
          setError('This range includes an unavailable date. Choose another end date.');
          return;
        }
        if (cursor === next.end) break;
      }
    }
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
    setAnchor(null);
    setHover(null);
    setError('');
  }
  return (
    <div className="grid gap-2">
      <CalendarSurface
        {...props}
        selected={anchor ? [anchor] : current ? [current.start, current.end] : []}
        range={range}
        onPreview={setHover}
        onPick={pick}
      />
      <p role="status" className="text-xs text-muted-foreground">
        {error || (anchor ? 'Choose an end date.' : 'Choose a start date.')}
      </p>
    </div>
  );
}
