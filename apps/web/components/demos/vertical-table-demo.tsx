'use client';

import { VerticalTable } from '@hextech-ui/react/vertical-table';

export function VerticalTableDemo() {
  return (
    <>
      <VerticalTable
        label="Build comparison"
        records={[{ id: 'balanced', power: 65 }]}
        recordKey={(record) => record.id}
        fields={[{ id: 'power', label: 'Power', render: (record) => record.power }]}
      />
    </>
  );
}
