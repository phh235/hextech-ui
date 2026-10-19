'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
export interface ListSortDescriptor {
  column: string;
  direction: 'ascending' | 'descending';
}
export interface AsyncListOptions<T> {
  load: (options: {
    signal: AbortSignal;
    cursor: string | null;
    filterText: string;
    sortDescriptor: ListSortDescriptor | null;
  }) => Promise<{ items: readonly T[]; cursor?: string | null }>;
  getKey: (item: T) => string;
  initialFilterText?: string;
  initialSortDescriptor?: ListSortDescriptor;
}
interface AsyncState<T> {
  items: readonly T[];
  cursor: string | null;
  error: Error | null;
  loadingState: 'idle' | 'loading' | 'loadingMore' | 'error';
}
export function useAsyncList<T>({
  load,
  getKey,
  initialFilterText = '',
  initialSortDescriptor,
}: AsyncListOptions<T>) {
  const [filterText, setFilterText] = useState(initialFilterText);
  const [sortDescriptor, setSortDescriptor] = useState<ListSortDescriptor | null>(
    initialSortDescriptor || null,
  );
  const [state, setState] = useState<AsyncState<T>>({
    items: [],
    cursor: null,
    error: null,
    loadingState: 'idle',
  });
  const latest = useRef({ load, getKey });
  const snapshot = useRef(state);
  const controller = useRef<AbortController | null>(null);
  useLayoutEffect(() => {
    latest.current = { load, getKey };
    snapshot.current = state;
  });
  const request = useCallback(
    async (more: boolean) => {
      if (more && (!snapshot.current.cursor || controller.current)) return;
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      const before = snapshot.current;
      const pending: AsyncState<T> = {
        ...before,
        items: more ? before.items : [],
        cursor: more ? before.cursor : null,
        error: null,
        loadingState: more ? 'loadingMore' : 'loading',
      };
      snapshot.current = pending;
      setState(pending);
      try {
        const result = await latest.current.load({
          signal: current.signal,
          cursor: more ? before.cursor : null,
          filterText,
          sortDescriptor,
        });
        if (current.signal.aborted || controller.current !== current) return;
        const items = more ? [...before.items, ...result.items] : [...result.items];
        const keys = new Set<string>();
        for (const item of items) {
          const key = latest.current.getKey(item);
          if (!key || keys.has(key))
            throw new Error('Async list keys must be nonempty and unique across pages.');
          keys.add(key);
        }
        const next: AsyncState<T> = {
          items,
          cursor: result.cursor || null,
          error: null,
          loadingState: 'idle',
        };
        snapshot.current = next;
        setState(next);
      } catch (error) {
        if (!current.signal.aborted && controller.current === current) {
          const next: AsyncState<T> = {
            ...pending,
            error: error instanceof Error ? error : new Error(String(error)),
            loadingState: 'error',
          };
          snapshot.current = next;
          setState(next);
        }
      } finally {
        if (controller.current === current) controller.current = null;
      }
    },
    [filterText, sortDescriptor],
  );
  useEffect(() => {
    void request(false);
    return () => {
      controller.current?.abort();
      controller.current = null;
    };
  }, [request]);
  return {
    ...state,
    filterText,
    setFilterText,
    sortDescriptor,
    sort: setSortDescriptor,
    isLoading: state.loadingState === 'loading' || state.loadingState === 'loadingMore',
    hasMore: Boolean(state.cursor),
    reload: () => request(false),
    loadMore: () => request(true),
  };
}
