'use client';

import { LineChart } from '@hextech-ui/react/charts';

export function ChartsDemo() {
  return (
    <>
      <LineChart
        title="Practice resources"
        data={[
          { minute: '05', resources: 8 },
          { minute: '10', resources: 14 },
        ]}
        x={(row) => row.minute}
        series={[{ id: 'resources', label: 'Resources', value: (row) => row.resources }]}
      />
    </>
  );
}
