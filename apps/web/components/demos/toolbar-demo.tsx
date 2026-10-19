'use client';

import { Toolbar, ToolbarButton, ToolbarSeparator } from '@hextech-ui/react/toolbar';

export function ToolbarDemo() {
  return (
    <>
      <Toolbar aria-label="Build actions">
        <ToolbarButton>Save</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Share</ToolbarButton>
      </Toolbar>
    </>
  );
}
