'use client';
import { useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  tableFeatures,
  useTable,
  rowSortingFeature,
  rowSelectionFeature,
  columnSizingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFns,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import { Checkbox } from './checkbox';
import { Button } from './button';
import { Spinner } from './spinner';
import { TableLoadMoreItem, type TableLoadMoreItemProps } from './table-load-more';

const features = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnSizingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
});
export interface DataColumn<T extends object> {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'start' | 'center' | 'end';
}
export interface DataTableProps<T extends object> {
  label: string;
  data: readonly T[];
  columns: readonly DataColumn<T>[];
  getRowId: (row: T) => string;
  rowLabel: (row: T) => string;
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: readonly string[];
  defaultSelectedKeys?: readonly string[];
  onSelectionChange?: (keys: string[]) => void;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  pageSize?: number;
  resizable?: boolean;
  keyboardNavigation?: 'tab' | 'cell';
  onReorder?: (id: string, targetId: string, position: 'before' | 'after') => void;
  onRowAction?: (row: T) => void;
  isRowDisabled?: (row: T) => boolean;
  loading?: boolean;
  onLoadMore?: TableLoadMoreItemProps['onLoadMore'];
  autoLoadMore?: boolean;
  hasMore?: boolean;
  loadKey?: string | number;
  emptyState?: ReactNode;
  disabled?: boolean;
  className?: string;
  scrollAreaClassName?: string;
}
/** Optional data engine; import this subpath only when a rich table is needed. */
export function DataTable<T extends object>({
  label,
  data,
  columns,
  getRowId,
  rowLabel,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  sorting,
  defaultSorting = [],
  onSortingChange,
  pageSize = 10,
  resizable = false,
  keyboardNavigation = 'tab',
  onReorder,
  onRowAction,
  isRowDisabled,
  loading = false,
  onLoadMore,
  autoLoadMore = false,
  hasMore = true,
  loadKey = data.length,
  emptyState = 'No results found.',
  disabled = false,
  className,
  scrollAreaClassName,
}: DataTableProps<T>) {
  const id = useId();
  const readyForInput = useClientReady();
  const [localSorting, setSorting] = useState<SortingState>(defaultSorting);
  const [selection, setSelection] = useState<RowSelectionState>(() =>
    Object.fromEntries(defaultSelectedKeys.map((key) => [key, true as const])),
  );
  const [active, setActive] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const dragging = useRef<string | null>(null);
  const resizing = useRef<{ id: string; pointer: number; x: number; width: number } | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const cells = useRef(new Map<string, HTMLTableCellElement>());
  const inputData = useMemo(() => [...data], [data]);
  const definitions = useMemo<ColumnDef<typeof features, T>[]>(
    () =>
      columns.map((column) => ({
        id: column.id,
        accessorFn: column.accessor,
        header: column.header,

        enableSorting: column.sortable !== false,
        size: column.width ?? 180,
        minSize: column.minWidth ?? 100,
        maxSize: column.maxWidth ?? 500,
      })),
    [columns],
  );
  const controlledSelection = useMemo(
    () =>
      selectedKeys
        ? Object.fromEntries(selectedKeys.map((key) => [key, true as const]))
        : selection,
    [selectedKeys, selection],
  );
  const table = useTable({
    features,
    columns: definitions,
    data: inputData,
    getRowId,
    autoResetPageIndex: false,
    enableRowSelection: (row) => !disabled && !isRowDisabled?.(row.original),
    enableMultiRowSelection: selectionMode === 'multiple',
    state: { sorting: sorting ?? localSorting, rowSelection: controlledSelection },
    initialState: { pagination: { pageIndex: 0, pageSize: Math.max(1, Math.floor(pageSize)) } },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting ?? localSorting) : updater;
      if (sorting === undefined) setSorting(next);
      onSortingChange?.(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(controlledSelection) : updater;
      if (selectedKeys === undefined) setSelection(next);
      onSelectionChange?.(Object.keys(next).filter((key) => next[key]));
    },
  });
  const rows = table.getRowModel().rows;
  const count = columns.length + (selectionMode !== 'none' ? 1 : 0) + (onReorder ? 1 : 0);
  const grid = keyboardNavigation === 'cell';
  const firstKey = rows[0] ? `${rows[0].id}:0` : '';
  const activeKey = rows.some((row) =>
    Array.from({ length: count }, (_, c) => `${row.id}:${c}`).includes(active),
  )
    ? active
    : firstKey;
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const row = rowRefs.current.get(pendingFocus.current);
    pendingFocus.current = null;
    (
      row?.querySelector<HTMLElement>(
        '[tabindex="0"],button:not(:disabled),input:not(:disabled)',
      ) || row
    )?.focus();
  }, [data]);
  const blocked = (row: T) => disabled || Boolean(isRowDisabled?.(row));
  function move(source: string, target: string, position: 'before' | 'after') {
    const a = data.find((row) => getRowId(row) === source);
    const b = data.find((row) => getRowId(row) === target);
    if (
      !onReorder ||
      !a ||
      !b ||
      source === target ||
      blocked(a) ||
      blocked(b) ||
      table.state.sorting.length
    )
      return;
    pendingFocus.current = source;
    onReorder(source, target, position);
    setAnnouncement(`Move requested for ${rowLabel(a)}.`);
  }
  function cellKey(
    event: React.KeyboardEvent<HTMLTableCellElement>,
    rowIndex: number,
    columnIndex: number,
  ) {
    if (event.target !== event.currentTarget) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.currentTarget.focus();
      }
      return;
    }
    const row = rows[rowIndex];
    if (!row) return;
    if (event.altKey && onReorder && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const target = rows[rowIndex + (event.key === 'ArrowUp' ? -1 : 1)];
      if (target) move(row.id, target.id, event.key === 'ArrowUp' ? 'before' : 'after');
      return;
    }
    if (!grid) return;
    let r = rowIndex;
    let c = columnIndex;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    switch (event.key) {
      case 'ArrowDown':
        r++;
        break;
      case 'ArrowUp':
        r--;
        break;
      case 'ArrowRight':
        c += rtl ? -1 : 1;
        break;
      case 'ArrowLeft':
        c += rtl ? 1 : -1;
        break;
      case 'Home':
        c = 0;
        if (event.ctrlKey) r = 0;
        break;
      case 'End':
        c = count - 1;
        if (event.ctrlKey) r = rows.length - 1;
        break;
      case ' ':
        if (selectionMode !== 'none' && !blocked(row.original)) {
          event.preventDefault();
          row.toggleSelected();
        }
        return;
      case 'Enter':
      case 'F2': {
        const control = event.currentTarget.querySelector<HTMLElement>(
          '[role=checkbox]:not([aria-disabled=true]),button:not(:disabled),input:not(:disabled):not([type=hidden]),a[href],select,textarea',
        );
        if (control) control.focus();
        else if (!blocked(row.original)) onRowAction?.(row.original);
        event.preventDefault();
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    r = Math.max(0, Math.min(rows.length - 1, r));
    c = Math.max(0, Math.min(count - 1, c));
    const target = rows[r];
    if (target) {
      const key = `${target.id}:${c}`;
      setActive(key);
      cells.current.get(key)?.focus();
    }
  }
  function cellProps(rowId: string, rowIndex: number, colIndex: number) {
    const key = `${rowId}:${colIndex}`;
    return {
      role: grid ? ('gridcell' as const) : undefined,
      tabIndex: grid ? (activeKey === key ? 0 : -1) : undefined,
      ref: (node: HTMLTableCellElement | null) => {
        if (node) cells.current.set(key, node);
        else cells.current.delete(key);
      },
      onFocus: () => setActive(key),
      onKeyDown: (event: React.KeyboardEvent<HTMLTableCellElement>) =>
        cellKey(event, rowIndex, colIndex),
      className: 'hx-grid-cell border-0 px-3 py-1.5 text-sm',
    };
  }
  const offset = selectionMode !== 'none' ? 1 : 0;
  function selectRow(event: React.MouseEvent<HTMLTableRowElement>, row: (typeof rows)[number]) {
    if (event.defaultPrevented || selectionMode === 'none' || !row.getCanSelect()) return;
    if (
      event.target instanceof Element &&
      event.target.closest(
        'a,button,input,select,textarea,[contenteditable="true"],[role="button"],[role="checkbox"],[role="radio"],[role="switch"],[role="link"],[role="combobox"]',
      )
    )
      return;
    row.toggleSelected();
  }
  const gridHelp = columns.some((column) => column.cell)
    ? 'Arrow keys move between cells. Enter edits a cell; Escape returns to navigation.'
    : onRowAction
      ? 'Arrow keys move between cells. Enter activates a row.'
      : 'Arrow keys move between cells. Tab moves between table controls.';
  return (
    <div
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn('grid w-full min-w-0 gap-3 font-sans', className)}
    >
      <p id={`${id}-help`} className="m-0 text-xs text-muted-foreground">
        {grid ? gridHelp : 'Tab moves between table controls.'}
        {grid && selectionMode !== 'none' && ' Space selects a row.'}
        {onReorder && ' Alt + ↑ or ↓ moves a row; sorting must be cleared first.'}
      </p>
      <div
        className={cn('max-w-full overflow-x-auto', scrollAreaClassName)}
        tabIndex={0}
        role="region"
        aria-label={`${label} scroll area`}
      >
        <table
          role={grid ? 'grid' : undefined}
          aria-label={label}
          aria-describedby={`${id}-help`}
          aria-busy={loading || undefined}
          aria-disabled={disabled || undefined}
          aria-multiselectable={(grid && selectionMode === 'multiple') || undefined}
          aria-rowcount={
            grid ? (onLoadMore && hasMore ? -1 : data.length + 1 + (onLoadMore ? 1 : 0)) : undefined
          }
          className="hx-table m-0 w-full table-fixed border-collapse text-start text-sm leading-[1.1025rem] tracking-[0.02em]"
          style={{ minWidth: table.getTotalSize() + offset * 60 + (onReorder ? 100 : 0) }}
        >
          <thead>
            <tr aria-rowindex={grid ? 1 : undefined}>
              {selectionMode !== 'none' && (
                <th scope="col" className="w-15 border-b border-border p-3">
                  {selectionMode === 'multiple' ? (
                    <Checkbox
                      aria-label="Select current page"
                      disabled={disabled || !rows.length}
                      checked={table.getIsAllPageRowsSelected()}
                      indeterminate={
                        !table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()
                      }
                      onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
                    />
                  ) : (
                    <span className="sr-only">Selection</span>
                  )}
                </th>
              )}
              {table.getHeaderGroups()[0]?.headers.map((header, index) => {
                const column = columns[index]!;
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                    className="hx-table-head hx-grid-column relative px-3 py-1.5 text-start font-display text-xs font-bold uppercase leading-4 tracking-[0.075em]"
                    style={{ width: header.getSize() }}
                  >
                    <button
                      type="button"
                      disabled={disabled || !header.column.getCanSort()}
                      onClick={header.column.getToggleSortingHandler()}
                      className="w-full text-start outline-offset-[-1px] hover:text-primary focus-visible:outline-1 focus-visible:outline-focus"
                    >
                      {column.header}
                      <span aria-hidden="true">
                        {sorted === 'asc'
                          ? ' ↑'
                          : sorted === 'desc'
                            ? ' ↓'
                            : column.sortable !== false
                              ? ' ↕'
                              : ''}
                      </span>
                    </button>
                    {resizable && (
                      <input
                        type="range"
                        aria-label={`Resize ${column.header} column`}
                        disabled={disabled}
                        min={column.minWidth ?? 100}
                        max={column.maxWidth ?? 500}
                        value={header.getSize()}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          resizing.current = {
                            id: header.column.id,
                            pointer: event.pointerId,
                            x: event.clientX,
                            width: header.getSize(),
                          };
                          event.currentTarget.setPointerCapture(event.pointerId);
                          event.currentTarget.focus();
                        }}
                        onPointerMove={(event) => {
                          const start = resizing.current;
                          if (
                            !start ||
                            start.id !== header.column.id ||
                            start.pointer !== event.pointerId
                          )
                            return;
                          const width = Math.max(
                            column.minWidth ?? 100,
                            Math.min(column.maxWidth ?? 500, start.width + event.clientX - start.x),
                          );
                          table.setColumnSizing((value) => ({
                            ...value,
                            [header.column.id]: width,
                          }));
                        }}
                        onPointerUp={() => {
                          resizing.current = null;
                        }}
                        onPointerCancel={() => {
                          resizing.current = null;
                        }}
                        onLostPointerCapture={() => {
                          resizing.current = null;
                        }}
                        onChange={(event) =>
                          table.setColumnSizing((value) => ({
                            ...value,
                            [header.column.id]: Number(event.target.value),
                          }))
                        }
                        className="hx-column-resizer absolute inset-y-0 right-0 h-full w-3 cursor-col-resize touch-none opacity-0"
                      />
                    )}
                  </th>
                );
              })}
              {onReorder && (
                <th
                  scope="col"
                  className="w-25 border-b border-border p-2 text-xs text-muted-foreground"
                >
                  Move
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={row.id}
                ref={(node) => {
                  if (node) rowRefs.current.set(row.id, node);
                  else rowRefs.current.delete(row.id);
                }}
                tabIndex={-1}
                aria-rowindex={
                  grid
                    ? table.state.pagination.pageIndex * table.state.pagination.pageSize + r + 2
                    : undefined
                }
                aria-selected={grid && selectionMode !== 'none' ? row.getIsSelected() : undefined}
                aria-disabled={blocked(row.original) || undefined}
                data-selected={row.getIsSelected() || undefined}
                data-interactive={grid || undefined}
                className="hx-table-row"
                onMouseDown={(event) => {
                  if (event.button === 0) selectRow(event, row);
                }}
                onClick={(event) => {
                  if (event.detail === 0) selectRow(event, row);
                }}
                draggable={Boolean(
                  onReorder && !blocked(row.original) && !table.state.sorting.length,
                )}
                onDragStart={(event) => {
                  dragging.current = row.id;
                  event.dataTransfer.setData(
                    'application/x-hextech-row',
                    JSON.stringify({ table: id, row: row.id }),
                  );
                }}
                onDragEnd={() => {
                  dragging.current = null;
                }}
                onDragOver={(event) => {
                  if (dragging.current && !blocked(row.original) && !table.state.sorting.length)
                    event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  try {
                    const value = JSON.parse(
                      event.dataTransfer.getData('application/x-hextech-row'),
                    );
                    if (value.table === id && value.row === dragging.current) {
                      const rect = event.currentTarget.getBoundingClientRect();
                      move(
                        value.row,
                        row.id,
                        event.clientY < rect.top + rect.height / 2 ? 'before' : 'after',
                      );
                    }
                  } catch {
                    /* Foreign drag data is ignored. */
                  }
                  dragging.current = null;
                }}
              >
                {selectionMode !== 'none' && (
                  <td {...cellProps(row.id, r, 0)}>
                    <Checkbox
                      aria-label={`Select ${rowLabel(row.original)}`}
                      disabled={!row.getCanSelect()}
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(value === true)}
                    />
                  </td>
                )}
                {row.getAllCells().map((cell, c) => (
                  <td
                    key={cell.id}
                    {...cellProps(row.id, r, c + offset)}
                    style={{ textAlign: columns[c]?.align }}
                  >
                    {columns[c]?.cell
                      ? columns[c]!.cell!(row.original)
                      : String(cell.getValue() ?? '')}
                  </td>
                ))}
                {onReorder && (
                  <td {...cellProps(row.id, r, count - 1)}>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`Move ${rowLabel(row.original)} up`}
                        disabled={
                          blocked(row.original) || r === 0 || Boolean(table.state.sorting.length)
                        }
                        onClick={() => {
                          const target = rows[r - 1];
                          if (target) move(row.id, target.id, 'before');
                        }}
                        className="size-9 border border-border disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${rowLabel(row.original)} down`}
                        disabled={
                          blocked(row.original) ||
                          r === rows.length - 1 ||
                          Boolean(table.state.sorting.length)
                        }
                        onClick={() => {
                          const target = rows[r + 1];
                          if (target) move(row.id, target.id, 'after');
                        }}
                        className="size-9 border border-border disabled:opacity-40"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {onLoadMore && (
              <TableLoadMoreItem
                onLoadMore={onLoadMore}
                autoLoad={autoLoadMore && !table.getCanNextPage()}
                hasMore={hasMore}
                loadKey={loadKey}
                loading={loading}
                disabled={disabled}
                colSpan={columns.length + offset + (onReorder ? 1 : 0)}
                aria-rowindex={grid ? data.length + 2 : undefined}
                cellProps={{ role: grid ? 'gridcell' : undefined }}
              />
            )}
          </tbody>
        </table>
        {!rows.length && (!onLoadMore || !hasMore) && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {loading ? <Spinner label="Loading rows" /> : emptyState}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-xs text-muted-foreground" role="status">
          {onLoadMore && hasMore ? 'Loaded page' : 'Page'}{' '}
          {Math.min(table.state.pagination.pageIndex + 1, Math.max(1, table.getPageCount()))} of{' '}
          {Math.max(1, table.getPageCount())}
          {selectionMode !== 'none' &&
            ` · ${Object.values(table.state.rowSelection).filter(Boolean).length} selected`}
        </p>
        <div className="flex gap-2">
          <Button
            variant="dimmed"
            size="small"
            disabled={disabled || !table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous page
          </Button>
          <Button
            variant="dimmed"
            size="small"
            disabled={disabled || !table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next page
          </Button>
        </div>
      </div>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
export type { SortingState } from '@tanstack/react-table';
