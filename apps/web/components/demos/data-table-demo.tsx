'use client';

import { DataTable } from '@hextech-ui/react/data-table';

export function DataTableDemo() {
  return (
    <>
      <DataTable
        label="Practice roster"
        data={[{ id: 'avery', name: 'Avery', score: 62 }]}
        columns={[
          { id: 'name', header: 'Player', accessor: (row) => row.name },
          { id: 'score', header: 'Score', accessor: (row) => row.score },
        ]}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        selectionMode="multiple"
        resizable
      />
    </>
  );
}
