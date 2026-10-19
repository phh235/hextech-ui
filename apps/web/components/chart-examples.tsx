'use client';
import { useState } from 'react';
import {
  LineChart,
  AreaChart,
  BarChart,
  RankingChart,
  ChartFrame,
  ChartLegend,
  HextechChart,
  defineChart,
  lineY,
  scalePoint,
  scaleLinear,
} from '@hextech-ui/react/charts';
const data = [
  { minute: '05', gold: 8, pressure: 5 },
  { minute: '10', gold: 14, pressure: 10 },
  { minute: '15', gold: 23, pressure: 18 },
  { minute: '20', gold: 31, pressure: 25 },
  { minute: '25', gold: 39, pressure: 36 },
];
const series = [
  { id: 'gold', label: 'Resources', value: (row: (typeof data)[number]) => row.gold },
  { id: 'pressure', label: 'Pressure', value: (row: (typeof data)[number]) => row.pressure },
];
const x = (row: (typeof data)[number]) => row.minute;
const custom = defineChart({
  marks: [lineY(data, { x: 'minute', y: 'gold' })],
  scales: {
    x: { scale: () => scalePoint<string>().padding(0.3) },
    y: { scale: scaleLinear, grid: true },
  },
  svgAnimation: false,
});
export default function ChartExamples() {
  const [selected, setSelected] = useState('Explore points with the arrow keys.');
  return (
    <div className="grid w-full min-w-0 gap-5">
      <LineChart
        title="Training timeline"
        description="Fictional readings for this local demo."
        data={data}
        x={x}
        xLabel="Minute"
        series={series}
        onSelect={(row, id) => setSelected(`Selected ${id} at minute ${row.minute}`)}
      />
      <p role="status" className="m-0 text-xs text-muted-foreground">
        {selected}
      </p>
      <AreaChart title="Resource growth" data={data} x={x} series={series} curve="smooth" />
      <BarChart title="Session comparison" data={data.slice(0, 3)} x={x} series={series} />
      <RankingChart
        title="Practice priorities"
        data={[
          { name: 'Vision', value: 82 },
          { name: 'Timing', value: 67 },
          { name: 'Positioning', value: 74 },
        ]}
        label={(row) => row.name}
        value={(row) => row.value}
      />
      <ChartFrame
        title="Compose your own"
        description="Frames and legends are also exported independently."
      >
        <HextechChart
          definition={custom}
          ariaLabel="Custom resource chart"
          height={200}
          initialWidth={600}
        />
        <ChartLegend
          items={[
            { id: 'gold', label: 'Resources' },
            { id: 'teal', label: 'Pressure' },
          ]}
        />
      </ChartFrame>
    </div>
  );
}
