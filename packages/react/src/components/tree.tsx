'use client';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { treeIndex, type TreeNodeData, type TreeMove } from '@/lib/tree-utils';
import { useCollectionFocus, useCollectionSelection } from '@/lib/collection-state';
import { Spinner } from './spinner';
export interface TreeProps {
  label: string;
  nodes: readonly TreeNodeData[];
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpandedChange?: (keys: string[]) => void;
  selectedKeys?: readonly string[];
  defaultSelectedKeys?: readonly string[];
  onSelectionChange?: (keys: string[]) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  disabled?: boolean;
  onAction?: (id: string) => void;
  onMove?: (move: TreeMove) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  emptyState?: string;
  className?: string;
}
export function Tree({
  label,
  nodes,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpandedChange,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  selectionMode = 'single',
  disabled = false,
  onAction,
  onMove,
  onLoadMore,
  loading = false,
  emptyState = 'No items found.',
  className,
}: TreeProps) {
  const id = useId();
  const index = useMemo(() => treeIndex(nodes), [nodes]);
  const [expandedLocal, setExpanded] = useState<readonly string[]>(defaultExpandedKeys);
  const collectionIds = useMemo(() => [...index.nodes.keys()], [index]);
  const [selection, setSelection] = useCollectionSelection({
    ids: collectionIds,
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
    onValueChange: onSelectionChange,
  });
  const [focused, setFocused] = useState('');
  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<TreeMove | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const refs = useRef(new Map<string, HTMLLIElement>());
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<{ id: string; fallback: string } | null>(null);
  const typeahead = useRef({ query: '', time: 0 });
  useEffect(() => {
    if (!onMove) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) pendingFocus.current = null;
    };
    const blur = () => {
      pendingFocus.current = null;
    };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('blur', blur);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('blur', blur);
    };
  }, [onMove]);
  useLayoutEffect(() => {
    const next = pendingFocus.current;
    if (!next) return;
    const target = refs.current.get(next.id) || refs.current.get(next.fallback);
    if (target) {
      pendingFocus.current = null;
      target.focus();
    }
  }, [nodes, expandedKeys, expandedLocal]);
  const expanded = new Set(expandedKeys ?? expandedLocal);
  const selected = new Set(selection);
  const visible: TreeNodeData[] = [];
  function flatten(items: readonly TreeNodeData[]) {
    for (const item of items) {
      visible.push(item);
      if (expanded.has(item.id) && item.children) flatten(item.children);
    }
  }
  flatten(nodes);
  const tabId = visible.some((item) => item.id === focused)
    ? focused
    : visible.find((item) => selected.has(item.id))?.id || visible[0]?.id;
  const focusState = useCollectionFocus({
    root,
    ids: visible.map((item) => item.id),
    getItem: (key) => refs.current.get(key),
    entryId: tabId,
    hiddenAncestor: (key) => {
      let parent = index.parents.get(key);
      while (parent) {
        if (visible.some((item) => item.id === parent)) return parent;
        parent = index.parents.get(parent);
      }
    },
    enabled: !disabled,
  });
  function blocked(key: string): boolean {
    if (disabled) return true;
    let cursor: string | null | undefined = key;
    while (cursor) {
      if (index.nodes.get(cursor)?.disabled) return true;
      cursor = index.parents.get(cursor);
    }
    return false;
  }
  function focus(next: string) {
    setFocused(next);
    refs.current.get(next)?.focus();
  }
  function expand(key: string) {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    if (expandedKeys === undefined) setExpanded([...next]);
    onExpandedChange?.([...next]);
  }
  function select(key: string, all = false) {
    if (blocked(key) || selectionMode === 'none') return;
    const next = all
      ? new Set(
          [...index.nodes.values()].filter((item) => !blocked(item.id)).map((item) => item.id),
        )
      : selectionMode === 'single'
        ? new Set([key])
        : new Set(selected);
    if (!all && selectionMode === 'multiple') {
      if (next.has(key)) next.delete(key);
      else next.add(key);
    }
    setSelection([...next]);
  }
  function request(move: TreeMove) {
    if (
      !onMove ||
      blocked(move.id) ||
      blocked(move.targetId) ||
      !index.nodes.has(move.id) ||
      !index.nodes.has(move.targetId)
    )
      return;
    let parent: string | null | undefined = move.targetId;
    while (parent) {
      if (parent === move.id) {
        setAnnouncement('A folder cannot be moved inside itself.');
        return;
      }
      parent = index.parents.get(parent);
    }
    pendingFocus.current = { id: move.id, fallback: move.targetId };
    if (move.position === 'inside' && !expanded.has(move.targetId)) {
      const next = [...expanded, move.targetId];
      if (expandedKeys === undefined) setExpanded(next);
      onExpandedChange?.(next);
    }
    onMove(move);
    setAnnouncement(`Move requested for ${index.nodes.get(move.id)?.label}.`);
    focus(move.id);
  }
  function keys(event: React.KeyboardEvent<HTMLLIElement>, node: TreeNodeData) {
    if (event.target !== event.currentTarget || disabled) return;
    const position = visible.findIndex((item) => item.id === node.id);
    const previous = visible[position - 1];
    const next = visible[position + 1];
    if (event.altKey && onMove && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const siblings = [...index.nodes.values()].filter(
        (item) => index.parents.get(item.id) === index.parents.get(node.id),
      );
      const at = siblings.findIndex((item) => item.id === node.id);
      const target = siblings[at + (event.key === 'ArrowUp' ? -1 : 1)];
      if (target)
        request({
          id: node.id,
          targetId: target.id,
          position: event.key === 'ArrowUp' ? 'before' : 'after',
        });
      return;
    }
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const navigationKey =
      rtl && event.key === 'ArrowLeft'
        ? 'ArrowRight'
        : rtl && event.key === 'ArrowRight'
          ? 'ArrowLeft'
          : event.key;
    switch (navigationKey) {
      case 'ArrowDown':
        event.preventDefault();
        if (next) focus(next.id);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (previous) focus(previous.id);
        return;
      case 'Home':
        event.preventDefault();
        if (visible[0]) focus(visible[0].id);
        return;
      case 'End':
        event.preventDefault();
        if (visible.at(-1)) focus(visible.at(-1)!.id);
        return;
      case 'ArrowRight':
        event.preventDefault();
        if (blocked(node.id)) return;
        if (node.children?.length) {
          if (!expanded.has(node.id)) expand(node.id);
          else if (node.children[0]) focus(node.children[0].id);
        }
        return;
      case 'ArrowLeft':
        event.preventDefault();
        if (expanded.has(node.id) && !blocked(node.id)) expand(node.id);
        else {
          const parent = index.parents.get(node.id);
          if (parent) focus(parent);
        }
        return;
      case ' ':
        event.preventDefault();
        select(node.id);
        return;
      case 'Enter':
        event.preventDefault();
        if (!blocked(node.id)) {
          select(node.id);
          if (onAction) onAction(node.id);
          else if (node.children?.length) expand(node.id);
        }
        return;
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'a' &&
      selectionMode === 'multiple'
    ) {
      event.preventDefault();
      select(node.id, true);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      const old = now - typeahead.current.time < 700 ? typeahead.current.query : '';
      const query = old === event.key.toLowerCase() ? old : old + event.key.toLowerCase();
      typeahead.current = { query, time: now };
      const ordered = [...visible.slice(position + 1), ...visible.slice(0, position + 1)];
      const match = ordered.find((item) => item.label.toLocaleLowerCase().startsWith(query));
      if (match) focus(match.id);
    }
  }
  function render(items: readonly TreeNodeData[], level: number): React.ReactNode {
    return items.map((node, position) => (
      <li
        key={node.id}
        ref={(element) => {
          if (element) refs.current.set(node.id, element);
          else refs.current.delete(node.id);
        }}
        role="treeitem"
        aria-labelledby={`${id}-${encodeURIComponent(node.id)}`}
        aria-level={level}
        aria-posinset={position + 1}
        aria-setsize={items.length}
        aria-expanded={node.children?.length ? expanded.has(node.id) : undefined}
        aria-selected={selectionMode === 'none' ? undefined : selected.has(node.id)}
        aria-disabled={blocked(node.id) || undefined}
        aria-keyshortcuts={onMove ? 'Alt+ArrowUp Alt+ArrowDown' : undefined}
        tabIndex={!disabled && node.id === tabId ? 0 : -1}
        onFocus={(event) => {
          event.stopPropagation();
          focusState.trackFocus(node.id, event.target as HTMLElement);
          setFocused(node.id);
        }}
        onKeyDown={(event) => keys(event, node)}
        className="outline-none"
        draggable={Boolean(onMove && !blocked(node.id))}
        onDragStart={(event) => {
          event.stopPropagation();
          setDragging(node.id);
          event.dataTransfer.setData(
            'application/x-hextech-tree',
            JSON.stringify({ tree: id, node: node.id }),
          );
          event.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => {
          setDragging(null);
          setDrop(null);
        }}
        onDragOver={(event) => {
          if (!dragging || dragging === node.id || blocked(node.id)) return;
          event.preventDefault();
          event.stopPropagation();
          const rect = event.currentTarget.firstElementChild?.getBoundingClientRect();
          if (!rect) return;
          const ratio = (event.clientY - rect.top) / rect.height;
          setDrop({
            id: dragging,
            targetId: node.id,
            position: ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside',
          });
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          try {
            const payload = JSON.parse(event.dataTransfer.getData('application/x-hextech-tree'));
            if (payload.tree === id && drop && payload.node === drop.id) request(drop);
          } catch {
            /* Ignore foreign drag data. */
          }
          setDragging(null);
          setDrop(null);
        }}
      >
        <div
          onClick={() => {
            if (!blocked(node.id)) {
              focus(node.id);
              select(node.id);
            }
          }}
          onDoubleClick={() => {
            if (!blocked(node.id) && node.children?.length) expand(node.id);
          }}
          data-selected={selected.has(node.id) || undefined}
          data-selectable={selectionMode !== 'none' || undefined}
          data-drop={drop?.targetId === node.id ? drop.position : undefined}
          className={cn(
            'hx-tree-row flex items-center gap-1.5 py-1.5 pr-3 data-[drop=before]:border-t-primary data-[drop=after]:border-b-primary data-[drop=inside]:border-hx-primary',
            blocked(node.id) && 'hx-tree-disabled',
          )}
          style={{
            paddingInlineStart: `calc(${level - 1} * var(--hextech-ui-tree-indent, calc(var(--hextech-ui-rem)*1.125)) + calc(var(--hextech-ui-rem)*0.5))`,
          }}
        >
          {node.children?.length ? (
            <button
              type="button"
              tabIndex={-1}
              disabled={blocked(node.id)}
              aria-label={`${expanded.has(node.id) ? 'Collapse' : 'Expand'} ${node.label}`}
              onClick={(event) => {
                event.stopPropagation();
                expand(node.id);
                focus(node.id);
              }}
              className="flex h-3 w-2 shrink-0 items-center justify-center text-hx-primary"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 8 12"
                className={cn('h-3 w-2', expanded.has(node.id) && 'rotate-90')}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m1 2 5 4-5 4" />
              </svg>
            </button>
          ) : (
            <span aria-hidden="true" className="w-2 shrink-0" />
          )}
          {selectionMode === 'multiple' && (
            <span
              aria-hidden="true"
              data-disabled={blocked(node.id) || undefined}
              className="hx-checkbox flex size-3.5 shrink-0 items-center justify-center border border-transparent"
            >
              {selected.has(node.id) && (
                <svg
                  viewBox="0 0 20 20"
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m4 10 4 4 8-9" />
                </svg>
              )}
            </span>
          )}
          <span id={`${id}-${encodeURIComponent(node.id)}`} className="min-w-0 flex-1 break-words">
            {node.label}
          </span>
          {onMove && (
            <span className="inline-flex">
              <button
                type="button"
                tabIndex={-1}
                aria-label={`Move ${node.label} up`}
                disabled={blocked(node.id)}
                onClick={(event) => {
                  event.stopPropagation();
                  const target = items[position - 1];
                  if (target) request({ id: node.id, targetId: target.id, position: 'before' });
                }}
                className="size-8 text-hx-muted-foreground"
              >
                ↑
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-label={`Move ${node.label} down`}
                disabled={blocked(node.id)}
                onClick={(event) => {
                  event.stopPropagation();
                  const target = items[position + 1];
                  if (target) request({ id: node.id, targetId: target.id, position: 'after' });
                }}
                className="size-8 text-hx-muted-foreground"
              >
                ↓
              </button>
            </span>
          )}
        </div>
        {node.children?.length && expanded.has(node.id) && (
          <ul role="group" className="m-0 list-none p-0">
            {render(node.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  }
  return (
    <div
      ref={root}
      role={!nodes.length ? 'group' : undefined}
      aria-label={!nodes.length ? label : undefined}
      tabIndex={!nodes.length && !disabled ? 0 : -1}
      onBlurCapture={(event) => {
        focusState.releaseFocus(event.relatedTarget);
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node))
          pendingFocus.current = null;
      }}
      className={cn(
        'grid w-full gap-2 font-hx-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hx-focus',
        className,
      )}
    >
      <ul
        role="tree"
        hidden={!nodes.length}
        aria-label={label}
        aria-multiselectable={selectionMode === 'multiple' || undefined}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        className="hx-tree m-0 max-w-full list-none overflow-x-auto p-0"
      >
        {render(nodes, 1)}
      </ul>
      {!nodes.length && loading && <Spinner label="Loading items" />}
      {!nodes.length && !loading && (
        <p className="m-0 p-3 text-hx-sm text-hx-muted-foreground">{emptyState}</p>
      )}
      {onLoadMore && (
        <button
          type="button"
          disabled={loading || disabled}
          onClick={onLoadMore}
          className="min-h-11 border border-hx-border p-2 text-hx-sm text-hx-primary"
        >
          {loading ? <Spinner size="small" label="Loading more items" /> : 'Load more items'}
        </button>
      )}
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {onMove && (
        <p className="m-0 text-hx-xs text-hx-muted-foreground">
          Use Alt + ↑ or ↓ to reorder, or the move buttons.
        </p>
      )}
    </div>
  );
}
export { moveTreeNode } from '@/lib/tree-utils';
export type { TreeNodeData, TreeMove } from '@/lib/tree-utils';
