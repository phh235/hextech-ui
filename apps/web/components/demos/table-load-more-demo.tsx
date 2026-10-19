'use client';

import { useState } from 'react';
import { TableLoadMoreItem } from '@hextech-ui/react/table-load-more';

export function TableLoadMoreDemo() {
  const [rows, setRows] = useState([1, 2, 3]);
  return (
    <table>
      <caption>Local practice notes</caption>
      <thead>
        <tr>
          <th scope="col">Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((id) => (
          <tr key={id}>
            <td>Plan {id}</td>
          </tr>
        ))}
        <TableLoadMoreItem
          loadKey={rows.length}
          hasMore={rows.length < 9}
          onLoadMore={async ({ signal }) => {
            // Local demo data; replace this with your own data source.
            if (signal.aborted) return;
            setRows((current) => [
              ...current,
              current.length + 1,
              current.length + 2,
              current.length + 3,
            ]);
          }}
        />
      </tbody>
    </table>
  );
}
