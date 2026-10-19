'use client';

import { ToggleGroup, Toggle } from '@hextech-ui/react/toggle';

export function ToggleDemo() {
  return (
    <>
      <ToggleGroup aria-label="Build view" defaultValue={['overview']}>
        <Toggle value="overview">Overview</Toggle>
        <Toggle value="details">Details</Toggle>
      </ToggleGroup>
    </>
  );
}
