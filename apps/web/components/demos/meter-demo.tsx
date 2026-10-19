'use client';

import { Meter } from '@hextech-ui/react/meter';

export function MeterDemo() {
  return (
    <>
      <div className="grid w-full max-w-sm gap-5">
        <Meter
          label="Health"
          value={720}
          max={1000}
          getAriaValueText={(_, value) => value + ' of 1000 health'}
        />
        <Meter label="Energy" tone="gold" value={35} max={100} />
      </div>
    </>
  );
}
