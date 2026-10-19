'use client';

import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@hextech-ui/react/collapsible';

export function CollapsibleDemo() {
  return (
    <>
      <Collapsible>
        <CollapsibleTrigger>Build notes</CollapsibleTrigger>
        <CollapsiblePanel>Adapt after the lane is understood.</CollapsiblePanel>
      </Collapsible>
    </>
  );
}
