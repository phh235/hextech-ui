'use client';

import { VirtualListbox } from '@hextech-ui/react/virtual-listbox';

export function VirtualListboxDemo() {
  return (
    <>
      <VirtualListbox
        label="Practice builds"
        items={Array.from({ length: 1000 }, (_, index) => ({
          id: String(index),
          label: 'Build ' + (index + 1),
        }))}
        multiple
      />
    </>
  );
}
