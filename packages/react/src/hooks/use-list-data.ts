'use client';
import { useMemo, useRef, useState } from 'react';
export interface ListDataOptions<T> {
  initialItems?: readonly T[];
  getKey: (item: T) => string;
  filter?: (item: T, query: string) => boolean;
  initialSelectedKeys?: readonly string[];
}
export function useListData<T>({
  initialItems = [],
  getKey,
  filter,
  initialSelectedKeys = [],
}: ListDataOptions<T>) {
  const key = useRef(getKey);
  key.current = getKey;
  const [items, setItems] = useState<readonly T[]>(() => validate(initialItems, getKey));
  const [selectedKeys, setSelectedKeys] = useState<readonly string[]>(initialSelectedKeys);
  const [filterText, setFilterText] = useState('');
  const visible = useMemo(
    () => (filter && filterText ? items.filter((item) => filter(item, filterText)) : items),
    [items, filter, filterText],
  );
  function change(update: (current: readonly T[]) => readonly T[]) {
    setItems((current) => validate(update(current), key.current));
  }
  return {
    items: visible,
    allItems: items,
    selectedKeys: selectedKeys.filter((id) => items.some((item) => getKey(item) === id)),
    setSelectedKeys,
    filterText,
    setFilterText,
    getItem: (id: string) => items.find((item) => getKey(item) === id),
    append: (...next: T[]) => change((current) => [...current, ...next]),
    prepend: (...next: T[]) => change((current) => [...next, ...current]),
    insert: (index: number, ...next: T[]) =>
      change((current) => {
        const at = Math.max(0, Math.min(current.length, index));
        return [...current.slice(0, at), ...next, ...current.slice(at)];
      }),
    remove: (...ids: string[]) => {
      change((current) => current.filter((item) => !ids.includes(key.current(item))));
      setSelectedKeys((current) => current.filter((id) => !ids.includes(id)));
    },
    update: (id: string, value: T) =>
      change((current) => current.map((item) => (key.current(item) === id ? value : item))),
    move: (id: string, targetIndex: number) =>
      change((current) => {
        const item = current.find((entry) => key.current(entry) === id);
        if (!item) return current;
        const remaining = current.filter((entry) => key.current(entry) !== id);
        const at = Math.max(0, Math.min(remaining.length, targetIndex));
        return [...remaining.slice(0, at), item, ...remaining.slice(at)];
      }),
    replace: (next: readonly T[]) => change(() => next),
  };
}
function validate<T>(items: readonly T[], getKey: (item: T) => string): readonly T[] {
  const keys = new Set<string>();
  for (const item of items) {
    const key = getKey(item);
    if (!key || keys.has(key)) throw new Error('List keys must be nonempty and unique.');
    keys.add(key);
  }
  return [...items];
}
