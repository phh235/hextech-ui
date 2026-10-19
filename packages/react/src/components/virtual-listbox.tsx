'use client';
import { useId, useRef, useState } from 'react';
import { useVirtualizer, defaultRangeExtractor } from '@tanstack/react-virtual';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
export interface VirtualOption {
  id: string;
  label: string;
  disabled?: boolean;
}
export interface VirtualListboxProps {
  label: string;
  items: readonly VirtualOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  height?: number;
  rowHeight?: number;
  className?: string;
}
/** A windowed listbox. The focused option remains mounted for aria-activedescendant. */
export function VirtualListbox({
  label,
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  disabled = false,
  height = 240,
  rowHeight = 44,
  className,
}: VirtualListboxProps) {
  const id = useId();
  const readyForInput = useClientReady();
  const root = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<readonly string[]>(defaultValue);
  const selected = new Set(value ?? local);
  const [activeKey, setActiveKey] = useState('');
  const active = Math.max(
    0,
    items.findIndex((item) => item.id === activeKey),
  );
  const typeahead = useRef({ time: 0, query: '' });
  const size = Number.isFinite(rowHeight) ? Math.max(32, rowHeight) : 44;
  const viewport = Number.isFinite(height) ? Math.max(size, height) : 240;
  const virtual = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: items.length,
    getScrollElement: () => root.current,
    estimateSize: () => size,
    getItemKey: (index) => items[index]!.id,
    overscan: 4,
    initialRect: { width: 320, height: viewport },
    rangeExtractor: (range) =>
      [...new Set([...defaultRangeExtractor(range), active])]
        .filter((index) => index < items.length)
        .sort((a, b) => a - b),
  });
  function focus(index: number) {
    const next = Math.max(0, Math.min(items.length - 1, index));
    const item = items[next];
    if (!item) return;
    setActiveKey(item.id);
    virtual.scrollToIndex(next, { align: 'auto' });
  }
  function select(index: number) {
    const item = items[index];
    if (!item || disabled || item.disabled) return;
    const next = multiple ? new Set(selected) : new Set<string>();
    if (multiple && next.has(item.id)) next.delete(item.id);
    else next.add(item.id);
    if (value === undefined) setLocal([...next]);
    onValueChange?.([...next]);
  }
  return (
    <div
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className="grid min-w-0 gap-2 font-hx-sans"
    >
      <div
        ref={root}
        role="listbox"
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-multiselectable={multiple || undefined}
        aria-activedescendant={
          items[active] ? `${id}-${encodeURIComponent(items[active]!.id)}` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'hx-select-popup relative w-full overflow-auto border outline-offset-4 focus-visible:outline-1 focus-visible:outline-hx-focus',
          disabled && 'opacity-50',
          className,
        )}
        style={{ height: viewport }}
        onKeyDown={(event) => {
          if (disabled || !items.length) return;
          if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
            event.preventDefault();
            focus(
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : active +
                    (event.key === 'ArrowDown'
                      ? 1
                      : event.key === 'ArrowUp'
                        ? -1
                        : (event.key === 'PageDown' ? 1 : -1) * Math.floor(viewport / size)),
            );
            return;
          }
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            select(active);
            return;
          }
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && multiple) {
            event.preventDefault();
            const next = items.filter((item) => !item.disabled).map((item) => item.id);
            if (value === undefined) setLocal(next);
            onValueChange?.(next);
            return;
          }
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const now = Date.now();
            const query =
              (now - typeahead.current.time < 700 ? typeahead.current.query : '') +
              event.key.toLocaleLowerCase();
            typeahead.current = { time: now, query };
            const ordered = [...items.slice(active + 1), ...items.slice(0, active + 1)];
            const found = ordered.find((item) => item.label.toLocaleLowerCase().startsWith(query));
            if (found) focus(items.indexOf(found));
          }
        }}
      >
        <div role="presentation" style={{ height: virtual.getTotalSize(), position: 'relative' }}>
          {virtual.getVirtualItems().map((row) => {
            const item = items[row.index]!;
            return (
              <div
                key={item.id}
                id={`${id}-${encodeURIComponent(item.id)}`}
                role="option"
                aria-selected={selected.has(item.id)}
                aria-disabled={disabled || item.disabled || undefined}
                aria-setsize={items.length}
                aria-posinset={row.index + 1}
                data-active={row.index === active || undefined}
                onPointerDown={(event) => {
                  if (event.pointerType === 'mouse') event.preventDefault();
                }}
                onClick={() => {
                  root.current?.focus();
                  focus(row.index);
                  select(row.index);
                }}
                className="hx-virtual-option absolute top-0 left-0 flex w-full items-center gap-3 border-b border-[var(--hextech-ui-grey-300)] px-2 text-hx-sm outline-none"
                style={{ height: size, transform: `translateY(${row.start}px)` }}
              >
                <span aria-hidden="true" className="w-4 shrink-0 text-hx-primary">
                  {selected.has(item.id) ? '✓' : '◇'}
                </span>
                <span className="min-w-0 truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {!items.length && (
        <p className="m-0 text-hx-sm text-hx-muted-foreground">No options found.</p>
      )}
    </div>
  );
}
export { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
export type { VirtualizerOptions, VirtualItem } from '@tanstack/react-virtual';
