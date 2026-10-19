'use client';
import { useState } from 'react';
import { DataTable, type DataColumn } from '@hextech-ui/react/data-table';
import { Input } from '@hextech-ui/react/input';
interface Player {
  id: string;
  name: string;
  score: number;
  note: string;
}
const initial: Player[] = [
  { id: 'avery', name: 'Avery', score: 62, note: 'Vision' },
  { id: 'rowan', name: 'Rowan', score: 84, note: 'Tempo' },
  { id: 'sage', name: 'Sage', score: 71, note: 'Practice' },
  { id: 'quinn', name: 'Quinn', score: 95, note: 'Review' },
  { id: 'river', name: 'River', score: 57, note: 'Roaming' },
];
export default function DataTableExample({ disabled = false }: { disabled?: boolean }) {
  const [rows, setRows] = useState(initial);
  const columns: DataColumn<Player>[] = [
    { id: 'name', header: 'Player', accessor: (row) => row.name, width: 170 },
    { id: 'score', header: 'Score', accessor: (row) => row.score, width: 120, align: 'end' },
    {
      id: 'note',
      header: 'Note',
      accessor: (row) => row.note,
      width: 190,
      sortable: false,
      cell: (row) => (
        <Input
          aria-label={`Note for ${row.name}`}
          value={row.note}
          disabled={disabled}
          onValueChange={(note) =>
            setRows((items) => items.map((item) => (item.id === row.id ? { ...item, note } : item)))
          }
        />
      ),
    },
  ];
  return (
    <DataTable
      label="Practice roster"
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.name}
      disabled={disabled}
      keyboardNavigation="cell"
      selectionMode="multiple"
      pageSize={3}
      resizable
      onReorder={(id, target, position) =>
        setRows((items) => {
          const source = items.find((item) => item.id === id);
          if (!source) return items;
          const remaining = items.filter((item) => item.id !== id);
          const at = remaining.findIndex((item) => item.id === target);
          return [
            ...remaining.slice(0, at + (position === 'after' ? 1 : 0)),
            source,
            ...remaining.slice(at + (position === 'after' ? 1 : 0)),
          ];
        })
      }
    />
  );
}

export function DataTableLoadingExample() {
  const [requests, setRequests] = useState(0);
  const [rows, setRows] = useState<Player[]>(() =>
    Array.from({ length: 12 }, (_, index) => ({
      id: `entry-${index + 1}`,
      name: `Player ${index + 1}`,
      score: 50 + index,
      note: 'Local example',
    })),
  );
  const columns: DataColumn<Player>[] = [
    { id: 'name', header: 'Player', accessor: (row) => row.name },
    { id: 'score', header: 'Score', accessor: (row) => row.score, align: 'end' },
  ];
  return (
    <section aria-label="Data table loading demo" className="w-full min-w-0 space-y-3">
      <p className="text-sm text-muted-foreground">
        Scroll to load generated local rows. No server request or account is involved.
      </p>
      <DataTable
        label="Loading practice roster"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        keyboardNavigation="cell"
        scrollAreaClassName="max-h-64 overflow-auto"
        pageSize={50}
        autoLoadMore
        hasMore={rows.length < 18}
        onLoadMore={async ({ signal }) => {
          setRequests((value) => value + 1);
          await new Promise<void>((resolve) => {
            const complete = () => {
              clearTimeout(timer);
              signal.removeEventListener('abort', complete);
              resolve();
            };
            const timer = setTimeout(complete, 220);
            signal.addEventListener('abort', complete, { once: true });
          });
          if (signal.aborted) return;
          setRows((current) => [
            ...current,
            ...Array.from({ length: 3 }, (_, index) => {
              const value = current.length + index + 1;
              return {
                id: `entry-${value}`,
                name: `Player ${value}`,
                score: 50 + value - 1,
                note: 'Local example',
              };
            }),
          ]);
        }}
      />
      <p className="text-xs text-muted-foreground">
        <output data-roster-count>{rows.length}</output> rows ·{' '}
        <output data-roster-requests>{requests}</output> requests
      </p>
    </section>
  );
}
