'use client';

import { Combobox } from '@hextech-ui/react/combobox';

export function ComboboxDemo() {
  return (
    <>
      <Combobox
        label="Party leader"
        options={[
          { id: 'avery', name: 'Avery' },
          { id: 'rowan', name: 'Rowan' },
        ]}
        getOptionKey={(member) => member.id}
        itemToStringLabel={(member) => member.name}
        name="leader"
      />
    </>
  );
}
