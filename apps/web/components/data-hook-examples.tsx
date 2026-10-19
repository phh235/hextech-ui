'use client';
import { useState } from 'react';
import { useAsyncList, useListData, Button, SearchField } from '@hextech-ui/react';
const people = [
  { id: 'avery', name: 'Avery' },
  { id: 'rowan', name: 'Rowan' },
  { id: 'sage', name: 'Sage' },
  { id: 'quinn', name: 'Quinn' },
];
export function DataHookExample({ name, disabled = false }: { name: string; disabled?: boolean }) {
  return name === 'use-list-data' ? (
    <LocalList disabled={disabled} />
  ) : (
    <AsyncList disabled={disabled} />
  );
}
function LocalList({ disabled }: { disabled: boolean }) {
  const [query, setQuery] = useState('');
  const list = useListData({
    initialItems: people.slice(0, 2),
    getKey: (item) => item.id,
    filter: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
  });
  return (
    <section aria-label="Local list demo" className="grid w-full max-w-sm gap-3">
      <SearchField
        label="Filter local names"
        value={query}
        onValueChange={setQuery}
        onSearch={list.setFilterText}
        debounceMs={300}
        disabled={disabled}
      />
      <ul className="m-0 grid list-none gap-2 p-0">
        {list.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 border border-hx-border p-2"
          >
            <span>{item.name}</span>
            <Button
              size="small"
              variant="dimmed"
              disabled={disabled}
              onClick={() => list.remove(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button
          size="small"
          disabled={disabled || Boolean(list.getItem('sage'))}
          onClick={() => list.append(people[2]!)}
        >
          Add Sage
        </Button>
        <Button
          size="small"
          disabled={disabled}
          variant="dimmed"
          onClick={() => list.replace(people.slice(0, 2))}
        >
          Reset names
        </Button>
      </div>
    </section>
  );
}
function AsyncList({ disabled }: { disabled: boolean }) {
  const [query, setQuery] = useState('');
  const list = useAsyncList({
    getKey: (item: (typeof people)[number]) => item.id,
    load: async ({ signal, cursor, filterText }) => {
      await new Promise((resolve) => setTimeout(resolve, filterText === 'slow' ? 350 : 50));
      if (signal.aborted && filterText !== 'slow')
        throw new DOMException('Cancelled', 'AbortError');
      if (filterText === 'error') throw new Error('Demo load failed. Change the filter to retry.');
      const filtered =
        filterText === 'slow'
          ? [{ id: 'stale', name: 'Stale result' }]
          : people.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
      const offset = Number(cursor || 0);
      return {
        items: filtered.slice(offset, offset + 2),
        cursor: offset + 2 < filtered.length ? String(offset + 2) : null,
      };
    },
  });
  return (
    <section aria-label="Async list demo" className="grid w-full max-w-sm gap-3">
      <SearchField
        label="Filter async names"
        value={query}
        onValueChange={setQuery}
        onSearch={list.setFilterText}
        debounceMs={300}
        disabled={disabled}
      />
      <div aria-busy={list.isLoading}>
        <ul className="m-0 grid list-none gap-2 p-0">
          {list.items.map((item) => (
            <li key={item.id} className="border border-hx-border p-2">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {list.error && (
        <p role="alert" className="m-0 text-hx-sm text-hx-destructive">
          {list.error.message}
        </p>
      )}
      <p role="status" className="m-0 text-hx-xs text-hx-muted-foreground">
        {list.isLoading ? 'Loading local demo data…' : `${list.items.length} names loaded`}
      </p>
      <div className="flex gap-2">
        <Button
          size="small"
          disabled={disabled || query !== list.filterText || !list.hasMore}
          loading={list.isLoading}
          onClick={() => void list.loadMore()}
        >
          Load more names
        </Button>
        <Button
          size="small"
          disabled={disabled}
          variant="dimmed"
          onClick={() => void list.reload()}
        >
          Reload names
        </Button>
      </div>
      <p className="m-0 text-hx-xs text-hx-muted-foreground">
        Simulated local data. Try “slow” followed quickly by “Avery” to exercise stale-request
        cancellation.
      </p>
    </section>
  );
}
