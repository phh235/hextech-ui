'use client';

import { DateField, TimeField } from '@hextech-ui/react/date-field';

export function DateFieldDemo() {
  return (
    <>
      <DateField label="Session date" defaultValue="2026-10-17" />
      <TimeField label="Start time" defaultValue="19:30" />
    </>
  );
}
