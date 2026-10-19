'use client';

import { DatePicker, DateRangePicker } from '@hextech-ui/react/date-picker';

export function DatePickerDemo() {
  return (
    <>
      <DatePicker label="Session date" defaultValue="2026-10-17" referenceDate="2026-10-17" />
      <DateRangePicker label="Training" defaultMonth="2026-10-01" referenceDate="2026-10-17" />
    </>
  );
}
