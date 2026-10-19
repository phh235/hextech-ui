'use client';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { cn } from '@/lib/cn';
import { Button } from './button';
import { useClientReady } from '@/lib/client-ready';

export interface TableLoadMoreLabels {
  loadMore: string;
  loading: string;
  retry: string;
  complete: string;
  error: string;
  loaded: string;
}
const defaultLabels: TableLoadMoreLabels = {
  loadMore: 'Load more rows',
  loading: 'Loading more rows',
  retry: 'Retry loading rows',
  complete: 'All rows loaded',
  error: 'Could not load more rows.',
  loaded: 'Load request finished.',
};
export interface TableLoadMoreItemProps extends ComponentPropsWithoutRef<'tr'> {
  onLoadMore: (options: { signal: AbortSignal }) => void | Promise<void>;
  loadKey?: string | number;
  colSpan?: number;
  hasMore?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoLoad?: boolean;
  root?: Element | Document | null;
  rootMargin?: string;
  labels?: Partial<TableLoadMoreLabels>;
  cellProps?: Omit<ComponentPropsWithoutRef<'td'>, 'children' | 'colSpan'>;
  buttonClassName?: string;
}

/** Original sentinel with explicit progress identity and a persistent native action. */
export function TableLoadMoreItem({
  onLoadMore,
  loadKey = 0,
  colSpan = 1,
  hasMore = true,
  loading = false,
  disabled = false,
  autoLoad = true,
  root = null,
  rootMargin = '0px',
  children,
  className,
  labels,
  cellProps,
  buttonClassName,
  ...props
}: TableLoadMoreItemProps) {
  const ready = useClientReady();
  const text = { ...defaultLabels, ...labels };
  const id = useId();
  const row = useRef<HTMLTableRowElement | null>(null);
  const mounted = useRef(false);
  const callback = useRef(onLoadMore);
  const pending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const attempted = useRef<string | number | undefined>(undefined);
  const [intersection, setIntersection] = useState<{
    key: string | number;
    root: Element | Document | null;
    margin: string;
    visible: boolean;
  } | null>(null);
  const [localLoading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const busy = loading || localLoading;
  useLayoutEffect(() => {
    callback.current = onLoadMore;
  }, [onLoadMore]);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!ready || !autoLoad || !row.current || typeof IntersectionObserver === 'undefined') return;
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries.at(-1);
        if (active && latest)
          setIntersection({
            key: loadKey,
            root,
            margin: rootMargin,
            visible: latest.isIntersecting,
          });
      },
      { root, rootMargin },
    );
    observer.observe(row.current);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [ready, autoLoad, root, rootMargin, loadKey]);
  const request = useCallback(async () => {
    if (!ready || disabled || loading || !hasMore || pending.current) return;
    pending.current = true;
    attempted.current = loadKey;
    const task = new AbortController();
    controller.current = task;
    setLoading(true);
    setFailed(false);
    setCompleted(false);
    try {
      await callback.current({ signal: task.signal });
      if (mounted.current && !task.signal.aborted) setCompleted(true);
    } catch {
      if (mounted.current && !task.signal.aborted) setFailed(true);
    } finally {
      pending.current = false;
      controller.current = null;
      if (mounted.current) setLoading(false);
    }
  }, [ready, disabled, loading, hasMore, loadKey]);
  useEffect(() => {
    if (
      autoLoad &&
      intersection?.key === loadKey &&
      intersection.root === root &&
      intersection.margin === rootMargin &&
      intersection.visible &&
      !busy &&
      attempted.current !== loadKey
    )
      void request();
  }, [autoLoad, intersection, root, rootMargin, busy, loadKey, request]);
  const status = busy ? text.loading : !hasMore ? text.complete : completed ? text.loaded : '';
  return (
    <tr
      {...props}
      ref={row}
      className={cn('font-sans text-sm text-foreground', className)}
      data-hextech-ui="table-load-more"
      data-hextech-ready={ready ? 'true' : 'false'}
      data-loading={busy || undefined}
      data-error={(failed && hasMore) || undefined}
    >
      <td
        {...cellProps}
        colSpan={colSpan}
        className={cn('border-t border-border px-4 py-3 text-center', cellProps?.className)}
      >
        {children}
        <Button
          variant="dimmed"
          size="small"
          loading={busy}
          className={buttonClassName}
          disabled={!ready || disabled || !hasMore}
          focusableWhenDisabled={ready && !disabled}
          aria-describedby={failed && hasMore ? `${id}-error` : undefined}
          onClick={() => void request()}
        >
          {busy ? text.loading : !hasMore ? text.complete : failed ? text.retry : text.loadMore}
        </Button>
        <span className="sr-only" role="status">
          {status}
        </span>
        {failed && hasMore ? (
          <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-destructive">
            {text.error}
          </p>
        ) : null}
      </td>
    </tr>
  );
}
