'use client';

import { useState } from 'react';
import { useAsyncList } from '@hextech-ui/react/use-async-list';
import { SearchField } from '@hextech-ui/react/search-field';
import { Button } from '@hextech-ui/react/button';

const people = [
  { id: 'avery', name: 'Avery' },
  { id: 'rowan', name: 'Rowan' },
  { id: 'sage', name: 'Sage' },
  { id: 'quinn', name: 'Quinn' },
];
export function UseAsyncListDemo() {
  const [query, setQuery] = useState('');
  const list = useAsyncList({
    getKey: (item: (typeof people)[number]) => item.id,
    load: async ({ signal, cursor, filterText }) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      signal.throwIfAborted();
      const filtered = people.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase()),
      );
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
      />
      <ul aria-busy={list.isLoading} className="m-0 grid list-none gap-2 p-0">
        {list.items.map((item) => (
          <li key={item.id} className="border border-hx-border p-2">
            {item.name}
          </li>
        ))}
      </ul>
      {list.error && <p role="alert">{list.error.message}</p>}
      <p role="status">
        {list.isLoading ? 'Loading local demo data…' : list.items.length + ' names loaded'}
      </p>
      <div className="flex gap-2">
        <Button
          size="small"
          disabled={query !== list.filterText || !list.hasMore}
          loading={list.isLoading}
          onClick={() => void list.loadMore()}
        >
          Load more names
        </Button>
        <Button size="small" variant="dimmed" onClick={() => void list.reload()}>
          Reload names
        </Button>
      </div>
    </section>
  );
}
