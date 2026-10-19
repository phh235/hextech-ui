'use client';

import { Slider } from '@hextech-ui/react/slider';

export function SliderDemo() {
  return (
    <>
      <Slider label="Intensity" defaultValue={40} />
      <Slider
        label="Preferred range"
        defaultValue={[25, 75]}
        thumbLabels={['Minimum', 'Maximum']}
      />
    </>
  );
}
