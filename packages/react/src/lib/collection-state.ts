'use client';
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { restoreFocus } from '@/lib/focus-restoration';

/** Drop only previously present keys that disappeared from the owner's collection. */
export function useCollectionSelection({
  ids,
  value,
  defaultValue = [],
  onValueChange,
}: {
  ids: readonly string[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onValueChange?: ((keys: string[]) => void) | undefined;
}) {
  const [local, setLocal] = useState<readonly string[]>(defaultValue);
  const previous = useRef(ids);
  const keys = value ?? local;
  useLayoutEffect(() => {
    const current = new Set(ids);
    const removed = new Set(previous.current.filter((id) => !current.has(id)));
    previous.current = ids;
    if (!removed.size) return;
    const next = keys.filter((id) => !removed.has(id));
    if (next.length === keys.length) return;
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  }, [ids, keys, value, onValueChange]);
  return [
    keys,
    (next: string[]) => {
      if (value === undefined) setLocal(next);
      onValueChange?.(next);
    },
  ] as const;
}

/** Keep the user's focus in a changing collection after its focused DOM is removed. */
export function useCollectionFocus({
  root,
  ids,
  getItem,
  entryId,
  hiddenAncestor,
  enabled = true,
}: {
  root: RefObject<HTMLElement | null>;
  ids: readonly string[];
  getItem: (id: string) => HTMLElement | undefined;
  entryId?: string | undefined;
  hiddenAncestor?: ((id: string) => string | undefined) | undefined;
  enabled?: boolean;
}) {
  const owner = useRef<{ id: string; element: HTMLElement } | null>(null);
  const previous = useRef(ids);
  useEffect(() => {
    if (!enabled) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) owner.current = null;
    };
    const blur = () => {
      owner.current = null;
    };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('blur', blur);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('blur', blur);
    };
  }, [root, enabled]);
  useLayoutEffect(() => {
    const old = previous.current;
    previous.current = ids;
    const focused = owner.current;
    if (!enabled) {
      owner.current = null;
      return;
    }
    if (!focused) {
      if (!old.length && ids.length && document.activeElement === root.current) {
        const first = ids.find((id) => getItem(id));
        const target =
          (entryId === undefined ? undefined : getItem(entryId)) ??
          (first === undefined ? undefined : getItem(first));
        restoreFocus(target);
      }
      return;
    }
    if (ids.includes(focused.id) && focused.element.isConnected) return;
    const active = document.activeElement;
    if (active !== document.body && active !== focused.element && !focused.element.contains(active))
      return;
    const at = old.indexOf(focused.id);
    const available = new Set(ids);
    const ancestor = hiddenAncestor?.(focused.id);
    const candidates = [
      focused.id,
      ...(ancestor ? [ancestor] : []),
      ...old.slice(at + 1),
      ...old.slice(0, at).reverse(),
      ...ids,
    ];
    const targetId = candidates.find((id) => available.has(id) && getItem(id));
    const target = targetId === undefined ? undefined : getItem(targetId);
    owner.current = null;
    restoreFocus(target ?? root.current);
  });
  return {
    trackFocus(id: string, element: HTMLElement) {
      if (enabled) owner.current = { id, element };
    },
    releaseFocus(next: EventTarget | null) {
      if (next && (!(next instanceof Node) || !root.current?.contains(next))) owner.current = null;
    },
  };
}
