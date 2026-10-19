'use client';
import { Toolbar } from '@base-ui/react/toolbar';
import { useMemo, useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { useCollectionFocus, useCollectionSelection } from '@/lib/collection-state';
export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  tone?: 'gold' | 'teal' | 'muted';
}
export function Tag({ tone = 'gold', className, ...props }: TagProps) {
  return (
    <span
      {...props}
      className={cn(
        'hx-tag inline-flex items-center gap-1 rounded-full border border-transparent font-sans text-xs leading-none tracking-[0.02em]',
        { 'hx-tag-teal': tone === 'teal', 'hx-tag-muted': tone === 'muted' },
        className,
      )}
    />
  );
}
export interface TagItem {
  id: string;
  label: string;
  disabled?: boolean;
}
export interface TagGroupProps {
  label: string;
  items: readonly TagItem[];
  tone?: TagProps['tone'];
  onRemove?: (ids: string[]) => void;
  selectedKeys?: readonly string[];
  defaultSelectedKeys?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  disabled?: boolean;
  className?: string;
}
export function TagGroup({
  label,
  items,
  tone = 'gold',
  onRemove,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  selectionMode = 'none',
  disabled = false,
  className,
}: TagGroupProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const [selection, setSelection] = useCollectionSelection({
    ids,
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
    onValueChange: onSelectionChange,
  });
  const selected = new Set(selection);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const focusState = useCollectionFocus({
    root,
    ids,
    getItem: (key) => {
      const element = buttons.current.get(key);
      return element?.disabled ? undefined : element;
    },
    enabled: !disabled && (Boolean(onRemove) || selectionMode !== 'none'),
  });
  function select(id: string) {
    if (selectionMode === 'none' || disabled) return;
    const next = selectionMode === 'single' ? new Set([id]) : new Set(selected);
    if (selectionMode === 'multiple') {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    }
    setSelection([...next]);
  }
  function remove(id: string, batch = false) {
    if (!onRemove || disabled) return;
    const removed =
      batch && selectionMode === 'multiple' && selected.has(id)
        ? items.filter((item) => selected.has(item.id) && !item.disabled).map((item) => item.id)
        : [id];
    onRemove(removed);
  }
  function key(event: React.KeyboardEvent<HTMLButtonElement>, item: TagItem) {
    if (item.disabled || disabled) return;
    if (onRemove && ['Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
      remove(item.id, true);
    }
  }
  if (!onRemove && selectionMode === 'none')
    return (
      <div
        role="group"
        aria-label={label}
        className={cn('flex flex-wrap items-center gap-1 p-1', className)}
      >
        {items.map((item) => (
          <Tag key={item.id} tone={tone} className="px-2 py-1">
            {item.label}
          </Tag>
        ))}
      </div>
    );
  return (
    <Toolbar.Root
      ref={root}
      aria-label={label}
      tabIndex={!items.length && !disabled ? 0 : -1}
      onBlurCapture={(event) => focusState.releaseFocus(event.relatedTarget)}
      onKeyDown={(event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'a' &&
          selectionMode === 'multiple' &&
          !disabled
        ) {
          event.preventDefault();
          const next = items.filter((item) => !item.disabled).map((item) => item.id);
          setSelection(next);
        }
      }}
      className={cn(
        'flex flex-wrap items-center gap-1 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
    >
      {items.map((item) => (
        <Tag
          key={item.id}
          tone={tone}
          data-selected={selected.has(item.id) || undefined}
          onFocusCapture={(event) => focusState.trackFocus(item.id, event.target as HTMLElement)}
          className={disabled || item.disabled ? 'opacity-50' : undefined}
        >
          {selectionMode !== 'none' ? (
            <Toolbar.Button
              ref={(node) => {
                if (node) buttons.current.set(item.id, node);
                else buttons.current.delete(item.id);
              }}
              disabled={disabled || item.disabled}
              aria-pressed={selected.has(item.id)}
              onClick={() => select(item.id)}
              onKeyDown={(event) => key(event, item)}
              className="px-2 py-1 outline-offset-2 focus-visible:outline-1 focus-visible:outline-focus"
            >
              {item.label}
            </Toolbar.Button>
          ) : (
            <span className="px-2 py-1">{item.label}</span>
          )}
          {onRemove && (
            <Toolbar.Button
              ref={
                selectionMode === 'none'
                  ? (node) => {
                      if (node) buttons.current.set(item.id, node);
                      else buttons.current.delete(item.id);
                    }
                  : undefined
              }
              aria-label={`Remove ${item.label}`}
              disabled={disabled || item.disabled}
              onClick={() => remove(item.id)}
              onKeyDown={(event) => key(event, item)}
              className="hx-tag-remove flex size-4 items-center justify-center border-0 p-0 outline-offset-2 focus-visible:outline-1 focus-visible:outline-focus"
            >
              <span aria-hidden="true">×</span>
            </Toolbar.Button>
          )}
        </Tag>
      ))}
      {!items.length && <span className="text-xs text-muted-foreground">No tags selected.</span>}
    </Toolbar.Root>
  );
}
export { TagGroup as TagList };
