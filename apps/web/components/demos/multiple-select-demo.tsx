'use client';

import { MultipleSelect } from '@hextech-ui/react/multiple-select';

export function MultipleSelectDemo() {
  return (
    <>
      <MultipleSelect
        label="Party members"
        options={[
          { id: 'avery', name: 'Avery' },
          { id: 'rowan', name: 'Rowan' },
        ]}
        getOptionKey={(member) => member.id}
        itemToStringLabel={(member) => member.name}
        name="members"
      />
    </>
  );
}
