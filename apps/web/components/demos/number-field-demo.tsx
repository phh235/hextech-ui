'use client';

import { NumberField } from '@hextech-ui/react/number-field';

export function NumberFieldDemo() {
  return (
    <>
      <NumberField label="Party size" defaultValue={3} min={1} max={5} />
    </>
  );
}
