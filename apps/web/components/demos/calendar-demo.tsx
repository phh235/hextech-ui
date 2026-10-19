'use client';

import { Calendar, RangeCalendar } from '@hextech-ui/react/calendar';

export function CalendarDemo() {
  return (
    <>
      <Calendar label="Session date" defaultValue="2026-10-17" referenceDate="2026-10-17" />
      <RangeCalendar label="Training window" defaultMonth="2026-10-01" referenceDate="2026-10-17" />
    </>
  );
}
