'use client';

import { useState } from 'react';
import { useListData } from '@hextech-ui/react/use-list-data';
import { SearchField } from '@hextech-ui/react/search-field';
import { Button } from '@hextech-ui/react/button';

const people = [
  { id: 'avery', name: 'Avery' },
  { id: 'rowan', name: 'Rowan' },
  { id: 'sage', name: 'Sage' },
  { id: 'quinn', name: 'Quinn' },
];
export function UseListDataDemo() {
  const [query, setQuery] = useState('');
  const list = useListData({
    initialItems: people.slice(0, 2),
    getKey: (item) => item.id,
    filter: (item, text) => item.name.toLowerCase().includes(text.toLowerCase()),
  });
  return (
    <section aria-label="Local list demo" className="grid w-full max-w-sm gap-3">
      <SearchField
        label="Filter local names"
        value={query}
        onValueChange={setQuery}
        onSearch={list.setFilterText}
        debounceMs={300}
      />
      <ul className="m-0 grid list-none gap-2 p-0">
        {list.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border border-hx-border p-2"
          >
            {item.name}
            <Button
              size="small"
              variant="dimmed"
              aria-label={'Remove ' + item.name}
              onClick={() => list.remove(item.id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button
          size="small"
          disabled={Boolean(list.getItem('sage'))}
          onClick={() => list.append(people[2]!)}
        >
          Add Sage
        </Button>
        <Button size="small" variant="dimmed" onClick={() => list.replace(people.slice(0, 2))}>
          Reset names
        </Button>
      </div>
    </section>
  );
}
